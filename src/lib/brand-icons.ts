/**
 * Comprehensive Brand & Integration Domain Resolver
 * Resolves any tool, integration, extension, or brand name to its official domain
 * for high-resolution favicon resolution (Google S2, DuckDuckGo, Unavatar).
 */

// Well-known curated brand domain dictionary
const BRAND_DOMAIN_MAP: Record<string, string> = {
  // Browsers & Stores
  'chrome': 'chromewebstore.google.com',
  'google chrome': 'chromewebstore.google.com',
  'chrome extension': 'chromewebstore.google.com',
  'chrome web store': 'chromewebstore.google.com',
  'firefox': 'addons.mozilla.org',
  'mozilla firefox': 'addons.mozilla.org',
  'firefox addon': 'addons.mozilla.org',
  'firefox extension': 'addons.mozilla.org',
  'thunderbird': 'thunderbird.net',
  'mozilla thunderbird': 'thunderbird.net',
  'edge': 'microsoftedge.microsoft.com',
  'microsoft edge': 'microsoftedge.microsoft.com',
  'safari': 'apple.com',
  'apple safari': 'apple.com',
  'opera': 'opera.com',
  'brave': 'brave.com',
  'arc': 'arc.net',
  'vivaldi': 'vivaldi.com',

  // Google Ecosystem
  'google workspace': 'workspace.google.com',
  'workspace': 'workspace.google.com',
  'gsuite': 'workspace.google.com',
  'g suite': 'workspace.google.com',
  'gmail': 'gmail.com',
  'google drive': 'drive.google.com',
  'gdrive': 'drive.google.com',
  'google docs': 'docs.google.com',
  'google sheets': 'docs.google.com',
  'google slides': 'docs.google.com',
  'google meet': 'meet.google.com',
  'google calendar': 'calendar.google.com',
  'google cloud': 'cloud.google.com',
  'gcp': 'cloud.google.com',
  'firebase': 'firebase.google.com',
  'google': 'google.com',

  // Microsoft Ecosystem
  'microsoft outlook': 'outlook.com',
  'outlook': 'outlook.com',
  'microsoft entra': 'microsoft.com',
  'microsoft entra id': 'microsoft.com',
  'entra id': 'microsoft.com',
  'azure ad': 'microsoft.com',
  'active directory': 'microsoft.com',
  'microsoft 365': 'microsoft.com',
  'office 365': 'microsoft.com',
  'm365': 'microsoft.com',
  'onedrive': 'onedrive.live.com',
  'sharepoint': 'microsoft.com',
  'microsoft teams': 'microsoft.com',
  'teams': 'microsoft.com',
  'azure': 'azure.microsoft.com',
  'microsoft azure': 'azure.microsoft.com',
  'microsoft': 'microsoft.com',
  'windows': 'microsoft.com',

  // Apple
  'apple': 'apple.com',
  'macos': 'apple.com',
  'mac': 'apple.com',
  'icloud': 'icloud.com',
  'ios': 'apple.com',

  // Cloud & Infrastructure
  'aws': 'aws.amazon.com',
  'amazon web services': 'aws.amazon.com',
  'amazon s3': 'aws.amazon.com',
  'aws s3': 'aws.amazon.com',
  's3': 'aws.amazon.com',
  'cloudflare': 'cloudflare.com',
  'cloudflare r2': 'cloudflare.com',
  'vercel': 'vercel.com',
  'netlify': 'netlify.com',
  'supabase': 'supabase.com',
  'digitalocean': 'digitalocean.com',
  'heroku': 'heroku.com',
  'render': 'render.com',
  'fly.io': 'fly.io',
  'railway': 'railway.app',

  // Productivity, Design & CRM
  'slack': 'slack.com',
  'sketch': 'sketch.com',
  'figma': 'figma.com',
  'canva': 'canva.com',
  'adobe': 'adobe.com',
  'adobe acrobat': 'adobe.com',
  'photoshop': 'adobe.com',
  'notion': 'notion.so',
  'linear': 'linear.app',
  'jira': 'atlassian.com',
  'confluence': 'atlassian.com',
  'trello': 'trello.com',
  'atlassian': 'atlassian.com',
  'asana': 'asana.com',
  'monday': 'monday.com',
  'monday.com': 'monday.com',
  'clickup': 'clickup.com',
  'salesforce': 'salesforce.com',
  'hubspot': 'hubspot.com',
  'zendesk': 'zendesk.com',
  'intercom': 'intercom.com',
  'zoom': 'zoom.us',
  'zapier': 'zapier.com',
  'make': 'make.com',
  'make.com': 'make.com',
  'integromat': 'make.com',

  // CMS & Ecommerce
  'wordpress': 'wordpress.org',
  'shopify': 'shopify.com',
  'woocommerce': 'woocommerce.com',
  'webflow': 'webflow.com',
  'ghost': 'ghost.org',

  // Auth & Identity
  'okta': 'okta.com',
  'auth0': 'auth0.com',
  'clerk': 'clerk.com',
  'keycloak': 'keycloak.org',
  'stytch': 'stytch.com',
  '1password': '1password.com',
  'bitwarden': 'bitwarden.com',
  'lastpass': 'lastpass.com',
  'keepass': 'keepass.info',

  // Secure File Sharing & Cloud Storage
  'transfernow': 'transfernow.net',
  'wetransfer': 'wetransfer.com',
  'dropbox': 'dropbox.com',
  'box': 'box.com',
  'sync.com': 'sync.com',
  'sync': 'sync.com',
  'pcloud': 'pcloud.com',
  'mega': 'mega.io',
  'proton': 'proton.me',
  'proton drive': 'proton.me',
  'proton mail': 'proton.me',
  'tresorit': 'tresorit.com',
  'nextcloud': 'nextcloud.com',
  'owncloud': 'owncloud.com',
  'smash': 'fromsmash.com',
  'fromsmash': 'fromsmash.com',
  'filemail': 'filemail.com',
  'sendsafely': 'sendsafely.com',
  'sendnow': 'sendnow.live',
  'papermark': 'papermark.com',
  'docsend': 'docsend.com',
  'digify': 'digify.com',
  'ideals': 'idealsvdr.com',
  'ideals vdr': 'idealsvdr.com',
  'datasite': 'datasite.com',
  'intralinks': 'intralinks.com',
  'firmex': 'firmex.com',
  'firmroom': 'firmroom.com',
  'securedocs': 'securedocs.com',
  'kiteworks': 'kiteworks.com',
  'sharefile': 'sharefile.com',
  'onehub': 'onehub.com',
  'egnyte': 'egnyte.com',

  // E-Signatures & Contracts
  'docusign': 'docusign.com',
  'pandadoc': 'pandadoc.com',
  'signnow': 'signnow.com',
  'hellosign': 'hellosign.com',
  'dropbox sign': 'hellosign.com',
  'adobe sign': 'adobe.com',

  // Encryption & Cybersecurity
  'cryptomator': 'cryptomator.org',
  'veracrypt': 'veracrypt.fr',
  'axcrypt': 'axcrypt.net',
  'nordlocker': 'nordlocker.com',
  'cyberark': 'cyberark.com',
  'teleport': 'goteleport.com',
  'infisical': 'infisical.com',
  'hashicorp vault': 'vaultproject.io',
  'vault': 'vaultproject.io',

  // Developer & DevOps
  'github': 'github.com',
  'gitlab': 'gitlab.com',
  'bitbucket': 'bitbucket.org',
  'docker': 'docker.com',
  'kubernetes': 'kubernetes.io',
  'postman': 'postman.com',
  'swagger': 'swagger.io',
  'sentry': 'sentry.io',
  'datadog': 'datadoghq.com',
  'grafana': 'grafana.com',
  'stripe': 'stripe.com',
  'paypal': 'paypal.com',
  'resend': 'resend.com',
  'sendgrid': 'sendgrid.com',
  'postmark': 'postmarkapp.com',
  'twilio': 'twilio.com',
  'postgresql': 'postgresql.org',
  'postgres': 'postgresql.org',
  'mysql': 'mysql.com',
  'mongodb': 'mongodb.com',
  'redis': 'redis.io',
  'sqlite': 'sqlite.org',

  // AI, LLMs & Developer Tools
  'claude': 'claude.ai',
  'claude desktop': 'claude.ai',
  'claude code': 'anthropic.com',
  'anthropic': 'anthropic.com',
  'chatgpt': 'chatgpt.com',
  'openai': 'openai.com',
  'cursor': 'cursor.com',
  'windsurf': 'codeium.com',
  'codeium': 'codeium.com',
  'librechat': 'librechat.ai',
  'ollama': 'ollama.com',
  'open-webui': 'openwebui.com',
  'open webui': 'openwebui.com',
  'huggingface': 'huggingface.co',
  'hugging face': 'huggingface.co',
  'open-source llms': 'huggingface.co',
  'copilot': 'github.com',
  'github copilot': 'github.com',
  'perplexity': 'perplexity.ai',
  'gemini': 'gemini.google.com',
  'google gemini': 'gemini.google.com',
  'deepseek': 'deepseek.com',
  'mistral': 'mistral.ai',
  'mistral ai': 'mistral.ai',
  'cohere': 'cohere.com',
  'groq': 'groq.com',
  'v0': 'v0.dev',
  'replit': 'replit.com',
};

