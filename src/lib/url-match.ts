import { SoftwareItem } from '@/types';

export type ListingType = 'software' | 'open-source' | 'extension' | 'plugin';

export function getListingPath(itemType?: string, slug?: string): string {
  if (!slug) return '/';
  switch (itemType) {
    case 'open-source':
      return `/open-source/${slug}`;
    case 'extension':
      return `/extensions/${slug}`;
    case 'plugin':
      return `/plugins/${slug}`;
    case 'software':
    default:
      return `/tools/${slug}`;
  }
}

// Multi-tenant hosts where the domain alone does not represent a unique product
export const MULTI_TENANT_HOSTS = new Set([
  'github.com',
  'gitlab.com',
  'bitbucket.org',
  'chromewebstore.google.com',
  'chrome.google.com',
  'addons.mozilla.org',
  'microsoftedge.microsoft.com',
  'npmjs.com',
  'pypi.org',
  'smithery.ai',
  'glama.ai',
  'hub.docker.com',
  'crates.io',
  'sourceforge.net',
  'google.com',
  'apple.com',
  'microsoft.com',
  'medium.com',
  'substack.com',
  'wordpress.com',
]);

export const SHARED_USER_DOMAINS = [
  'github.io',
  'gitlab.io',
  'vercel.app',
  'netlify.app',
  'pages.dev',
  'web.app',
  'firebaseapp.com',
  'notion.site',
  'readthedocs.io',
];

export interface ParsedUrlDetails {
  raw: string;
  host: string;
  rootDomain: string;
  pathname: string;
  fullNormalized: string;
  chromeExtId: string | null;
  firefoxSlug: string | null;
  edgeExtId: string | null;
  gitRepoId: string | null;
  gitSubpath: string | null;
  npmPackageId: string | null;
  pypiPackageId: string | null;
}

