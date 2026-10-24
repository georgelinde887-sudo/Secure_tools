import { Submission } from '@/types';

export const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 'sub-101',
    softwareName: 'VaultLink Enterprise',
    websiteUrl: 'https://vaultlink.example.com',
    shortDescription: 'Hardware-backed encrypted file transfer portal with YubiKey FIDO2 enforcement.',
    primaryCategory: 'secure-file-sharing',
    secondaryCategories: ['file-encryption', 'client-file-portals'],
    mainFeatures: 'FIDO2 WebAuthn support, AES-256 HSM storage, automated link expiration, zero-knowledge recipient verification.',
    pricingModel: 'Paid',
    submitterName: 'Johannes Vermeer',
    submitterEmail: 'j.vermeer@vaultlink.example.com',
    relationship: 'Founder/Creator',
    status: 'Pending Review',
    submittedAt: '2026-10-14T09:30:00Z',
    notes: 'Submitted for editorial review. Whitepaper provided for cryptographic verification.'
  },
  {
    id: 'sub-102',
    softwareName: 'DocuShield Redact',
    websiteUrl: 'https://docushield.example.com',
    shortDescription: 'AI-assisted irreversible legal document redaction utility for high-volume court filings.',
    primaryCategory: 'pdf-security',
    secondaryCategories: ['pdf-editors', 'document-scanning-ocr'],
    mainFeatures: 'Automatic PII and SSN pattern detection, true raster stripping, PDF/A compliance export, batch command-line execution.',
    pricingModel: 'Freemium',
    submitterName: 'Sarah Jenkins',
    submitterEmail: 'sarah.j@docushield.example.com',
    relationship: 'Team Member',
    status: 'Pending Review',
    submittedAt: '2026-10-15T14:15:00Z',
    notes: 'Free tier includes up to 50 pages/month. Enterprise pricing starts at $49/seat.'
  }
];
