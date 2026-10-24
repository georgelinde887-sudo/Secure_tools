import { Client } from 'pg';
import { getAllCategories, getAllSoftware } from '../src/lib/data';
import { ALTERNATIVES } from '../src/data/alternatives';

// Comprehensive map of rich alternatives for every tool
const TOOL_ALTERNATIVES_MAP: Record<string, string[]> = {
  'tool-tresorit': ['SendNow', 'Box', 'Proton Drive', 'Sync.com'],
  'tool-sendnow': ['Papermark', 'DocSend', 'Tresorit', 'WeTransfer'],
  'tool-box': ['Tresorit', 'Dropbox', 'Google Drive', 'Microsoft OneDrive'],
  'tool-proton-drive': ['Tresorit', 'Nextcloud Hub', 'Internxt', 'Google Drive'],
  'tool-nextcloud': ['ownCloud', 'Seafile', 'Proton Drive', 'Syncthing'],
  'tool-intralinks': ['Datasite', 'Ideals VDR', 'Papermark', 'Tresorit'],
  'tool-docusign': ['Adobe Acrobat Pro', 'PandaDoc', 'Dropbox Sign', 'SignWell'],
  'tool-adobe-acrobat': ['DocuSign eSignature', 'Foxit PDF Editor', 'Nitro Pro', 'PDF-XChange'],
  'tool-cryptomator': ['VeraCrypt', 'AxCrypt', 'BitLocker', 'NordLocker'],
  'tool-wetransfer': ['SendNow', 'Smash', 'SwissTransfer', 'Filemail'],
  'tool-7zip': ['PeaZip', 'WinRAR', 'Keka', 'Bandizip'],
  'ext-ublock-origin': ['AdGuard', 'Privacy Badger', 'Brave Shields'],
  'ext-bitwarden': ['1Password', 'Proton Pass', 'KeePassXC'],
  'ext-privacy-badger': ['uBlock Origin', 'Ghostery', 'DuckDuckGo Privacy Essentials'],
  'ext-proton-pass': ['Bitwarden', '1Password in the Browser', 'Apple Passwords'],
  'ext-1password': ['Bitwarden', 'Proton Pass', 'Dashlane'],
  'plugin-securityheaders-mcp': ['OWASP ZAP Assistant Plugin', 'Semgrep SAST MCP Plugin', 'Mozilla Observatory'],
  'plugin-semgrep-mcp': ['Snyk Security Assistant for Claude', 'SonarQube MCP', 'TruffleHog Secrets Scanner MCP'],
  'plugin-trufflehog-mcp': ['Gitleaks MCP', 'Semgrep SAST MCP Plugin', 'Snyk Security Assistant for Claude'],
  'plugin-snyk-claude': ['Semgrep SAST MCP Plugin', 'TruffleHog Secrets Scanner MCP', 'GitHub Dependabot'],
  'plugin-owasp-zap': ['SecurityHeaders MCP Server', 'Burp Suite Extension', 'Semgrep SAST MCP Plugin'],
  'ST-2026-095F': ['DocSend', 'SendNow', 'Tresorit', 'SS&C Intralinks'],
};

