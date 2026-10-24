export type PricingModel = 'Free' | 'Freemium' | 'Paid' | 'Open Source' | 'Enterprise Quote';

export type DeploymentType = 'Cloud SaaS' | 'Self-Hosted' | 'Hybrid' | 'On-Premise';

export type PlatformType =
  | 'Web'
  | 'Windows'
  | 'macOS'
  | 'Linux'
  | 'iOS'
  | 'Android'
  | 'Chrome'
  | 'Edge'
  | 'Firefox'
  | 'Safari'
  | 'Brave'
  | 'Claude'
  | 'ChatGPT'
  | 'Cursor'
  | 'MCP'
  | 'Docker'
  | 'Self-Hosted';

export type VerificationStatus = 'Verified' | 'Pending Verification' | 'Community Reported';

export interface Category {
  id: string;
  slug: string;
  name: string;
  pillar: string;
  description: string;
  iconName: string;
  toolCount: number;
  featured?: boolean;
}

export interface SecuritySpecification {
  encryptionAtRest?: string;
  encryptionInTransit?: string;
  endToEndEncrypted: boolean;
  zeroKnowledgeArchitecture: boolean;
  clientSideEncryption: boolean;
  certifications: string[]; // e.g. ["SOC 2 Type II", "ISO 27001", "HIPAA", "GDPR"]
  dataCenterLocations: string[];
  customKeyManagement: boolean;
  auditLogging: boolean;
  twoFactorAuth: boolean;
  ssoSupported: boolean;
}

export interface SoftwareItem {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  shortDescription: string;
  fullOverview: string;
  websiteUrl: string;
  logoUrl?: string;
  itemType?: 'software' | 'extension' | 'plugin' | 'open-source';
  repositoryUrl?: string;
  extensionStoreUrl?: string;
  packageUrl?: string;
  browserCompatibility?: string[];
  mcpProtocol?: string;
  mcpRunCommand?: string;
  mcpConfigSnippet?: string;
  mcpPlatforms?: string[];
  license?: string;
  primaryCategory: string;
  secondaryCategories: string[];
  pricingModel: PricingModel;
  startingPrice?: string;
  freeTierAvailable: boolean;
  freeTrialDays?: number;
  deployment: DeploymentType[];
  platforms: PlatformType[];
  security: SecuritySpecification;
  fileCapabilities: {
    maxFileSize?: string;
    linkPasswordProtection: boolean;
    linkExpiration: boolean;
    downloadLimits: boolean;
    watermarking: boolean;
    viewOnlyMode: boolean;
    versionHistoryDays?: string;
    customBranding: boolean;
  };
  storageCapabilities?: {
    storageIncluded?: string;
    syncCapabilities: boolean;
    bandwidthLimits?: string;
  };
  keyFeatures: string[];
  bestFitUseCases: string[];
  advantages: string[];
  limitations: string[];
  integrations: string[];
  alternatives?: string[];
  screenshots?: string[];
  youtubeVideoUrl?: string;
  pricingPlans?: PricingPlan[];
  pricingUrl?: string;
  faqs: { question: string; answer: string }[];
  officialSources: { title: string; url: string }[];
  verifiedDate: string;
  verifiedBy: string;
  verificationStatus: VerificationStatus;
  published: boolean;
  featured?: boolean;
  reviewsCount?: number;
  rating?: number;
  viewsCount?: number;
  clicksCount?: number;
  createdAt?: string;
  publishedAt?: string;
}

export function getItemPath(item: { slug: string; itemType?: string; pricingModel?: string }): string {
  if (item.itemType === 'extension') return `/extensions/${item.slug}`;
  if (item.itemType === 'plugin') return `/plugins/${item.slug}`;
  if (item.itemType === 'open-source' || item.pricingModel === 'Open Source') return `/open-source/${item.slug}`;
  return `/tools/${item.slug}`;
}

