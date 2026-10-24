import { SOFTWARE_LISTINGS } from '@/data/software';
import { CATEGORIES, PILLARS } from '@/data/categories';
import { COMPARISONS } from '@/data/comparisons';
import { ALTERNATIVES } from '@/data/alternatives';
import { BEST_COLLECTIONS } from '@/data/best-collections';
import { ARTICLES } from '@/data/articles';
import { FILE_FORMATS } from '@/data/formats';
import { INITIAL_SUBMISSIONS } from '@/data/submissions';
import { SoftwareItem, Category, ComparisonItem, AlternativeItem, BestCollection, Article, FileFormatDoc, Submission } from '@/types';

export {
  fetchSoftwareFromDb,
  fetchCategoriesFromDb,
  fetchSoftwareBySlugFromDb,
  fetchSoftwareByIdFromDb,
  fetchSoftwareByCategoryFromDb,
  fetchOpenSourceFromDb,
  fetchExtensionsFromDb,
  fetchPluginsFromDb,
  mapListingToSoftwareItem,
  compareSoftwareRank,
  sortSoftwareByEnterpriseRank,
} from './db-data';

export function getAllSoftware(): SoftwareItem[] {
  return SOFTWARE_LISTINGS.filter(s => s.published);
}

export function getFeaturedSoftware(): SoftwareItem[] {
  return SOFTWARE_LISTINGS.filter(s => s.published && s.featured);
}

export function getOpenSourceSoftware(): SoftwareItem[] {
  return SOFTWARE_LISTINGS.filter(s => {
    if (!s.published) return false;
    const isModel = s.pricingModel === 'Open Source';
    const hasTag = s.tagline?.toLowerCase().includes('open-source') || s.tagline?.toLowerCase().includes('open source');
    const hasDesc = s.shortDescription?.toLowerCase().includes('open-source') || s.shortDescription?.toLowerCase().includes('open source');
    const hasOverview = s.fullOverview?.toLowerCase().includes('open-source') || s.fullOverview?.toLowerCase().includes('open source');
    const hasCert = s.security?.certifications?.some((c) => c.toLowerCase().includes('open source'));
    return isModel || hasTag || hasDesc || hasOverview || hasCert;
  });
}

export function getExtensionsSoftware(): SoftwareItem[] {
  return SOFTWARE_LISTINGS.filter(s => {
    if (!s.published) return false;
    return s.itemType === 'extension' || s.platforms?.some(p => ['Chrome', 'Firefox', 'Edge'].includes(p));
  });
}

export function getPluginsSoftware(): SoftwareItem[] {
  return SOFTWARE_LISTINGS.filter(s => {
    if (!s.published) return false;
    return s.itemType === 'plugin' || s.platforms?.some(p => ['MCP', 'Claude', 'ChatGPT'].includes(p));
  });
}

export function getSoftwareBySlug(slug: string): SoftwareItem | undefined {
  return SOFTWARE_LISTINGS.find(s => s.slug === slug);
}

export function getSoftwareById(id: string): SoftwareItem | undefined {
  return SOFTWARE_LISTINGS.find(s => s.id === id);
}

export function getSoftwareByCategory(categorySlug: string): SoftwareItem[] {
  return SOFTWARE_LISTINGS.filter(s => 
    s.published && (s.primaryCategory === categorySlug || s.secondaryCategories.includes(categorySlug))
  );
}

export function getAllCategories(): Category[] {
  return CATEGORIES;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find(c => c.slug === slug);
}

export function getPillars() {
  return PILLARS;
}

export function getAllComparisons(): ComparisonItem[] {
  return COMPARISONS;
}

export function getComparisonBySlug(slug: string): ComparisonItem | undefined {
  return COMPARISONS.find(c => c.slug === slug);
}

export function getAllAlternatives(): AlternativeItem[] {
  return ALTERNATIVES;
}

export function getAlternativeBySlug(slug: string): AlternativeItem | undefined {
  return ALTERNATIVES.find(a => a.slug === slug);
}

export function getAllBestCollections(): BestCollection[] {
  return BEST_COLLECTIONS;
}

export function getBestCollectionBySlug(slug: string): BestCollection | undefined {
  return BEST_COLLECTIONS.find(b => b.slug === slug);
}

export function getAllArticles(): Article[] {
  return ARTICLES;
}

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find(a => a.slug === slug);
}

export function getAllFormats(): FileFormatDoc[] {
  return FILE_FORMATS;
}

export function getFormatBySlug(slug: string): FileFormatDoc | undefined {
  return FILE_FORMATS.find(f => f.slug === slug);
}

export function getSubmissions(): Submission[] {
  return INITIAL_SUBMISSIONS;
}

export function searchDatabase(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) {
    return {
      software: [],
      categories: [],
      comparisons: [],
      articles: []
    };
  }

  const software = SOFTWARE_LISTINGS.filter(s =>
    s.published && (
      s.name.toLowerCase().includes(q) ||
      s.shortDescription.toLowerCase().includes(q) ||
      s.keyFeatures.some(f => f.toLowerCase().includes(q)) ||
      s.bestFitUseCases.some(u => u.toLowerCase().includes(q)) ||
      s.primaryCategory.toLowerCase().includes(q)
    )
  );

  const categories = CATEGORIES.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.description.toLowerCase().includes(q) ||
    c.pillar.toLowerCase().includes(q)
  );

  const comparisons = COMPARISONS.filter(c =>
    c.title.toLowerCase().includes(q) ||
    c.summary.toLowerCase().includes(q)
  );

  const articles = ARTICLES.filter(a =>
    a.title.toLowerCase().includes(q) ||
    a.summary.toLowerCase().includes(q) ||
    a.content.toLowerCase().includes(q)
  );

  return { software, categories, comparisons, articles };
}
