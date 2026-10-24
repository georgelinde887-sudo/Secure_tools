import { unstable_cache } from 'next/cache';
import { getAdminClient } from '@/lib/supabase/admin';
import { SOFTWARE_LISTINGS } from '@/data/software';
import { CATEGORIES } from '@/data/categories';
import { SoftwareItem, Category, PricingModel, PricingPlan } from '@/types';

// Parse raw pricing plans string or array into structured plans
export function parsePricingPlans(rawPlans: any): PricingPlan[] {
  if (!rawPlans) return [];
  if (Array.isArray(rawPlans)) {
    return rawPlans.map((p) => {
      if (typeof p === 'string') {
        return { name: p, description: p };
      }
      return {
        name: p.name || 'Standard Plan',
        monthlyPrice: p.monthlyPrice || p.price || undefined,
        yearlyPrice: p.yearlyPrice || undefined,
        billingPeriod: p.billingPeriod || 'month',
        description: p.description || (Array.isArray(p.features) ? p.features.join(', ') : undefined),
        features: Array.isArray(p.features) ? p.features : [],
        isPopular: Boolean(p.isPopular),
      };
    });
  }

  if (typeof rawPlans === 'string') {
    const lines = rawPlans.split('\n').filter((l) => l.trim().length > 0);
    const plans: PricingPlan[] = [];

    for (const line of lines) {
      const clean = line.replace(/^[-*•]\s*/, '').trim();
      const colonIdx = clean.indexOf(':');
      if (colonIdx === -1) {
        if (clean.length > 3) plans.push({ name: clean, description: clean });
        continue;
      }

      const name = clean.substring(0, colonIdx).trim();
      const details = clean.substring(colonIdx + 1).trim();

      let monthly: string | undefined = undefined;
      let yearly: string | undefined = undefined;

      const monthlyMatch = details.match(/\$([0-9.]+)(?:\/[a-zA-Z]+)?\s*(?:billed monthly|monthly|per month)/i) || details.match(/\$([0-9.]+)\/mo/i);
      const annualMatch = details.match(/\$([0-9.]+)(?:\/[a-zA-Z]+)?\s*(?:billed annually|annual|yearly|per year)/i);

      if (monthlyMatch) monthly = `$${monthlyMatch[1]}/mo`;
      if (annualMatch) yearly = `$${annualMatch[1]}/mo (annual)`;

      if (details.toLowerCase().includes('custom quote') || details.toLowerCase().includes('contact')) {
        monthly = 'Custom quote';
        yearly = 'Custom quote';
      } else if (details.toLowerCase().startsWith('$0') || details.toLowerCase().includes('free tier') || details.toLowerCase().includes('free trial')) {
        monthly = '$0';
        yearly = '$0';
      }

      let desc = details;
      const parts = details.split(/,\s*(?=[A-Z0-9])/);
      if (parts.length > 1) {
        desc = parts.slice(1).join(', ');
      }

      plans.push({
        name,
        monthlyPrice: monthly,
        yearlyPrice: yearly,
        description: desc,
      });
    }

    return plans;
  }

  return [];
}