// Pricing plans breakdown
const TOOL_PRICING_PLANS_MAP: Record<string, string> = {
  'tool-tresorit': 'Personal: $14.50/mo | Business: $24/user/mo | Enterprise: Custom quote. 14-day free trial available.',
  'tool-sendnow': 'Free Tier: 5 active links | Pro: $15/mo unlimited tracking & custom branding | Team: $35/mo with CRM integrations.',
  'tool-box': 'Individual: Free 10GB | Business Starter: $5/user/mo | Business Plus: $25/user/mo with Box Shield & KeySafe.',
  'tool-proton-drive': 'Free Plan: 5GB storage | Drive Plus: $4.99/mo 200GB | Proton Unlimited: $9.99/mo 500GB + VPN/Mail.',
  'tool-nextcloud': 'Community Edition: 100% Free & Open Source | Enterprise Support: from €36/user/year for 100+ seats.',
  'tool-intralinks': 'Bespoke enterprise virtual data room pricing per deal/data room size. Contact sales for quote.',
  'tool-docusign': 'Personal: $10/mo (5 envelopes) | Standard: $25/user/mo | Business Pro: $40/user/mo with sign-in-person.',
  'tool-adobe-acrobat': 'Standard: $12.99/mo | Pro: $19.99/mo with redacting & compare files | Enterprise: Custom volume licensing.',
  'tool-cryptomator': '100% Free & Open Source for Desktop (macOS, Windows, Linux) | Mobile apps: $14.99 one-time purchase.',
  'tool-wetransfer': 'Free Tier: 2GB transfer (expires 7 days) | Pro: $12/mo 1TB storage & transfer tracking | Premium: $23/mo.',
  'tool-7zip': '100% Free and Open Source under GNU LGPL license for personal and commercial usage.',
  'ext-ublock-origin': '100% Free and Open Source under GPLv3. No commercial telemetry or paid tiers.',
  'ext-bitwarden': 'Free Plan: Unlimited devices & passwords | Premium: $10/year (TOTP & 1GB encrypted storage) | Family: $40/year.',
  'ext-privacy-badger': '100% Free and Open Source developed by the Electronic Frontier Foundation (EFF).',
  'ext-proton-pass': 'Free Plan: Unlimited logins & 10 hide-my-email aliases | Pass Plus: $1.99/mo with 2FA authenticator.',
  'ext-1password': 'Individual: $2.99/mo | Families: $4.99/mo (5 members) | Teams: $19.95/mo (up to 10 users).',
  'plugin-securityheaders-mcp': 'Open-source MCP tool. Free for individual and enterprise automated posture scanning.',
  'plugin-semgrep-mcp': 'Free community rules engine | Semgrep Pro Rules & AppSec Platform: from $30/developer/month.',
  'plugin-trufflehog-mcp': '100% Free open-source secrets detector | TruffleHog Enterprise: Custom quote with real-time verification.',
  'plugin-snyk-claude': 'Free Tier: 200 scans/month | Snyk Team: from $25/developer/month | Enterprise: Custom quote.',
  'plugin-owasp-zap': '100% Free and Open Source under Apache 2.0 license by the Open Worldwide Application Security Project.',
  'ST-2026-095F': 'Free Plan: Unlimited documents & 500 views/mo | Team: $29/mo with custom domain & watermarking | Enterprise: $99/mo.',
};

// Repository & Open Source metadata
const TOOL_REPOS_MAP: Record<string, { repo?: string; license?: string; lang?: string }> = {
  'tool-cryptomator': { repo: 'https://github.com/cryptomator/cryptomator', license: 'GPL-3.0', lang: 'Java / Swift' },
  'tool-nextcloud': { repo: 'https://github.com/nextcloud/server', license: 'AGPL-3.0', lang: 'PHP / TypeScript' },
  'tool-7zip': { repo: 'https://github.com/ip7z/7zip', license: 'GNU LGPL', lang: 'C++ / Assembly' },
  'ext-ublock-origin': { repo: 'https://github.com/gorhill/uBlock', license: 'GPL-3.0', lang: 'JavaScript' },
  'ext-bitwarden': { repo: 'https://github.com/bitwarden/clients', license: 'GPL-3.0', lang: 'TypeScript' },
  'ext-privacy-badger': { repo: 'https://github.com/EFForg/privacybadger', license: 'GPL-3.0', lang: 'JavaScript' },
  'plugin-securityheaders-mcp': { repo: 'https://github.com/modelcontextprotocol/servers', license: 'MIT', lang: 'TypeScript' },
  'plugin-semgrep-mcp': { repo: 'https://github.com/semgrep/semgrep', license: 'LGPL-2.1', lang: 'Python / OCaml' },
  'plugin-trufflehog-mcp': { repo: 'https://github.com/trufflesecurity/trufflehog', license: 'AGPL-3.0', lang: 'Go' },
  'plugin-owasp-zap': { repo: 'https://github.com/zaproxy/zaproxy', license: 'Apache-2.0', lang: 'Java' },
  'ST-2026-095F': { repo: 'https://github.com/mfts/papermark', license: 'AGPL-3.0', lang: 'TypeScript / Next.js' },
};