/**
 * Strips technical suffixes (REST API, SDK, Extension, etc.) to extract the root brand.
 */
function extractRootBrand(name: string): string {
  if (!name) return '';
  return name
    .trim()
    .replace(/\b(rest api|restful api|api|sdk|extensions?|add-?ons?|plugins?|integrations?|connectors?|webhooks?|apps?|bots?|clients?|services?|platforms?|sso|oauth)\b/gi, '')
    .trim();
}

/**
 * Cleanly resolves any software, platform, or integration name to its primary brand domain.
 */
export function resolveBrandDomain(name: string, explicitDomain?: string): string {
  // 1. Explicit domain provided
  if (explicitDomain && explicitDomain.trim()) {
    let clean = explicitDomain.trim().toLowerCase();
    if (clean.includes('://')) {
      try {
        clean = new URL(clean).hostname;
      } catch {
        clean = clean.replace(/^https?:\/\//, '').split('/')[0];
      }
    } else {
      clean = clean.split('/')[0];
    }
    clean = clean.replace(/^www\./, '');
    if (clean.includes('.') && !clean.endsWith('.com.com')) {
      return clean;
    }
  }

  if (!name) return 'google.com';

  const rawLower = name.toLowerCase().trim();
  const rootBrandLower = extractRootBrand(name).toLowerCase().trim();

  // 2. Check exact matches in dictionary
  if (BRAND_DOMAIN_MAP[rawLower]) return BRAND_DOMAIN_MAP[rawLower];
  if (rootBrandLower && BRAND_DOMAIN_MAP[rootBrandLower]) return BRAND_DOMAIN_MAP[rootBrandLower];

  // 3. Substring matching for major technology ecosystems
  const searchTerms = [rootBrandLower, rawLower].filter(Boolean);

  for (const term of searchTerms) {
    if (term.includes('chrome')) return 'chromewebstore.google.com';
    if (term.includes('thunderbird')) return 'thunderbird.net';
    if (term.includes('firefox')) return 'addons.mozilla.org';
    if (term.includes('edge')) return 'microsoftedge.microsoft.com';
    if (term.includes('safari')) return 'apple.com';
    if (term.includes('workspace') || term.includes('gsuite') || term.includes('g suite')) return 'workspace.google.com';
    if (term.includes('gmail')) return 'gmail.com';
    if (term.includes('google drive') || term.includes('gdrive')) return 'drive.google.com';
    if (term.includes('google cloud') || term === 'gcp') return 'cloud.google.com';
    if (term.includes('google')) return 'google.com';

    if (term.includes('outlook')) return 'outlook.com';
    if (term.includes('entra') || term.includes('active directory') || term.includes('azure ad')) return 'microsoft.com';
    if (term.includes('onedrive')) return 'onedrive.live.com';
    if (term.includes('sharepoint')) return 'microsoft.com';
    if (term.includes('office 365') || term.includes('microsoft 365') || term.includes('m365')) return 'microsoft.com';
    if (term.includes('azure')) return 'azure.microsoft.com';
    if (term.includes('teams')) return 'microsoft.com';
    if (term.includes('microsoft')) return 'microsoft.com';

    if (term.includes('apple') || term.includes('macos') || term.includes('ios')) return 'apple.com';
    if (term.includes('mozilla')) return 'mozilla.org';

    if (term.includes('transfernow')) return 'transfernow.net';
    if (term.includes('wetransfer')) return 'wetransfer.com';
    if (term.includes('dropbox')) return 'dropbox.com';
    if (term.includes('box') && !term.includes('mailbox')) return 'box.com';
    if (term.includes('sketch')) return 'sketch.com';
    if (term.includes('slack')) return 'slack.com';
    if (term.includes('okta')) return 'okta.com';
    if (term.includes('wordpress')) return 'wordpress.org';
    if (term.includes('aws') || term.includes('amazon') || term.includes('s3')) return 'aws.amazon.com';
    if (term.includes('cloudflare')) return 'cloudflare.com';
    if (term.includes('supabase')) return 'supabase.com';
    if (term.includes('firebase')) return 'firebase.google.com';
    if (term.includes('stripe')) return 'stripe.com';
    if (term.includes('paypal')) return 'paypal.com';
    if (term.includes('github')) return 'github.com';
    if (term.includes('gitlab')) return 'gitlab.com';
    if (term.includes('docker')) return 'docker.com';
    if (term.includes('kubernetes')) return 'kubernetes.io';
    if (term.includes('salesforce')) return 'salesforce.com';
    if (term.includes('hubspot')) return 'hubspot.com';
    if (term.includes('zendesk')) return 'zendesk.com';
    if (term.includes('notion')) return 'notion.so';
    if (term.includes('docusign')) return 'docusign.com';
    if (term.includes('pandadoc')) return 'pandadoc.com';
    if (term.includes('tresorit')) return 'tresorit.com';
    if (term.includes('nextcloud')) return 'nextcloud.com';
    if (term.includes('owncloud')) return 'owncloud.com';
  }

  // 4. If name already looks like a domain (e.g. "sendnow.live" or "example.org")
  if (rawLower.includes('.')) {
    return rawLower.replace(/^https?:\/\//, '').split('/')[0].replace(/^www\./, '');
  }

  // 5. Clean single-word brand fallback (avoiding multi-word garbage like "chromeextension.com")
  const brandToken = (rootBrandLower || rawLower).split(/\s+/)[0].replace(/[^a-z0-9]/g, '');
  if (brandToken.length >= 3) {
    return `${brandToken}.com`;
  }

  return 'google.com';
}

/**
 * Generates prioritized favicon URLs for a brand.
 * 1. Google S2 high-resolution 128px
 * 2. DuckDuckGo ICO
 * 3. Unavatar fallback
 */
export function getBrandFaviconUrls(name: string, explicitDomain?: string): string[] {
  const domain = resolveBrandDomain(name, explicitDomain);
  return [
    `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`,
    `https://icons.duckduckgo.com/ip3/${encodeURIComponent(domain)}.ico`,
    `https://unavatar.io/${encodeURIComponent(domain)}?fallback=false`,
  ];
}
