import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { getAdminClient } from '@/lib/supabase/admin';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

/**
 * Automatically captures a full/hero website screenshot using headless Chrome,
 * uploads it to Supabase Storage, and associates it with the listing record.
 */
export async function captureAndStoreWebsiteScreenshot(
  url: string,
  slug: string,
  listingId?: string
): Promise<string | null> {
  if (!url || !url.startsWith('http')) return null;

  const cleanSlug = slug.toLowerCase().replace(/[\s_]+/g, '-').replace(/[^\w-]/g, '');
  const tmpFile = `/tmp/auto_shot_${cleanSlug}_${Date.now()}.png`;
  const userDataDir = `/tmp/chrome_worker_${cleanSlug}_${Date.now()}`;

  return new Promise((resolve) => {
    // Run headless Chrome command asynchronously
    const cmd = `"${CHROME_PATH}" --headless=new --user-data-dir="${userDataDir}" --screenshot="${tmpFile}" --window-size=1280,800 --no-sandbox --hide-scrollbars "${url}"`;

    exec(cmd, { timeout: 25000 }, async (error) => {
      try {
        if (!fs.existsSync(tmpFile)) {
          console.warn(`[Screenshot] Chrome failed to produce file for ${url}:`, error?.message);
          resolve(null);
          return;
        }

        const fileBuf = fs.readFileSync(tmpFile);
        const admin = getAdminClient();
        const storagePath = `screenshots/${cleanSlug}.png`;

        // 1. Upload to Supabase Storage (listing-assets bucket)
        const { error: uploadError } = await admin.storage
          .from('listing-assets')
          .upload(storagePath, fileBuf, {
            contentType: 'image/png',
            upsert: true,
          });

        if (uploadError) {
          console.error('[Screenshot] Supabase upload failed:', uploadError.message);
        }

        const { data: pubData } = admin.storage
          .from('listing-assets')
          .getPublicUrl(storagePath);

        const publicUrl = pubData?.publicUrl || `/screenshots/${cleanSlug}.png`;

        // 2. Cache locally in public/screenshots
        try {
          const publicDir = path.join(process.cwd(), 'public', 'screenshots');
          if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir, { recursive: true });
          }
          fs.writeFileSync(path.join(publicDir, `${cleanSlug}.png`), fileBuf);
        } catch (fsErr) {
          console.warn('[Screenshot] Failed saving local fallback:', fsErr);
        }

        // 3. Associate with listing_assets in database if listingId provided
        if (listingId) {
          try {
            await (admin.from('listing_assets') as any).delete().eq('listing_id', listingId);
            await (admin.from('listing_assets') as any).insert({
              listing_id: listingId,
              storage_key: storagePath,
              public_url: publicUrl,
              asset_type: 'screenshot',
              display_order: 0,
            });
          } catch (dbErr) {
            console.warn('[Screenshot] DB insert warning:', dbErr);
          }
        }

        // Clean up temporary files
        try {
          fs.unlinkSync(tmpFile);
          fs.rmSync(userDataDir, { recursive: true, force: true });
        } catch {}

        console.log(`[Screenshot] Successfully captured & saved screenshot for ${slug}: ${publicUrl}`);
        resolve(publicUrl);
      } catch (err: any) {
        console.error('[Screenshot] Error processing screenshot:', err.message);
        resolve(null);
      }
    });
  });
}
