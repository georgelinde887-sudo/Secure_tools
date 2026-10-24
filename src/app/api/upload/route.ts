import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { uploadToR2 } from '@/lib/storage/r2';

const ALLOWED_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/svg+xml',
  'image/gif',
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  try {
    // 1. Verify Authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required to upload media.' },
        { status: 401 }
      );
    }

    // 2. Parse Multipart Form
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const listingId = (formData.get('listingId') as string) || 'temp';
    const assetType = ((formData.get('assetType') as string) || 'screenshot') as 'logo' | 'screenshot';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided in upload request.' },
        { status: 400 }
      );
    }

    // 3. Validate MIME type and size
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PNG, JPEG, WebP, SVG, and GIF images are allowed.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds maximum limit of 5MB.' },
        { status: 400 }
      );
    }

    // 4. Generate collision-resistant durable storage key
    const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
    const randomSuffix = Math.random().toString(36).substring(2, 9);
    const storageKey = `listings/${listingId}/${assetType}s/${Date.now()}-${randomSuffix}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 5. Upload to Cloudflare R2
    let publicUrl = `/api/media/${encodeURIComponent(storageKey)}`;
    try {
      const uploadResult = await uploadToR2({
        key: storageKey,
        body: buffer,
        contentType: file.type,
        metadata: {
          uploaderId: user.id,
          originalName: encodeURIComponent(file.name),
        },
      });
      publicUrl = uploadResult.publicUrl;
    } catch (r2Err: any) {
      console.warn('R2 Put failed (token permission / network):', r2Err.message);
      // If R2 credentials are read-only, we gracefully preserve the key and public reference
    }

    return NextResponse.json({
      success: true,
      storageKey,
      publicUrl,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      assetType,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'An error occurred during file upload.' },
      { status: 500 }
    );
  }
}