// Map a Supabase row to the frontend SoftwareItem structure
export function mapListingToSoftwareItem(row: any): SoftwareItem {
  const details = Array.isArray(row.listing_details) ? row.listing_details[0] : (row.listing_details || {});
  const extra = details.extra_metadata || {};

  const pricingModel = (row.pricing_model || 'Freemium') as PricingModel;
  const freeTierAvailable =
    pricingModel === 'Free' ||
    pricingModel === 'Freemium' ||
    pricingModel === 'Open Source' ||
    Boolean(extra.fileCapabilities?.freeTierAvailable);

  const platforms = Array.isArray(details.platforms) && details.platforms.length > 0
    ? details.platforms
    : (Array.isArray(extra.platforms) ? extra.platforms : ['Web']);

  const deployment = Array.isArray(details.deployment) && details.deployment.length > 0
    ? details.deployment
    : (Array.isArray(extra.deployment) ? extra.deployment : ['Cloud SaaS']);

  const keyFeatures = Array.isArray(details.key_features) && details.key_features.length > 0
    ? details.key_features
    : (Array.isArray(extra.keyFeatures) ? extra.keyFeatures : []);

  const integrations = Array.isArray(details.integrations) && details.integrations.length > 0
    ? details.integrations
    : (Array.isArray(extra.integrations) ? extra.integrations : []);

  const alternatives = Array.isArray(details.alternatives) && details.alternatives.length > 0
    ? details.alternatives
    : (Array.isArray(extra.alternatives) ? extra.alternatives : []);

  const assets = Array.isArray(row.listing_assets) ? row.listing_assets : [];
  const dbScreenshots = assets
    .filter((a: any) => a.asset_type === 'screenshot')
    .sort((a: any, b: any) => (a.display_order ?? 0) - (b.display_order ?? 0))
    .map((a: any) => a.public_url)
    .filter(Boolean);
  const fallbackScreenshots = Array.isArray(extra.screenshots) ? extra.screenshots : [];
  let screenshots = dbScreenshots.length > 0 ? dbScreenshots : fallbackScreenshots;
  if (screenshots.length === 0 && row.slug) {
    screenshots = [
      `https://dpygfnfznubzpnouoafw.supabase.co/storage/v1/object/public/listing-assets/screenshots/${row.slug}.png`,
    ];
  }

  const youtubeVideoUrl = details.youtube_url || extra.youtubeVideoUrl || extra.youtubeUrl || extra.videoUrl || undefined;

  let logoUrl = row.logo_url || undefined;
  // Guard against any oversized base64 data URLs to prevent Next.js data cache from exceeding 2MB
  if (logoUrl && logoUrl.startsWith('data:image/') && logoUrl.length > 20000) {
    logoUrl = undefined;
  }
  if (!logoUrl && row.official_website_url) {
    try {
      const domain = new URL(row.official_website_url).hostname.replace(/^www\./, '');
      if (domain) {
        logoUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
      }
    } catch {
      const domain = row.official_website_url.replace(/^https?:\/\//, '').split('/')[0].replace(/^www\./, '');
      if (domain) {
        logoUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
      }
    }
  }

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    tagline: row.tagline || '',
    shortDescription: row.short_description || row.tagline || '',
    fullOverview: row.full_description || row.short_description || '',
    websiteUrl: row.official_website_url || '',
    logoUrl,
    itemType: (row.listing_type || (pricingModel === 'Open Source' ? 'open-source' : 'software')) as any,
    repositoryUrl: details.repository_url || extra.repositoryUrl || extra.repository_url || undefined,
    extensionStoreUrl: details.extension_store_url || extra.extensionStoreUrl || extra.extension_store_url || undefined,
    browserCompatibility: Array.isArray(details.browser_compatibility) ? details.browser_compatibility : (Array.isArray(extra.browserCompatibility) ? extra.browserCompatibility : []),
    mcpProtocol: details.mcp_protocol || extra.mcpProtocol || extra.mcp_protocol || undefined,
    mcpRunCommand: details.mcp_run_command || extra.mcpRunCommand || extra.mcp_run_command || undefined,
    mcpConfigSnippet: details.mcp_config_snippet || extra.mcpConfigSnippet || extra.mcp_config_snippet || undefined,
    mcpPlatforms: Array.isArray(details.mcp_platforms) ? details.mcp_platforms : (Array.isArray(extra.mcpPlatforms) ? extra.mcpPlatforms : []),
    license: details.license || extra.license || undefined,
    primaryCategory: row.category_id || 'secure-file-sharing',
    secondaryCategories: Array.isArray(extra.secondaryCategories) ? extra.secondaryCategories : [],
    pricingModel,
    startingPrice: row.starting_price || undefined,
    freeTierAvailable,
    freeTrialDays: extra.freeTrialDays || undefined,
    deployment,
    platforms,
    security: extra.security || {
      encryptionAtRest: 'AES-256',
      encryptionInTransit: 'TLS 1.3',
      endToEndEncrypted: false,
      zeroKnowledgeArchitecture: false,
      clientSideEncryption: false,
      certifications: [],
      dataCenterLocations: [],
      customKeyManagement: false,
      auditLogging: true,
      twoFactorAuth: true,
      ssoSupported: false,
    },
    fileCapabilities: extra.fileCapabilities || {
      linkPasswordProtection: true,
      linkExpiration: true,
      downloadLimits: false,
      watermarking: false,
      viewOnlyMode: true,
      customBranding: false,
    },
    storageCapabilities: extra.storageCapabilities || undefined,
    keyFeatures,
    bestFitUseCases: Array.isArray(extra.bestFitUseCases) ? extra.bestFitUseCases : [],
    advantages: Array.isArray(extra.advantages) ? extra.advantages : [],
    limitations: Array.isArray(extra.limitations) ? extra.limitations : [],
    integrations,
    alternatives,
    screenshots,
    youtubeVideoUrl,
    pricingPlans: parsePricingPlans(details.pricing_plans || extra.pricingPlans || extra.pricing_plans),
    pricingUrl: details.pricing_url || extra.pricingUrl || extra.pricing_url || (row.official_website_url ? `${row.official_website_url.replace(/\/+$/, '')}/pricing` : undefined),
    faqs: Array.isArray(extra.faqs) ? extra.faqs : [],
    officialSources: Array.isArray(extra.officialSources) ? extra.officialSources : [],
    verifiedDate: extra.verifiedDate || (row.published_at ? row.published_at.substring(0, 10) : '2026-10-19'),
    verifiedBy: extra.verifiedBy || 'SecureTools Research Desk',
    verificationStatus: extra.verificationStatus || 'Verified',
    published: row.submission_status === 'published' || row.submission_status === 'approved',
    featured: Boolean(row.featured),
    reviewsCount: Number(row.reviews_count) || 0,
    rating: Number(row.average_rating) || (extra.rating ? Number(extra.rating) : 0),
    viewsCount: Number(row.views_count) || 0,
    clicksCount: Number(row.clicks_count) || 0,
    createdAt: row.created_at,
    publishedAt: row.published_at || row.created_at,
  };
}

