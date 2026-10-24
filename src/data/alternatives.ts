import { AlternativeItem } from '@/types';

export const ALTERNATIVES: AlternativeItem[] = [
  {
    id: 'alt-dropbox',
    slug: 'dropbox',
    toolId: 'tool-dropbox',
    title: 'Top Secure Alternatives to Dropbox in 2026',
    summary: 'Evaluate privacy-respecting, zero-knowledge, and enterprise alternatives to Dropbox for secure file storage and team collaboration.',
    whyUsersSeekAlternatives: [
      'Lack of default zero-knowledge encryption: Dropbox holds encryption keys and can scan or index file contents.',
      'Data sovereignty concerns under US Cloud Act jurisdiction for European and international businesses.',
      'Rising subscription costs and feature bloat away from pure, focused cloud sync.',
      'Desire for self-hosted or private cloud infrastructure to guarantee total data ownership.'
    ],
    commonLimitations: [
      'Metadata (filenames, timestamps, folder structures) is unencrypted on Dropbox servers.',
      'Third-party AI integrations training on user content have prompted security and compliance audits.',
      'Client-side encryption requires manual third-party vault utilities.'
    ],
    alternativeToolIds: ['tool-tresorit', 'tool-proton-drive', 'tool-nextcloud', 'tool-box'],
    tradeOffAnalysis: [
      {
        toolId: 'tool-tresorit',
        keyAdvantageOverOriginal: 'True zero-knowledge client-side AES-256 encryption with Swiss legal jurisdiction.',
        potentialDrawback: 'Higher price per seat ($14.50/mo) and smaller file size limits (20 GB).',
        bestFor: 'Legal, financial, and healthcare organizations requiring absolute data confidentiality.'
      },
      {
        toolId: 'tool-proton-drive',
        keyAdvantageOverOriginal: 'End-to-end encrypted file contents and metadata backed by Swiss privacy laws.',
        potentialDrawback: 'Smaller integration ecosystem; lacking advanced enterprise team admin policies.',
        bestFor: 'Privacy-focused individuals, journalists, and distributed small teams.'
      },
      {
        toolId: 'tool-nextcloud',
        keyAdvantageOverOriginal: '100% open-source, self-hosted on your own hardware with no per-user licensing fees.',
        potentialDrawback: 'Requires in-house DevOps maintenance, server provisioning, and backup monitoring.',
        bestFor: 'Enterprises, universities, and technical teams demanding total data sovereignty.'
      },
      {
        toolId: 'tool-box',
        keyAdvantageOverOriginal: 'Enterprise-grade governance, FedRAMP High certification, and customer key control via Box KeySafe.',
        potentialDrawback: 'Geared towards large enterprise contracts rather than small teams or individuals.',
        bestFor: 'Mid-market to Fortune 500 enterprises needing automated compliance and compliance routing.'
      }
    ],
    lastUpdated: '2026-09-25'
  },
  {
    id: 'alt-wetransfer',
    slug: 'wetransfer',
    toolId: 'tool-wetransfer',
    title: 'Top Secure Alternatives to WeTransfer in 2026',
    summary: 'Explore alternatives to WeTransfer offering document access analytics, dynamic watermarking, zero-knowledge privacy, and indefinite retention.',
    whyUsersSeekAlternatives: [
      'Free WeTransfer links expire after 7 days, causing dead links and recipient friction.',
      'Lack of viewer tracking and page-by-page analytics for business proposals and pitch decks.',
      'Public URLs on free tiers do not enforce recipient authentication or dynamic watermarking.',
      'Compliance mandates requiring audit logs of who opened or downloaded sensitive company files.'
    ],
    commonLimitations: [
      'No post-download access revocation or screenshot deterrent features.',
      'Free links can be forwarded and downloaded by unauthorized third parties who obtain the link.',
      'Files are decrypted on WeTransfer cloud infrastructure during processing.'
    ],
    alternativeToolIds: ['tool-sendnow', 'tool-tresorit'],
    tradeOffAnalysis: [
      {
        toolId: 'tool-sendnow',
        keyAdvantageOverOriginal: 'Real-time viewer engagement analytics, dynamic recipient watermarking, and instant link kill-switch.',
        potentialDrawback: 'Max file size is 500 MB (optimized for presentations, PDFs, and documents).',
        bestFor: 'Founders sharing pitch decks, sales teams sending commercial quotes, and agencies protecting deliverables.'
      },
      {
        toolId: 'tool-tresorit',
        keyAdvantageOverOriginal: 'End-to-end encrypted zero-knowledge link sharing with granular download limits and policy enforcement.',
        potentialDrawback: 'Requires paid business subscription; does not have a free one-click transfer mode.',
        bestFor: 'Compliance-heavy document exchanges with external auditors, regulators, or legal counsel.'
      }
    ],
    lastUpdated: '2026-10-05'
  }
];

