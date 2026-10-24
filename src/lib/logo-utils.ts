/**
 * Dynamic logo resolver for tools, extensions, open-source repositories, and plugins.
 * 
 * Priority order:
 * 1. Custom uploaded logo from database (`tool.logoUrl`)
 * 2. GitHub repository owner avatar (e.g. `https://github.com/:org.png`)
 * 3. Domain favicon from Google's S2 favicon service
 * 4. Null (triggering initials fallback)
 */
export function resolveSoftwareLogo(tool: {
  logoUrl?: string | null;
  websiteUrl?: string | null;
  repositoryUrl?: string | null;
}): string | null {
  // 1. Explicit uploaded / custom logo (Highest Priority)
  if (tool.logoUrl && tool.logoUrl.trim().length > 0) {
    return tool.logoUrl.trim();
  }

  // 2. GitHub repository org / repo avatar
  const targetUrl = tool.repositoryUrl || tool.websiteUrl;
  if (targetUrl && /github\.com\/([^\/?#]+)/i.test(targetUrl)) {
    const match = targetUrl.match(/github\.com\/([^\/?#]+)/i);
    if (
      match &&
      match[1] &&
      !['features', 'topics', 'trending', 'collections', 'marketplace', 'explore', 'orgs'].includes(
        match[1].toLowerCase()
      )
    ) {
      return `https://github.com/${match[1]}.png`;
    }
  }

  // 3. Domain favicon fallback
  if (tool.websiteUrl) {
    try {
      const url = tool.websiteUrl.startsWith('http')
        ? tool.websiteUrl
        : `https://${tool.websiteUrl}`;
      const domain = new URL(url).hostname.replace(/^www\./, '');
      if (domain) {
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
      }
    } catch {
      // ignore invalid URL
    }
  }

  return null;
}

/**
 * Formats a URL hostname into a clean display brand/domain.
 * E.g., 'chromewebstore.google.com' -> 'Chrome Web Store'
 */
export function getDisplayDomain(rawUrl?: string | null): string {
  if (!rawUrl) return '';
  try {
    const url = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
    const host = new URL(url).hostname.toLowerCase().replace(/^www\./, '');
    if (host === 'chromewebstore.google.com' || host === 'chrome.google.com') {
      return 'Chrome Web Store';
    }
    if (host === 'addons.mozilla.org') {
      return 'Firefox Add-ons';
    }
    if (host === 'microsoftedge.microsoft.com') {
      return 'Edge Add-ons';
    }
    return host;
  } catch {
    return rawUrl ? rawUrl.replace(/^https?:\/\//, '').split('/')[0].replace(/^www\./, '') : '';
  }
}

/**
 * Appends SecureTools UTM tracking parameters to any outbound URL.
 * Preserves existing search params and URL hashes.
 *
 * Example:
 *  withUtm('https://sendnow.live')
 *  -> 'https://sendnow.live/?utm_source=securetools&utm_medium=directory&utm_campaign=securetools&ref=securetools'
 */
export function withUtm(
  rawUrl?: string | null,
  options?: {
    source?: string;
    medium?: string;
    campaign?: string;
  }
): string {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const trimmed = rawUrl.trim();
  if (!trimmed) return '';

  try {
    const hasScheme = /^https?:\/\//i.test(trimmed);
    const parsed = new URL(hasScheme ? trimmed : `https://${trimmed}`);

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return trimmed;
    }

    const source = options?.source || 'securetools';
    const medium = options?.medium || 'directory';
    const campaign = options?.campaign || 'securetools';

    parsed.searchParams.set('utm_source', source);
    if (!parsed.searchParams.has('utm_medium')) {
      parsed.searchParams.set('utm_medium', medium);
    }
    if (!parsed.searchParams.has('utm_campaign')) {
      parsed.searchParams.set('utm_campaign', campaign);
    }
    if (!parsed.searchParams.has('ref')) {
      parsed.searchParams.set('ref', source);
    }

    return parsed.toString();
  } catch {
    const separator = trimmed.includes('?') ? '&' : '?';
    return `${trimmed}${separator}utm_source=securetools&utm_medium=directory&utm_campaign=securetools&ref=securetools`;
  }
}