// ── Raw query to Supabase ───────────────────────────────────────────────────
async function queryDatabaseSoftware(): Promise<SoftwareItem[]> {
  try {
    const admin = getAdminClient();
    const { data: listings, error } = await admin
      .from('listings')
      .select(`
        id,
        name,
        slug,
        tagline,
        short_description,
        full_description,
        official_website_url,
        logo_url,
        listing_type,
        category_id,
        pricing_model,
        starting_price,
        featured,
        views_count,
        clicks_count,
        reviews_count,
        average_rating,
        created_at,
        published_at,
        submission_status,
        listing_details (
          platforms,
          deployment,
          key_features,
          alternatives,
          integrations,
          pricing_plans,
          repository_url,
          license,
          programming_language,
          browser_compatibility,
          mcp_platforms,
          mcp_protocol,
          mcp_run_command,
          extra_metadata
        ),
        listing_assets (
          public_url,
          asset_type,
          display_order
        )
      `)
      .in('submission_status', ['published', 'approved'])
      .order('reviews_count', { ascending: false })
      .order('views_count', { ascending: false })
      .order('created_at', { ascending: false });

    if (error || !listings || listings.length === 0) {
      if (error) console.warn('Supabase query returned error, using fallback seed:', error.message);
      return sortSoftwareByEnterpriseRank(SOFTWARE_LISTINGS.filter(s => s.published));
    }

    return sortSoftwareByEnterpriseRank(listings.map(mapListingToSoftwareItem));
  } catch (err: any) {
    console.warn('Failed to fetch listings from Supabase, using fallback:', err.message);
    return sortSoftwareByEnterpriseRank(SOFTWARE_LISTINGS.filter(s => s.published));
  }
}

/**
 * Enterprise Product Ranking Engine
 * ─────────────────────────────────
 * Priority 1: Reviews Count (Tier 1 - community validated quality)
 * Priority 2: Views / Popularity Count (Tier 2 - dynamically updated on user visits/clicks)
 * Priority 3: Latest Launch / Recency (Tier 3 - newest product launches shown first when views/reviews equal)
 */