export interface PricingPlan {
  name: string;
  monthlyPrice?: string;
  yearlyPrice?: string;
  billingPeriod?: string;
  description?: string;
  features?: string[];
  isPopular?: boolean;
}

export interface ComparisonItem {
  id: string;
  slug: string; // e.g., 'tresorit-vs-box'
  toolAId: string;
  toolBId: string;
  title: string;
  summary: string;
  targetAudienceA: string;
  targetAudienceB: string;
  featureMatrix: {
    category: string;
    feature: string;
    toolAValue: string;
    toolBValue: string;
    notes?: string;
  }[];
  securityComparison: string;
  fileSharingComparison: string;
  pricingComparison: string;
  verdictA: string; // When to choose Tool A
  verdictB: string; // When to choose Tool B
  lastUpdated: string;
}

export interface AlternativeItem {
  id: string;
  slug: string; // e.g., 'dropbox'
  toolId: string;
  title: string;
  summary: string;
  whyUsersSeekAlternatives: string[];
  commonLimitations: string[];
  alternativeToolIds: string[];
  tradeOffAnalysis: {
    toolId: string;
    keyAdvantageOverOriginal: string;
    potentialDrawback: string;
    bestFor: string;
  }[];
  lastUpdated: string;
}

export interface BestCollection {
  id: string;
  slug: string; // e.g., 'secure-file-sharing'
  title: string;
  categorySlug: string;
  subtitle: string;
  selectionMethodology: string;
  evaluationCriteria: string[];
  toolIds: string[];
  rankings: {
    toolId: string;
    awardBadge: string; // e.g. "Best for Zero-Knowledge", "Best for Enterprise Teams"
    editorialSummary: string;
    keyDifferentiator: string;
  }[];
  buyingAdvice: string;
  lastUpdated: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  category: string;
  pillar: string;
  type: 'Guide' | 'Research' | 'Technical Explainer' | 'Industry Analysis' | 'How-to';
  summary: string;
  coverImage?: string;
  author: {
    name: string;
    role: string;
    avatarUrl?: string;
  };
  publishedAt: string;
  updatedAt: string;
  readTimeMinutes: number;
  tableOfContents: { id: string; title: string }[];
  content: string; // Markdown or rich HTML sections
  sources: { title: string; url: string }[];
  relatedToolIds: string[];
}

export interface FileFormatDoc {
  id: string;
  slug: string;
  extension: string;
  fullName: string;
  standard: string;
  developer: string;
  description: string;
  securityProfile: {
    macroRisk: 'None' | 'Low' | 'Medium' | 'High';
    metadataExposure: string;
    encryptionSupported: boolean;
    digitalSignaturesSupported: boolean;
  };
  recommendedTools: string[];
  commonUses: string[];
  technicalSpecs: { [key: string]: string };
}

export type ListingItemType = 'software' | 'open-source' | 'extension' | 'plugin';

export interface Submission {
  id: string;
  itemType?: ListingItemType;
  softwareName: string;
  websiteUrl?: string;
  repositoryUrl?: string;
  extensionStoreUrl?: string;
  packageUrl?: string;
  logoUrl?: string;
  screenshots?: string[];
  shortDescription: string;
  fullOverview?: string;
  primaryCategory: string;
  secondaryCategories?: string[];
  mainFeatures?: string | string[];
  pricingModel?: string;
  pricingPlans?: string;
  contractsAndLicensing?: string;
  sourceCodeLicense?: string;
  browserCompatibility?: string[];
  extensionId?: string;
  developerName?: string;
  mcpPlatforms?: string[];
  mcpProtocol?: string;
  mcpRunCommand?: string;
  mcpConfigSnippet?: string;
  mcpCapabilities?: string;
  alternatives?: string[];
  integrations?: string[];
  supportChannels?: string[];
  contactPhone?: string;
  submitterName: string;
  submitterEmail: string;
  relationship: string;
  status: 'Pending Review' | 'Approved' | 'Rejected';
  submittedAt: string;
  notes?: string;
}
