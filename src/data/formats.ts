import { FileFormatDoc } from '@/types';

export const FILE_FORMATS: FileFormatDoc[] = [
  {
    id: 'fmt-pdf',
    slug: 'pdf',
    extension: '.pdf',
    fullName: 'Portable Document Format',
    standard: 'ISO 32000-2:2020',
    developer: 'Adobe Systems (Now maintained by ISO)',
    description: 'The global standard for capturing and presenting documents with layout fidelity independent of application software, hardware, and operating systems.',
    securityProfile: {
      macroRisk: 'Medium',
      metadataExposure: 'High (Embedded author names, revision history, and printer details often remain hidden unless sanitized)',
      encryptionSupported: true,
      digitalSignaturesSupported: true
    },
    recommendedTools: ['tool-adobe-acrobat', 'tool-sendnow'],
    commonUses: ['Legal contracts', 'Financial statements', 'Technical specifications', 'Government forms'],
    technicalSpecs: {
      'Compression': 'Flate, JPEG, JPEG 2000, CCITT Group 4',
      'Encryption Standards': 'AES-256 (Revision 6 / ISO 32000-2)',
      'Digital Signatures': 'PAdES (PDF Advanced Electronic Signatures), PKCS#7',
      'Archival Variant': 'PDF/A (ISO 19005)'
    }
  },
  {
    id: 'fmt-pdf-a',
    slug: 'pdf-a',
    extension: '.pdf',
    fullName: 'PDF for Long-Term Preservation (PDF/A)',
    standard: 'ISO 19005-1 / 19005-4',
    developer: 'International Organization for Standardization (ISO)',
    description: 'An ISO-standardized subset of PDF designed specifically for digital preservation and electronic document archiving, guaranteeing exact rendering decades into the future.',
    securityProfile: {
      macroRisk: 'None',
      metadataExposure: 'Strictly defined via standard XMP metadata packets',
      encryptionSupported: false, // Standard PDF/A prohibits encryption to ensure perpetual accessibility
      digitalSignaturesSupported: true
    },
    recommendedTools: ['tool-adobe-acrobat'],
    commonUses: ['Court record filings', 'Patent registries', 'Academic journal archiving', 'Medical records retention'],
    technicalSpecs: {
      'Prohibited Features': 'JavaScript, external font linking, audio/video embeds, encryption',
      'Mandatory Elements': '100% embedded fonts, device-independent color profiles (ICC)',
      'Conformance Levels': 'PDF/A-1b, PDF/A-2u, PDF/A-4'
    }
  },
  {
    id: 'fmt-7z',
    slug: '7z',
    extension: '.7z',
    fullName: '7-Zip Compressed Archive',
    standard: 'Open format specification',
    developer: 'Igor Pavlov',
    description: 'An open-source compressed archive format featuring high compression ratios through the LZMA and LZMA2 algorithms, along with strong 256-bit AES cryptographic encryption.',
    securityProfile: {
      macroRisk: 'None',
      metadataExposure: 'Low when Header Encryption is enabled; encrypts filenames and folder structure',
      encryptionSupported: true,
      digitalSignaturesSupported: false
    },
    recommendedTools: ['tool-7zip'],
    commonUses: ['Encrypted offline cold storage', 'Compressed software source distribution', 'Large database backups'],
    technicalSpecs: {
      'Compression Methods': 'LZMA, LZMA2, PPMd, BZip2',
      'Encryption Algorithm': 'AES-256 with SHA-256 key derivation (up to 2^19 iterations)',
      'Max File Size': '16 Exabytes',
      'Header Encryption': 'Supported (hides filenames)'
    }
  }
];