export function compareSoftwareRank(a: SoftwareItem, b: SoftwareItem): number {
  // 1. Featured priority
  if (Boolean(a.featured) !== Boolean(b.featured)) {
    return a.featured ? -1 : 1;
  }

  // 2. Reviews Count (Tier 1)
  const aReviews = a.reviewsCount ?? 0;
  const bReviews = b.reviewsCount ?? 0;
  if (aReviews !== bReviews) {
    return bReviews - aReviews;
  }

  // 3. Views / Popularity Count (Tier 2)
  const aViews = a.viewsCount ?? 0;
  const bViews = b.viewsCount ?? 0;
  if (aViews !== bViews) {
    return bViews - aViews;
  }

  // 4. Latest Launch / Recency (Tier 3: newest launch date first)
  const aDate = new Date(a.publishedAt || a.createdAt || a.verifiedDate || 0).getTime();
  const bDate = new Date(b.publishedAt || b.createdAt || b.verifiedDate || 0).getTime();
  if (aDate !== bDate) {
    return bDate - aDate;
  }

  // 5. Deterministic tie-breaker
  return a.name.localeCompare(b.name);
}

export function sortSoftwareByEnterpriseRank(items: SoftwareItem[]): SoftwareItem[] {
  return [...items].sort(compareSoftwareRank);
}

async function queryDatabaseCategories(): Promise<Category[]> {
  try {
    const admin = getAdminClient();
    const { data: categories, error } = await admin
      .from('categories')
      .select('id, slug, name, pillar, description, icon_name, tool_count, featured')
      .order('name', { ascending: true });

    if (error || !categories || categories.length === 0) {
      return CATEGORIES;
    }

    return categories.map((c: any) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      pillar: c.pillar || '',
      description: c.description || '',
      iconName: c.icon_name || '',
      toolCount: c.tool_count || 0,
      featured: Boolean(c.featured),
    }));
  } catch (err: any) {
    console.warn('Failed to fetch categories from Supabase, using fallback:', err.message);
    return CATEGORIES;
  }
}

// ── Optimized Cached Getters ────────────────────────────────────────────────
export const fetchSoftwareFromDb = unstable_cache(
  async (): Promise<SoftwareItem[]> => {
    return queryDatabaseSoftware();
  },
  ['software-listings-db'],
  { revalidate: 30, tags: ['listings'] }
);

export const fetchCategoriesFromDb = unstable_cache(
  async (): Promise<Category[]> => {
    return queryDatabaseCategories();
  },
  ['categories-db'],
  { revalidate: 60, tags: ['categories'] }
);

export async function fetchSoftwareBySlugFromDb(slug: string): Promise<SoftwareItem | undefined> {
  const all = await fetchSoftwareFromDb();
  return all.find(s => s.slug === slug);
}

export async function fetchSoftwareByIdFromDb(id: string): Promise<SoftwareItem | undefined> {
  const all = await fetchSoftwareFromDb();
  return all.find(s => s.id === id);
}

export async function fetchSoftwareByCategoryFromDb(categorySlug: string): Promise<SoftwareItem[]> {
  const all = await fetchSoftwareFromDb();
  const list = all.filter(s =>
    s.published && (s.primaryCategory === categorySlug || s.secondaryCategories.includes(categorySlug))
  );
  return sortSoftwareByEnterpriseRank(list);
}

export async function fetchOpenSourceFromDb(): Promise<SoftwareItem[]> {
  const all = await fetchSoftwareFromDb();
  const list = all.filter(s => {
    if (!s.published) return false;
    if (s.itemType === 'extension' || s.itemType === 'plugin') return false;
    return s.itemType === 'open-source' || s.pricingModel === 'Open Source';
  });
  return sortSoftwareByEnterpriseRank(list);
}

export async function fetchExtensionsFromDb(): Promise<SoftwareItem[]> {
  const all = await fetchSoftwareFromDb();
  const list = all.filter(s => {
    if (!s.published) return false;
    return s.itemType === 'extension';
  });
  return sortSoftwareByEnterpriseRank(list);
}

export async function fetchPluginsFromDb(): Promise<SoftwareItem[]> {
  const all = await fetchSoftwareFromDb();
  const list = all.filter(s => {
    if (!s.published) return false;
    return s.itemType === 'plugin';
  });
  return sortSoftwareByEnterpriseRank(list);
}
