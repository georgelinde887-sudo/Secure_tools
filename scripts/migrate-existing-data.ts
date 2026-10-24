import { Client } from 'pg';
import { getAllCategories, getAllSoftware } from '../src/lib/data';

async function migrate() {
  const password = encodeURIComponent(process.env.SUPABASE_DB_PASSWORD || 'EWG@@Yy*GsHkB5E');
  const connectionString = `postgresql://postgres.dpygfnfznubzpnouoafw:${password}@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres`;
  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });

  console.log('Connecting to database...');
  await client.connect();

  try {
    // Clean up any initial partial categories
    await client.query("DELETE FROM public.categories WHERE id LIKE 'cat-%'");

    // 1. Migrate Categories
    const categories = getAllCategories();
    console.log(`Migrating ${categories.length} categories...`);

    for (const cat of categories) {
      await client.query(
        `INSERT INTO public.categories (id, slug, name, pillar, description, icon_name, tool_count, featured)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (id) DO UPDATE SET
           slug = EXCLUDED.slug,
           name = EXCLUDED.name,
           pillar = EXCLUDED.pillar,
           description = EXCLUDED.description,
           icon_name = EXCLUDED.icon_name,
           tool_count = EXCLUDED.tool_count,
           featured = EXCLUDED.featured`,
        [
          cat.slug, // Use slug as canonical id
          cat.slug,
          cat.name,
          cat.pillar || '',
          cat.description || '',
          cat.iconName || '',
          cat.toolCount || 0,
          cat.featured ?? false,
        ]
      );
    }
    console.log('Categories migrated successfully!');

    // 2. Migrate Software Listings
    const softwareList = getAllSoftware();
    console.log(`Migrating ${softwareList.length} software listings...`);

    for (const item of softwareList) {
      const listingType = (item.itemType || 'software') as 'software' | 'open-source' | 'extension' | 'plugin';

      // Insert main listing
      await client.query(
        `INSERT INTO public.listings (
           id, listing_type, name, slug, tagline, short_description, full_description,
           official_website_url, category_id, logo_url, pricing_model, starting_price,
           submission_plan, submission_status, link_attribute, featured, published_at
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW())
         ON CONFLICT (id) DO UPDATE SET
           listing_type = EXCLUDED.listing_type,
           name = EXCLUDED.name,
           slug = EXCLUDED.slug,
           tagline = EXCLUDED.tagline,
           short_description = EXCLUDED.short_description,
           full_description = EXCLUDED.full_description,
           official_website_url = EXCLUDED.official_website_url,
           category_id = EXCLUDED.category_id,
           logo_url = EXCLUDED.logo_url,
           pricing_model = EXCLUDED.pricing_model,
           starting_price = EXCLUDED.starting_price,
           submission_status = 'published',
           link_attribute = EXCLUDED.link_attribute,
           featured = EXCLUDED.featured,
           updated_at = NOW()`,
        [
          item.id,
          listingType,
          item.name,
          item.slug,
          item.tagline || '',
          item.shortDescription || item.tagline || '',
          item.fullOverview || item.shortDescription || '',
          item.websiteUrl,
          item.primaryCategory,
          item.logoUrl || null,
          item.pricingModel || 'Freemium',
          item.startingPrice || '',
          'free',
          'published',
          'nofollow',
          item.featured ?? false,
        ]
      );

      // Insert or update listing details
      const platforms = item.platforms || [];
      const deployment = item.deployment || [];
      const keyFeatures = item.keyFeatures || [];
      const integrations = item.integrations || [];

      await client.query(
        `INSERT INTO public.listing_details (
           listing_id, platforms, deployment, key_features, integrations,
           extra_metadata
         )
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (listing_id) DO UPDATE SET
           platforms = EXCLUDED.platforms,
           deployment = EXCLUDED.deployment,
           key_features = EXCLUDED.key_features,
           integrations = EXCLUDED.integrations,
           extra_metadata = EXCLUDED.extra_metadata,
           updated_at = NOW()`,
        [
          item.id,
          JSON.stringify(platforms),
          JSON.stringify(deployment),
          JSON.stringify(keyFeatures),
          JSON.stringify(integrations),
          JSON.stringify({
            security: item.security,
            fileCapabilities: item.fileCapabilities,
            storageCapabilities: item.storageCapabilities,
            bestFitUseCases: item.bestFitUseCases,
            advantages: item.advantages,
            limitations: item.limitations,
            faqs: item.faqs,
            officialSources: item.officialSources,
            verificationStatus: item.verificationStatus,
            verifiedDate: item.verifiedDate,
            verifiedBy: item.verifiedBy,
          }),
        ]
      );
    }

    console.log('Software listings migrated successfully!');

    // Check counts in DB
    const catCount = await client.query('SELECT count(*) FROM public.categories');
    const listingCount = await client.query('SELECT count(*) FROM public.listings');
    console.log(`Reconciled database counts: ${catCount.rows[0].count} categories, ${listingCount.rows[0].count} listings.`);
  } catch (err) {
    console.error('Migration error:', err);
    throw err;
  } finally {
    await client.end();
  }
}

migrate();