async function enrichAndMigrate() {
  const password = encodeURIComponent(process.env.SUPABASE_DB_PASSWORD || 'EWG@@Yy*GsHkB5E');
  const connectionString = `postgresql://postgres.dpygfnfznubzpnouoafw:${password}@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres`;
  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });

  console.log('Connecting to Supabase PostgreSQL database...');
  await client.connect();

  try {
    // 1. Ensure Categories are fully populated
    const categories = getAllCategories();
    console.log(`Seeding/updating ${categories.length} categories...`);
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
          cat.slug,
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
    console.log('Categories synced successfully!');

    // 2. Migrate and Enrich all software
    const softwareList = getAllSoftware();
    console.log(`Enriching and syncing ${softwareList.length} software listings...`);

    for (const item of softwareList) {
      const listingType = (item.itemType || 'software') as 'software' | 'open-source' | 'extension' | 'plugin';

      // Insert or Update in listings table
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

      // Resolve rich fields
      const alternatives = TOOL_ALTERNATIVES_MAP[item.id] || [];
      const pricingPlans = TOOL_PRICING_PLANS_MAP[item.id] || (item.pricingModel ? `${item.pricingModel}: ${item.startingPrice || 'Free tier available'}` : '');
      const repoInfo = TOOL_REPOS_MAP[item.id] || {};
      const platforms = item.platforms || [];
      const deployment = item.deployment || [];
      const keyFeatures = item.keyFeatures || [];
      const integrations = item.integrations || [];

      // Browser compatibility
      const isExtension = item.itemType === 'extension' || platforms.some(p => ['Chrome', 'Firefox', 'Edge'].includes(p));
      const browserCompat = isExtension ? platforms.filter(p => ['Chrome', 'Firefox', 'Edge'].includes(p)) : [];

      // MCP plugin fields
      const isPlugin = item.itemType === 'plugin' || platforms.some(p => ['MCP', 'Claude', 'ChatGPT'].includes(p));
      const mcpPlatforms = isPlugin ? platforms.filter(p => ['MCP', 'Claude', 'ChatGPT'].includes(p)) : [];
      const mcpProtocol = isPlugin ? 'Model Context Protocol (v2024-11-05)' : null;
      const mcpRunCommand = isPlugin ? `npx -y @modelcontextprotocol/server-${item.slug}` : null;

      await client.query(
        `INSERT INTO public.listing_details (
           listing_id, platforms, deployment, key_features, alternatives, integrations,
           pricing_plans, repository_url, license, programming_language,
           browser_compatibility, mcp_platforms, mcp_protocol, mcp_run_command,
           extra_metadata
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
         ON CONFLICT (listing_id) DO UPDATE SET
           platforms = EXCLUDED.platforms,
           deployment = EXCLUDED.deployment,
           key_features = EXCLUDED.key_features,
           alternatives = EXCLUDED.alternatives,
           integrations = EXCLUDED.integrations,
           pricing_plans = EXCLUDED.pricing_plans,
           repository_url = EXCLUDED.repository_url,
           license = EXCLUDED.license,
           programming_language = EXCLUDED.programming_language,
           browser_compatibility = EXCLUDED.browser_compatibility,
           mcp_platforms = EXCLUDED.mcp_platforms,
           mcp_protocol = EXCLUDED.mcp_protocol,
           mcp_run_command = EXCLUDED.mcp_run_command,
           extra_metadata = EXCLUDED.extra_metadata,
           updated_at = NOW()`,
        [
          item.id,
          JSON.stringify(platforms),
          JSON.stringify(deployment),
          JSON.stringify(keyFeatures),
          JSON.stringify(alternatives),
          JSON.stringify(integrations),
          pricingPlans,
          repoInfo.repo || null,
          repoInfo.license || null,
          repoInfo.lang || null,
          JSON.stringify(browserCompat),
          JSON.stringify(mcpPlatforms),
          mcpProtocol,
          mcpRunCommand,
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

    // 3. Enrich Papermark (ST-2026-095F) to published status with full metadata
    console.log('Enriching ST-2026-095F (Papermark) with full features and publishing...');
    await client.query(
      `UPDATE public.listings SET
         submission_status = 'published',
         published_at = NOW(),
         tagline = 'Open-source document sharing and virtual data rooms with page-by-page analytics.',
         short_description = 'Open-source DocSend alternative delivering real-time visitor tracking, custom branding, and virtual data rooms for security-minded teams.',
         full_description = 'Papermark is the modern, open-source document sharing platform built on Next.js. It gives founders, lawyers, and investment teams complete visibility over who views pitch decks, confidential financials, and contracts. Features include custom domains, dynamic email watermarking, password protection, and granular page-level analytics.',
         pricing_model = 'Freemium',
         starting_price = 'Free tier / $29/mo',
         category_id = 'virtual-data-rooms'
       WHERE id = 'ST-2026-095F'`
    );

    await client.query(
      `INSERT INTO public.listing_details (
         listing_id, platforms, deployment, key_features, alternatives, integrations,
         pricing_plans, repository_url, license, programming_language,
         extra_metadata
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (listing_id) DO UPDATE SET
         platforms = EXCLUDED.platforms,
         deployment = EXCLUDED.deployment,
         key_features = EXCLUDED.key_features,
         alternatives = EXCLUDED.alternatives,
         integrations = EXCLUDED.integrations,
         pricing_plans = EXCLUDED.pricing_plans,
         repository_url = EXCLUDED.repository_url,
         license = EXCLUDED.license,
         programming_language = EXCLUDED.programming_language,
         extra_metadata = EXCLUDED.extra_metadata,
         updated_at = NOW()`,
      [
        'ST-2026-095F',
        JSON.stringify(['Web']),
        JSON.stringify(['Cloud SaaS', 'Self-Hosted']),
        JSON.stringify([
          'Open-source document sharing with page-by-page engagement metrics',
          'Dynamic viewer watermarking displaying recipient email',
          'Custom domains and brand whitelabeling',
          'Virtual data room folders with granular access permissions',
          'Self-hostable via Docker or fully managed cloud',
        ]),
        JSON.stringify(['DocSend', 'SendNow', 'Tresorit', 'SS&C Intralinks']),
        JSON.stringify(['Slack', 'Notion', 'Zapier', 'Google Drive', 'GitHub']),
        'Free Plan: Unlimited documents & 500 views/mo | Team: $29/mo with custom domain & watermarking | Enterprise: $99/mo.',
        'https://github.com/mfts/papermark',
        'AGPL-3.0',
        'TypeScript / Next.js',
        JSON.stringify({
          security: {
            encryptionAtRest: 'AES-256',
            encryptionInTransit: 'TLS 1.3',
            endToEndEncrypted: false,
            zeroKnowledgeArchitecture: false,
            clientSideEncryption: false,
            certifications: ['SOC 2 Type II Compliant', 'GDPR Compliant'],
            dataCenterLocations: ['United States (AWS)', 'European Union'],
            customKeyManagement: false,
            auditLogging: true,
            twoFactorAuth: true,
            ssoSupported: true,
          },
          fileCapabilities: {
            maxFileSize: '100 MB per document',
            linkPasswordProtection: true,
            linkExpiration: true,
            downloadLimits: true,
            watermarking: true,
            viewOnlyMode: true,
            versionHistoryDays: 'Unlimited',
            customBranding: true,
          },
          storageCapabilities: {
            storageIncluded: 'Unlimited documents',
            syncCapabilities: false,
          },
          bestFitUseCases: [
            'Founders sharing investor pitch decks with page-by-page reading heatmaps',
            'Legal and M&A teams setting up rapid, self-hosted virtual data rooms',
            'Sales representatives tracking prospect document engagement in real time',
          ],
          advantages: [
            '100% open source under AGPL-3.0 with complete self-hosting freedom',
            'Accurate page-level analytics showing exact time spent per slide',
            'Full white-labeling with custom subdomains and custom branding',
          ],
          limitations: [
            '100 MB file limit per PDF or presentation deck',
            'Requires Redis and PostgreSQL when self-hosting in custom environments',
          ],
          faqs: [
            {
              question: 'Can I self-host Papermark on my own infrastructure?',
              answer: 'Yes, Papermark is fully open-source and provides official Docker Compose configurations to host on your own VPS or Kubernetes cluster.',
            },
          ],
          officialSources: [
            { title: 'Papermark GitHub Repository', url: 'https://github.com/mfts/papermark' },
            { title: 'Papermark Official Website', url: 'https://papermark.io' },
          ],
          verificationStatus: 'Verified',
          verifiedDate: '2026-10-19',
          verifiedBy: 'SecureTools Research Desk',
        }),
      ]
    );

    const counts = await client.query(`
      SELECT 
        (SELECT count(*) FROM public.categories) as cat_count,
        (SELECT count(*) FROM public.listings WHERE submission_status = 'published') as pub_count,
        (SELECT count(*) FROM public.listing_details) as details_count
    `);
    console.log('Database enrichment complete!', counts.rows[0]);
  } catch (err) {
    console.error('Enrichment error:', err);
    throw err;
  } finally {
    await client.end();
  }
}

enrichAndMigrate();
