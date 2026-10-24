import { Article } from '@/types';

export const ARTICLES: Article[] = [
  {
    id: 'art-share-financial-model-securely',
    slug: 'share-financial-model-investors-securely',
    title: 'How to Share a Financial Model With Investors Securely',
    category: 'Fundraising',
    pillar: 'File Sharing & Transfer',
    type: 'Guide',
    summary: 'Share a fundraising financial model without losing control of assumptions, versions, and sensitive IP.',
    coverImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
    author: {
      name: 'Alexander Reed',
      role: 'Venture Capital Diligence Lead'
    },
    publishedAt: '2026-10-14',
    updatedAt: '2026-10-14',
    readTimeMinutes: 6,
    tableOfContents: [
      { id: 'why-financial-models-leak', title: 'Why Financial Models Leak in Diligence' },
      { id: 'securing-formulas-vs-outputs', title: 'Securing Formulas vs Summary Outputs' },
      { id: 'link-permissioning-rules', title: 'Link Permissioning and Recipient Gating' },
      { id: 'version-control-discipline', title: 'Version Control and Audit Discipline' }
    ],
    content: `
## Why Financial Models Leak in Diligence

When raising capital, founders often circulate comprehensive spreadsheet models containing sensitive customer acquisition costs, unit economics, executive salaries, and strategic forecasts. Once an unencrypted .xlsx or Google Sheet link is shared with a venture firm, it can be easily forwarded, downloaded, or ingested into competitive market intelligence databases.

## Securing Formulas vs Summary Outputs

To protect your core valuation assumptions while providing investors with necessary transparency:

1. **Distinguish Teaser vs Deep Diligence Tiers:** Provide summary cash flow projections in view-only PDF format with dynamic watermarking for initial screening calls.
2. **Lock Underlying Macro Logic:** If distributing native spreadsheet workbooks, strip proprietary algorithm formulas and replace them with hardcoded audit outputs.
3. **Use Verified Data Rooms:** Deploy platforms like SendNow, Tresorit, or SS&C Intralinks that enforce recipient verification before granting workbook access.

## Link Permissioning and Recipient Gating

Never send open public links. Require investor email verification with one-time passcodes (OTP). Configure strict link expiration windows of 14 days and monitor page-by-page engagement metrics to identify which investors are actively evaluating assumptions.
`,
    sources: [
      { title: 'National Venture Capital Association (NVCA) Model Legal Documents', url: 'https://nvca.org' }
    ],
    relatedToolIds: ['tool-sendnow', 'tool-tresorit']
  },
  {
    id: 'art-protected-pdfs-screen-readers',
    slug: 'share-protected-pdfs-with-screen-reader-users',
    title: 'Share Protected PDFs With Screen Reader Users',
    category: 'Document Security',
    pillar: 'Document Security',
    type: 'How-to',
    summary: 'Share a protected PDF that an authorized screen reader user can actually read. Test accessibility tags without sacrificing security.',
    coverImage: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80',
    author: {
      name: 'Maya Chen',
      role: 'Accessibility & Security Compliance Specialist'
    },
    publishedAt: '2026-10-13',
    updatedAt: '2026-10-13',
    readTimeMinutes: 5,
    tableOfContents: [
      { id: 'the-conflict', title: 'Security Controls vs Screen Reader Accessibility' },
      { id: 'adobe-security-handlers', title: 'Configuring PDF Permissions for Assistive Tech' },
      { id: 'testing-workflow', title: 'Step-by-Step Verification Testing' }
    ],
    content: `
## Security Controls vs Screen Reader Accessibility

Traditional PDF password protection settings often disable text extraction permissions by default. While this deters unauthorized copy-pasting, it inadvertently blocks screen reader software (such as NVDA, JAWS, or Apple VoiceOver) from reading content aloud to visually impaired stakeholders.

## Configuring PDF Permissions for Assistive Tech

Modern PDF specifications allow granular permission toggles:
- **Enable Text Access for Screen Readers:** Ensure the flag "Enable text access for screen reader devices for the visually impaired" is explicitly checked when applying standard password restrictions.
- **Retain Copy Protection:** You can preserve restrictions against general clipboard copying while granting assistive access to certified screen reader APIs.

## Step-by-Step Verification Testing

Always test the generated file using standard assistive tools before external distribution to confirm that tags, reading orders, and alternative text descriptions render properly without permission errors.
`,
    sources: [
      { title: 'W3C Web Content Accessibility Guidelines (WCAG) 2.2', url: 'https://www.w3.org/WAI/standards-guidelines/wcag/' }
    ],
    relatedToolIds: ['tool-adobe-acrobat', 'tool-cryptomator']
  },
  {
    id: 'art-anonymize-customer-data-sharing',
    slug: 'anonymize-customer-data-before-sharing',
    title: 'Anonymize Customer Data Before Sharing',
    category: 'Due diligence',
    pillar: 'Document Security',
    type: 'Guide',
    summary: 'Prepare customer data for external sharing with practical minimization, masking and synthetic examples. Assess re-identification risk.',
    coverImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
    author: {
      name: 'Dr. Elena Vance',
      role: 'Principal Cryptographic Researcher'
    },
    publishedAt: '2026-10-13',
    updatedAt: '2026-10-13',
    readTimeMinutes: 8,
    tableOfContents: [
      { id: 'minimization-fundamentals', title: 'Data Minimization Fundamentals' },
      { id: 'masking-techniques', title: 'Pseudonymization vs True Anonymization' },
      { id: 'reidentification-vectors', title: 'Mitigating Quasi-Identifier Re-identification' }
    ],
    content: `
## Data Minimization Fundamentals

During M&A due diligence, audits, or vendor assessments, companies frequently need to demonstrate customer retention, cohort analysis, and transaction volumes. Sharing raw customer records violates GDPR, CCPA, and contractual confidentiality covenants.

## Pseudonymization vs True Anonymization

- **Pseudonymization:** Replaces direct identifiers (e.g., customer names) with artificial tokens. Under GDPR, pseudonymized data is still considered personal data because the keyholder can re-link identities.
- **Anonymization:** Irreversibly destroys the link between personal identifiers and records such that neither the sender nor the recipient can reconstruct individual identities.

## Mitigating Quasi-Identifier Re-identification

Remove indirect identifiers such as exact ZIP codes, timestamps, and narrow industry niches that could allow an adversary to triangulate corporate identities through public databases.
`,
    sources: [
      { title: 'European Data Protection Board (EDPB) Guidelines on Anonymization', url: 'https://edpb.europa.eu' }
    ],
    relatedToolIds: ['tool-sendnow', 'tool-nextcloud']
  },
  {
    id: 'art-check-whether-pdf-is-encrypted',
    slug: 'check-whether-your-pdf-is-encrypted',
    title: 'Check Whether Your PDF Is Encrypted',
    category: 'How-to',
    pillar: 'Document Security',
    type: 'Technical Explainer',
    summary: 'A PDF can open normally and still contain encryption settings. Check its Security properties and test a fresh copy before distribution.',
    coverImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
    author: {
      name: 'Marcus Sterling',
      role: 'Enterprise Infrastructure Analyst'
    },
    publishedAt: '2026-10-13',
    updatedAt: '2026-10-13',
    readTimeMinutes: 4,
    tableOfContents: [
      { id: 'why-passwords-fool-users', title: 'Why Opening Without a Prompt Can Fool You' },
      { id: 'checking-security-methods', title: 'Checking Document Properties in Readers' },
      { id: 'cli-verification', title: 'Verifying Encryption Headers via CLI' }
    ],
    content: `
## Why Opening Without a Prompt Can Fool You

A PDF document can have an "Owner Password" (permissions password) configured without requiring a "User Password" (open password). In this state, the file opens instantly in any viewer, but cryptographic encryption is active, restricting editing, printing, or form submission.

## Checking Document Properties in Readers

In Adobe Acrobat or standard PDF readers, press **Ctrl+D** (or **Cmd+D** on macOS) to open the Document Properties dialog. Navigate to the **Security** tab to verify:
- Security Method (e.g., Password Security, Certificate Security, or No Security)
- Encryption Level (e.g., 256-bit AES, 128-bit AES)
- Document Restrictions Summary for printing and content copying.
`,
    sources: [
      { title: 'ISO 32000-2: Document Management — Portable Document Format (PDF 2.0)', url: 'https://www.iso.org' }
    ],
    relatedToolIds: ['tool-adobe-acrobat', 'tool-cryptomator']
  },
  {
    id: 'art-zero-knowledge-encryption',
    slug: 'zero-knowledge-encryption-guide',
    title: 'Zero-Knowledge Encryption Explained: Architecture, Trade-Offs, and Verification',
    category: 'Document Security',
    pillar: 'Document Security',
    type: 'Technical Explainer',
    summary: 'A deep technical breakdown of client-side key derivation, zero-knowledge threat models, and why server-side encryption is insufficient for absolute confidentiality.',
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    author: {
      name: 'Dr. Elena Vance',
      role: 'Principal Cryptographic Researcher'
    },
    publishedAt: '2026-10-12',
    updatedAt: '2026-10-12',
    readTimeMinutes: 9,
    tableOfContents: [
      { id: 'the-problem-with-server-side', title: 'The Limitation of Server-Side Encryption' },
      { id: 'zero-knowledge-defined', title: 'What Zero-Knowledge Means in Practice' },
      { id: 'key-derivation-mechanisms', title: 'Key Derivation: PBKDF2, Argon2, and scrypt' },
      { id: 'the-tradeoffs', title: 'The Inherent Operational Trade-offs' }
    ],
    content: `
## The Limitation of Server-Side Encryption

Most mainstream cloud storage providers advertise "256-bit AES encryption at rest." While technically accurate, this statement often obscures a critical operational reality: the cloud provider holds the cryptographic master keys. 

Server-side encryption protects data against physical disk theft from a data center, but offers zero protection against authorized or compromised access from inside the cloud boundary.

## What Zero-Knowledge Means in Practice

In enterprise file security, "zero-knowledge" denotes an architectural paradigm where encryption and decryption occur exclusively on the endpoint device before data enters the transmission channel.
`,
    sources: [
      { title: 'NIST Special Publication 800-132: Recommendation for Password-Based Key Derivation', url: 'https://csrc.nist.gov' }
    ],
    relatedToolIds: ['tool-tresorit', 'tool-proton-drive', 'tool-cryptomator']
  },
  {
    id: 'art-enterprise-file-sharing-checklist',
    slug: 'enterprise-file-sharing-security-checklist',
    title: 'The Enterprise File Sharing Security Checklist: 12 Non-Negotiables',
    category: 'File Sharing',
    pillar: 'File Sharing & Transfer',
    type: 'Guide',
    summary: 'A comprehensive procurement and configuration checklist for IT leaders evaluating enterprise file sharing and document collaboration systems.',
    coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    author: {
      name: 'Marcus Sterling',
      role: 'Enterprise Infrastructure Analyst'
    },
    publishedAt: '2026-10-10',
    updatedAt: '2026-10-10',
    readTimeMinutes: 7,
    tableOfContents: [
      { id: 'access-controls', title: '1. Granular Link Controls and Expiration' },
      { id: 'recipient-identity', title: '2. Recipient Identity Verification' },
      { id: 'watermarking', title: '3. Dynamic Recipient Watermarking' },
      { id: 'audit-logging', title: '4. Immutable Audit Logs & SIEM Export' }
    ],
    content: `
## Evaluating Modern File Sharing Platforms

Enterprise file sharing is no longer just about sending links—it is a critical frontline defense against intellectual property leaks, compliance sanctions, and corporate espionage. When reviewing commercial software, ensure your procurement evaluation covers these fundamental criteria:

1. **Granular Link Controls:** Enforced passwords, hard expiration dates, and view-only browser rendering.
2. **Dynamic Watermarking:** Stamped viewer IP, email, and timestamp across pages.
3. **Immutable Audit Logs:** Real-time SIEM export and cryptographic event tracking.
`,
    sources: [
      { title: 'CISA Secure Cloud Collaboration Architecture Guidelines', url: 'https://www.cisa.gov' }
    ],
    relatedToolIds: ['tool-sendnow', 'tool-tresorit', 'tool-box']
  },
  {
    id: 'art-vdr-seed-series-a-diligence',
    slug: 'setting-up-vdr-seed-series-a-diligence',
    title: 'Setting Up a Virtual Data Room for Seed & Series A Due Diligence',
    category: 'Virtual data rooms',
    pillar: 'Data Rooms & M&A',
    type: 'Guide',
    summary: 'Structure folder trees, permission groups, and watermarking rules to streamline investor diligence without leaking cap tables.',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    author: {
      name: 'Alexander Reed',
      role: 'Venture Capital Diligence Lead'
    },
    publishedAt: '2026-10-08',
    updatedAt: '2026-10-08',
    readTimeMinutes: 6,
    tableOfContents: [
      { id: 'folder-hierarchy', title: 'Standard Diligence Folder Hierarchy' },
      { id: 'permission-tiers', title: 'Managing Investor Permission Tiers' },
      { id: 'q-and-a-workflows', title: 'Coordinating Diligence Q&A Trackers' }
    ],
    content: `
## Standard Diligence Folder Hierarchy

A clean, standardized data room structure signals professional governance to institutional investors. Standard hierarchy includes:
- **01 Corporate Governance:** Articles of incorporation, board resolutions, bylaws.
- **02 Cap Table & Financing:** Historical term sheets, SAFEs, option plans.
- **03 Financial Records:** P&L statements, balance sheets, tax returns.
- **04 Material Contracts:** Key enterprise customer agreements, strategic partnerships.
`,
    sources: [
      { title: 'Securities and Exchange Commission (SEC) Regulation D Guidance', url: 'https://www.sec.gov' }
    ],
    relatedToolIds: ['tool-intralinks', 'tool-sendnow']
  },
  {
    id: 'art-e2ee-vs-encryption-at-rest-ma',
    slug: 'e2ee-vs-encryption-at-rest-ma-teams',
    title: 'End-to-End Encryption vs Encryption-at-Rest: What M&A Teams Must Know',
    category: 'M&A',
    pillar: 'Document Security',
    type: 'Technical Explainer',
    summary: 'Why basic server-side disk encryption fails international regulatory audits during cross-border mergers and acquisitions.',
    coverImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
    author: {
      name: 'Dr. Elena Vance',
      role: 'Principal Cryptographic Researcher'
    },
    publishedAt: '2026-10-05',
    updatedAt: '2026-10-05',
    readTimeMinutes: 7,
    tableOfContents: [
      { id: 'regulatory-exposure', title: 'Regulatory Exposure in Cross-Border Deals' },
      { id: 'cloud-act-implications', title: 'US Cloud Act vs EU Sovereignty' },
      { id: 'enforcing-client-keys', title: 'Enforcing Customer-Held Keys' }
    ],
    content: `
## Regulatory Exposure in Cross-Border Deals

When corporate deal teams exchange unredacted employment contracts, IP source code, and customer records across jurisdictions, relying on default cloud storage "encryption at rest" exposes both parties to severe discovery and compliance liabilities. True client-side encryption ensures that no foreign legal entity can seize plaintext deal records.
`,
    sources: [
      { title: 'European Data Protection Board Cross-Border Data Transfer Framework', url: 'https://edpb.europa.eu' }
    ],
    relatedToolIds: ['tool-tresorit', 'tool-box']
  },
  {
    id: 'art-preventing-leaks-sales-proposals',
    slug: 'preventing-leaks-in-sales-proposals-watermarking',
    title: 'Preventing Leaks in Sales Proposals: Dynamic Watermarking Best Practices',
    category: 'Sales Enablement',
    pillar: 'File Sharing & Transfer',
    type: 'Guide',
    summary: 'How enterprise sales teams stamp viewer identity, IP address, and session timestamps to deter screenshots and RFP leaks.',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    author: {
      name: 'Alexander Reed',
      role: 'Enterprise Go-To-Market Advisor'
    },
    publishedAt: '2026-10-01',
    updatedAt: '2026-10-01',
    readTimeMinutes: 5,
    tableOfContents: [
      { id: 'the-rfp-leak-threat', title: 'The Commercial RFP Leak Threat' },
      { id: 'dynamic-watermark-mechanics', title: 'How Dynamic Watermarks Work' },
      { id: 'engagement-analytics', title: 'Correlating Viewer Dwell Times with Conversion' }
    ],
    content: `
## The Commercial RFP Leak Threat

In high-value enterprise software and consulting sales, proprietary commercial proposals frequently get circulated to rival vendors to drive down pricing. Dynamic watermarking stamps the recipient's personal corporate email and IP address diagonally across every slide and proposal page, deterring screenshots and unauthorized sharing.
`,
    sources: [
      { title: 'Association of Proposal Management Professionals (APMP) Best Practices', url: 'https://www.apmp.org' }
    ],
    relatedToolIds: ['tool-sendnow', 'tool-tresorit']
  }
];