export interface AlternativeSummaryItem {
  name: string;
  slug: string;
  count: number;
  category: string;
}

export const POPULAR_ALTERNATIVES_LIST: AlternativeSummaryItem[] = [
  { name: 'Dropbox', slug: 'dropbox', count: 38, category: 'Cloud Storage & File Sharing' },
  { name: 'Canva', slug: 'canva', count: 30, category: 'Document & Design Tools' },
  { name: 'Google Drive', slug: 'google-drive', count: 28, category: 'Cloud Storage' },
  { name: 'WeTransfer', slug: 'wetransfer', count: 24, category: 'Large File Transfer' },
  { name: 'Microsoft OneDrive', slug: 'onedrive', count: 22, category: 'Enterprise Storage' },
  { name: 'Bitwarden', slug: 'bitwarden', count: 20, category: 'Credential Security' },
  { name: '1Password', slug: '1password', count: 19, category: 'Password Management' },
  { name: 'Notion', slug: 'notion', count: 19, category: 'Document Collaboration' },
  { name: 'DocuSign', slug: 'docusign', count: 18, category: 'Electronic Signatures' },
  { name: 'DocSend', slug: 'docsend', count: 18, category: 'Secure Document Tracking' },
  { name: 'Nextcloud', slug: 'nextcloud', count: 16, category: 'Self-Hosted Storage' },
  { name: 'Box', slug: 'box', count: 16, category: 'Enterprise Content Management' },
  { name: 'Tresorit', slug: 'tresorit', count: 15, category: 'Zero-Knowledge Storage' },
  { name: 'SS&C Intralinks', slug: 'intralinks', count: 15, category: 'Virtual Data Rooms' },
  { name: 'Proton Drive', slug: 'proton-drive', count: 14, category: 'Encrypted Cloud Storage' },
  { name: 'Adobe Acrobat', slug: 'adobe-acrobat', count: 13, category: 'PDF & Document Tools' },
  { name: 'Cryptomator', slug: 'cryptomator', count: 13, category: 'Client-Side Encryption' },
  { name: 'Figma', slug: 'figma', count: 13, category: 'Collaborative Workspace' },
  { name: 'ChatGPT', slug: 'chatgpt', count: 13, category: 'AI Security & LLM' },
  { name: 'SendNow', slug: 'sendnow', count: 13, category: 'Secure File Transfer' },
  { name: 'Datasite', slug: 'datasite', count: 12, category: 'Virtual Data Rooms' },
  { name: 'VeraCrypt', slug: 'veracrypt', count: 12, category: 'Disk & File Encryption' },
  { name: '7-Zip', slug: '7-zip', count: 11, category: 'File Compression & Archiving' },
  { name: 'G2', slug: 'g2', count: 11, category: 'Software Research' },
  { name: 'Capterra', slug: 'capterra', count: 11, category: 'Software Comparison' },
  { name: 'Proton Pass', slug: 'proton-pass', count: 11, category: 'Encrypted Passwords' },
  { name: 'OWASP ZAP', slug: 'owasp-zap', count: 11, category: 'Security Testing & DAST' },
  { name: 'Firmex', slug: 'firmex', count: 10, category: 'Virtual Data Rooms' },
  { name: 'Semgrep', slug: 'semgrep', count: 10, category: 'Static Code Security' },
  { name: 'PeaZip', slug: 'peazip', count: 10, category: 'Open-Source Archiving' },
  { name: 'uBlock Origin', slug: 'ublock-origin', count: 9, category: 'Browser Shielding' },
  { name: 'Evernote', slug: 'evernote', count: 9, category: 'Encrypted Notes' },
  { name: 'Trello', slug: 'trello', count: 9, category: 'Kanban & Workflow' },
  { name: 'Privacy Badger', slug: 'privacy-badger', count: 8, category: 'Anti-Tracking' },
  { name: 'TruffleHog', slug: 'trufflehog', count: 8, category: 'Secrets Detection' },
  { name: 'Snyk', slug: 'snyk', count: 8, category: 'Vulnerability Management' },
];
