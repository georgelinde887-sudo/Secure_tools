import { ComparisonItem } from '@/types';

export const COMPARISONS: ComparisonItem[] = [
  {
    id: 'comp-tresorit-vs-box',
    slug: 'tresorit-vs-box',
    toolAId: 'tool-tresorit',
    toolBId: 'tool-box',
    title: 'Tresorit vs Box: Enterprise Security and Architecture Compared',
    summary: 'A direct comparison of client-side zero-knowledge encrypted storage (Tresorit) versus enterprise content management with custom key management (Box).',
    targetAudienceA: 'Heavily regulated organizations, legal counsel, and security teams who require mathematical guarantees that zero third parties—including the host—can inspect data.',
    targetAudienceB: 'Mid-market to global enterprises needing extensive third-party SaaS integrations (Salesforce, Slack, Microsoft 365) and automated workflow routing.',
    featureMatrix: [
      {
        category: 'Core Cryptography',
        feature: 'Zero-Knowledge Architecture',
        toolAValue: 'Yes (Full client-side key derivation; provider holds zero plaintext keys)',
        toolBValue: 'No (Box servers process plaintext content unless KeySafe is used)',
        notes: 'Tresorit provides mathematical privacy; Box provides compliance through policy and KeySafe.'
      },
      {
        category: 'Core Cryptography',
        feature: 'Customer-Managed Encryption Keys',
        toolAValue: 'Built into standard client key model',
        toolBValue: 'Yes via Box KeySafe (requires AWS KMS or Google Cloud KMS)',
        notes: 'Box KeySafe requires enterprise tier and separate cloud KMS billing.'
      },
      {
        category: 'File Sharing Controls',
        feature: 'Dynamic Watermarking',
        toolAValue: 'Yes (Recipient email & timestamp rendered dynamically)',
        toolBValue: 'Yes (Available on Business Plus and Enterprise)',
        notes: 'Both prevent unauthorized redistribution of sensitive previews.'
      },
      {
        category: 'File Sharing Controls',
        feature: 'Max Single File Upload',
        toolAValue: '20 GB (Enterprise)',
        toolBValue: '150 GB (Enterprise Plus)',
        notes: 'Box handles massive media files significantly better.'
      },
      {
        category: 'Compliance & Governance',
        feature: 'FedRAMP Authorization',
        toolAValue: 'Not FedRAMP certified',
        toolBValue: 'FedRAMP High authorized',
        notes: 'Box is essential for US federal government agencies and contractors.'
      },
      {
        category: 'Compliance & Governance',
        feature: 'Data Sovereignty Options',
        toolAValue: 'Switzerland, Germany, UK, Ireland, US',
        toolBValue: 'Box Zones across US, EU, Japan, Canada, Australia',
        notes: 'Tresorit operates under strict Swiss and EU privacy statutes.'
      },
      {
        category: 'Integrations & Ecosystem',
        feature: 'Third-Party SaaS Integrations',
        toolAValue: 'Curated (Microsoft 365, Google Workspace, Okta)',
        toolBValue: 'Over 1,500 pre-built connectors',
        notes: 'Box integrates deeply with Salesforce, Slack, Workday, ServiceNow.'
      },
      {
        category: 'Pricing Structure',
        feature: 'Entry Business Price',
        toolAValue: '$14.50 / user / month (min. 3 users)',
        toolBValue: '$15.00 / user / month (min. 3 users)',
        notes: 'Comparable baseline pricing, but Box charges premium for KeySafe.'
      }
    ],
    securityComparison: 'Tresorit is built from the ground up on zero-knowledge cryptography: data is encrypted on the client device before it touches the network, meaning even a legal subpoena to Tresorit cannot decrypt customer data without the user password. Box, conversely, prioritizes enterprise content collaboration and productivity: it operates a centralized encryption model with options for customer-managed keys (Box KeySafe) that satisfy strict compliance mandates (SOC 2, FedRAMP High, HIPAA) while preserving full-text search, server-side virus scanning, and deep application integrations.',
    fileSharingComparison: 'Both platforms offer enterprise-grade file sharing controls, including password-protected links, expiry dates, download prevention, and dynamic watermarks stamped with recipient identity. Box excels in handling very large individual files (up to 150 GB) and complex team folder hierarchies. Tresorit excels in frictionless encrypted sharing with external parties who do not hold a Tresorit account, providing zero-knowledge client portals.',
    pricingComparison: 'Tresorit plans start at $14.50/user/month for small business teams, offering built-in end-to-end encryption without hidden add-on fees. Box plans start at $15/user/month for Business tiers, but advanced governance, Shield security, and KeySafe key management require Enterprise and Enterprise Plus tiers, which represent a substantially higher investment.',
    verdictA: 'Choose Tresorit when your primary mandate is verifiable cryptographic zero-knowledge privacy, Swiss/EU data protection, or sharing trade secrets and client litigation documents without server-side exposure.',
    verdictB: 'Choose Box when your organization requires a unified enterprise content cloud integrated into thousands of SaaS workflows, FedRAMP High certification, or unlimited storage with high file-size capacity.',
    lastUpdated: '2026-09-20'
  },
  {
    id: 'comp-sendnow-vs-wetransfer',
    slug: 'sendnow-vs-wetransfer',
    toolAId: 'tool-sendnow',
    toolBId: 'tool-wetransfer',
    title: 'SendNow vs WeTransfer: Document Tracking vs Ad-Hoc File Delivery',
    summary: 'Comparing a secure document tracking portal (SendNow) against a high-volume ad-hoc file transfer service (WeTransfer).',
    targetAudienceA: 'Founders, dealmakers, sales executives, and legal professionals who need to control document distribution, track page reading time, and prevent unauthorized downloads.',
    targetAudienceB: 'Creative directors, videographers, and design agencies who need to transmit large video or asset packages (up to 200 GB) with minimal recipient friction.',
    featureMatrix: [
      {
        category: 'Core Purpose',
        feature: 'Primary Use Case',
        toolAValue: 'Document security, engagement tracking, watermarking',
        toolBValue: 'Large file delivery and download distribution',
        notes: 'Fundamentally different operational objectives.'
      },
      {
        category: 'File Limits',
        feature: 'Max Single File Size',
        toolAValue: '500 MB (Optimized for documents & decks)',
        toolBValue: '2 GB (Free) / 200 GB (Pro) / Unlimited (Premium)',
        notes: 'WeTransfer is engineered for heavy media payloads.'
      },
      {
        category: 'Security Controls',
        feature: 'Dynamic Watermarking',
        toolAValue: 'Yes (Stamps viewer IP, email, and timestamp)',
        toolBValue: 'No',
        notes: 'SendNow actively deters unauthorized screenshotting.'
      },
      {
        category: 'Security Controls',
        feature: 'Remote Link Revocation',
        toolAValue: 'Instant one-click killswitch',
        toolBValue: 'Delete transfer from account dashboard',
        notes: 'SendNow revokes live browser sessions immediately.'
      },
      {
        category: 'Viewer Intelligence',
        feature: 'Page-by-Page Time Analytics',
        toolAValue: 'Yes (Heatmaps and per-page duration)',
        toolBValue: 'No (Download confirmation only)',
        notes: 'SendNow informs senders which slides or clauses received attention.'
      },
      {
        category: 'Branding & Experience',
        feature: 'Custom Portal Branding',
        toolAValue: 'Custom subdomain, logo, and brand colors',
        toolBValue: 'Full-screen background wallpapers and custom email templates',
        notes: 'Both offer distinct professional presentation.'
      }
    ],
    securityComparison: 'SendNow is built for document containment: links can enforce email gating, require SMS or passcode verification, disable downloads entirely, and overlay tamper-resistant dynamic watermarks on the viewer screen. WeTransfer acts as a secure digital courier: once files are downloaded by the recipient, the sender retains no post-delivery control or visibility.',
    fileSharingComparison: 'WeTransfer handles virtually all file formats including multi-gigabyte video renders, raw audio tracks, and ZIP archives. SendNow is specialized for business documents, pitch decks, PDFs, and legal contracts where sender insight and access revocation are paramount.',
    pricingComparison: 'WeTransfer offers a free tier (2 GB files, 7-day retention) and a $12/month Pro tier. SendNow offers a free starter tier with watermarking and link revocation, and premium plans starting at $15/month with advanced viewer analytics and custom domains.',
    verdictA: 'Choose SendNow when sharing sensitive business plans, pitch decks, contracts, or confidential proposals where you need to verify recipient identity, track reader engagement, and prevent unauthorized file distribution.',
    verdictB: 'Choose WeTransfer when your primary requirement is delivering multi-gigabyte video or media files to clients and collaborators with the absolute minimum onboarding friction.',
    lastUpdated: '2026-10-02'
  }
];