export function parseUrlDetails(rawUrl: string): ParsedUrlDetails | null {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  let str = rawUrl.trim();
  if (!str) return null;

  // Handle npm: prefix
  if (str.startsWith('npm:')) {
    const pkg = str.replace(/^npm:/, '').trim().toLowerCase();
    return {
      raw: str,
      host: 'npmjs.com',
      rootDomain: 'npmjs.com',
      pathname: `/package/${pkg}`,
      fullNormalized: `npmjs.com/package/${pkg}`,
      chromeExtId: null,
      firefoxSlug: null,
      edgeExtId: null,
      gitRepoId: null,
      gitSubpath: null,
      npmPackageId: pkg,
      pypiPackageId: null,
    };
  }

  // Ensure scheme for URL parsing
  if (str.startsWith('//')) {
    str = 'https:' + str;
  } else if (!/^https?:\/\//i.test(str)) {
    str = 'https://' + str;
  }

  try {
    const parsed = new URL(str);
    let host = parsed.hostname.toLowerCase().replace(/^www\./, '');

    // Extract root registered domain (e.g. foo.sendnow.live -> sendnow.live)
    let rootDomain = host;
    const isShared = SHARED_USER_DOMAINS.some(sd => host.endsWith('.' + sd) || host === sd);
    if (!isShared) {
      const parts = host.split('.');
      if (parts.length >= 2) {
        rootDomain = parts.slice(-2).join('.');
      }
    }

    let pathname = (parsed.pathname || '/').toLowerCase();
    pathname = pathname.replace(/\/+/g, '/');
    if (pathname.length > 1 && pathname.endsWith('/')) {
      pathname = pathname.slice(0, -1);
    }

    // Chrome Web Store Extension ID (32 lowercase alpha characters)
    let chromeExtId: string | null = null;
    if (host.includes('google.com') && (pathname.includes('/detail/') || pathname.includes('/webstore/'))) {
      const match = pathname.match(/([a-z]{32})(?:[/?#]|$)/i);
      if (match) chromeExtId = match[1].toLowerCase();
    }

    // Firefox Add-on slug
    let firefoxSlug: string | null = null;
    if (host === 'addons.mozilla.org') {
      const match = pathname.match(/firefox\/addon\/([^/?#]+)/i);
      if (match) firefoxSlug = match[1].toLowerCase();
    }

    // Microsoft Edge Add-on ID
    let edgeExtId: string | null = null;
    if (host === 'microsoftedge.microsoft.com') {
      const match = pathname.match(/addons\/detail\/[^/?#]+\/([^/?#]+)/i);
      if (match) edgeExtId = match[1].toLowerCase();
    }

    // Git Repositories (GitHub, GitLab)
    let gitRepoId: string | null = null;
    let gitSubpath: string | null = null;
    if (host === 'github.com' || host === 'gitlab.com') {
      const match = pathname.match(/^\/([^/]+)\/([^/]+)(?:\/tree\/[^/]+\/(.+))?/);
      if (match) {
        const owner = match[1];
        const repo = match[2].replace(/\.git$/, '');
        gitRepoId = `${host}/${owner}/${repo}`;
        if (match[3]) {
          gitSubpath = match[3].replace(/\/+$/, '');
        }
      }
    }

    // NPM Package
    let npmPackageId: string | null = null;
    if (host === 'npmjs.com' && pathname.includes('/package/')) {
      const match = pathname.match(/\/package\/(@?[^/?#]+(?:\/[^/?#]+)?)/i);
      if (match) npmPackageId = match[1].toLowerCase();
    }

    // PyPI Package
    let pypiPackageId: string | null = null;
    if (host === 'pypi.org' && pathname.includes('/project/')) {
      const match = pathname.match(/\/project\/([^/?#]+)/i);
      if (match) pypiPackageId = match[1].toLowerCase();
    }

    const fullNormalized = `${host}${pathname === '/' ? '' : pathname}`;

    return {
      raw: rawUrl,
      host,
      rootDomain,
      pathname,
      fullNormalized,
      chromeExtId,
      firefoxSlug,
      edgeExtId,
      gitRepoId,
      gitSubpath,
      npmPackageId,
      pypiPackageId,
    };
  } catch {
    const fallback = rawUrl
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/+$/, '')
      .replace(/\.git$/, '');

    return {
      raw: rawUrl,
      host: fallback.split('/')[0] || fallback,
      rootDomain: fallback.split('/')[0] || fallback,
      pathname: '/',
      fullNormalized: fallback,
      chromeExtId: null,
      firefoxSlug: null,
      edgeExtId: null,
      gitRepoId: null,
      gitSubpath: null,
      npmPackageId: null,
      pypiPackageId: null,
    };
  }
}

export function doUrlsMatch(candidateRaw: string, existingRaw: string): boolean {
  if (!candidateRaw || !existingRaw) return false;
  const pC = parseUrlDetails(candidateRaw);
  const pE = parseUrlDetails(existingRaw);
  if (!pC || !pE) return false;

  // 1. Chrome Web Store ID Match
  if (pC.chromeExtId && pE.chromeExtId) {
    return pC.chromeExtId === pE.chromeExtId;
  }

  // 2. Firefox Add-on Slug Match
  if (pC.firefoxSlug && pE.firefoxSlug) {
    return pC.firefoxSlug === pE.firefoxSlug;
  }

  // 3. Microsoft Edge Add-on ID Match
  if (pC.edgeExtId && pE.edgeExtId) {
    return pC.edgeExtId === pE.edgeExtId;
  }

  // 4. Git Repository Match
  if (pC.gitRepoId && pE.gitRepoId) {
    if (pC.gitRepoId === pE.gitRepoId) {
      const cSub = (pC.gitSubpath || '').toLowerCase();
      const eSub = (pE.gitSubpath || '').toLowerCase();
      if (cSub || eSub) {
        return cSub === eSub;
      }
      return true;
    }
    return false;
  }

  // 5. NPM Package Match
  if (pC.npmPackageId && pE.npmPackageId) {
    return pC.npmPackageId === pE.npmPackageId;
  }

  // 6. PyPI Package Match
  if (pC.pypiPackageId && pE.pypiPackageId) {
    return pC.pypiPackageId === pE.pypiPackageId;
  }

  // 7. Exact Normalized URL Match
  if (pC.fullNormalized === pE.fullNormalized) {
    return true;
  }

  // 8. Multi-Tenant Hosts (e.g. github.com, chrome store, etc.) must NOT match across tenants
  const isCandidateMultiTenant = MULTI_TENANT_HOSTS.has(pC.host);
  const isExistingMultiTenant = MULTI_TENANT_HOSTS.has(pE.host);
  if (isCandidateMultiTenant || isExistingMultiTenant) {
    if (pC.host !== pE.host) return false;
    return pC.pathname === pE.pathname;
  }

  // 9. Shared User Subdomains (e.g. *.github.io, *.vercel.app)
  const isCandidateShared = SHARED_USER_DOMAINS.some(sd => pC.host.endsWith('.' + sd));
  const isExistingShared = SHARED_USER_DOMAINS.some(sd => pE.host.endsWith('.' + sd));
  if (isCandidateShared || isExistingShared) {
    if (pC.host !== pE.host) return false;
    return pC.pathname === pE.pathname;
  }

  // 10. Standalone Brand / SaaS Root Domain Match
  if (pC.rootDomain && pE.rootDomain && pC.rootDomain === pE.rootDomain) {
    if (pE.pathname === '/' || pE.pathname === '') {
      return true;
    }
    // If existing listing has a specific product subpath (e.g. proton.me/drive)
    if (pC.pathname.startsWith(pE.pathname)) {
      return true;
    }
  }

  return false;
}

export interface MatchResult {
  isDuplicate: true;
  id?: string;
  name: string;
  slug: string;
  itemType: ListingType;
  matchedUrl: string;
  matchedField: string;
  listingPath: string;
  message: string;
}

export function checkDuplicateInItems(candidateUrls: string[], items: SoftwareItem[]): MatchResult | null {
  const cleanCandidates = candidateUrls.filter(u => typeof u === 'string' && u.trim().length > 3);
  if (cleanCandidates.length === 0) return null;

  for (const item of items) {
    const urlsToCheck: { url: string; field: string }[] = [];
    if (item.websiteUrl) urlsToCheck.push({ url: item.websiteUrl, field: 'websiteUrl' });
    if (item.repositoryUrl) urlsToCheck.push({ url: item.repositoryUrl, field: 'repositoryUrl' });
    if (item.extensionStoreUrl) urlsToCheck.push({ url: item.extensionStoreUrl, field: 'extensionStoreUrl' });
    if (item.packageUrl) urlsToCheck.push({ url: item.packageUrl, field: 'packageUrl' });

    if (Array.isArray(item.officialSources)) {
      for (const source of item.officialSources) {
        if (source.url) urlsToCheck.push({ url: source.url, field: 'officialSources' });
      }
    }

    for (const candidate of cleanCandidates) {
      for (const { url, field } of urlsToCheck) {
        if (doUrlsMatch(candidate, url)) {
          const itemType = (item.itemType || 'software') as ListingType;
          const listingPath = getListingPath(itemType, item.slug);
          return {
            isDuplicate: true,
            id: item.id,
            name: item.name,
            slug: item.slug,
            itemType,
            matchedUrl: url,
            matchedField: field,
            listingPath,
            message: `This product or URL is already listed in SecureTools.live under "${item.name}". Duplicate listings are strictly prohibited.`,
          };
        }
      }
    }
  }

  return null;
}
