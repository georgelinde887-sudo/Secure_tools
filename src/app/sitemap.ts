import { MetadataRoute } from 'next';
import {
  getAllSoftware,
  getAllCategories,
  getAllAlternatives,
  getAllBestCollections,
  getAllArticles,
  getAllFormats,
  fetchSoftwareFromDb,
  fetchCategoriesFromDb,
} from '@/lib/data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://securetools.live';
  const now = new Date().toISOString();

  const [allSoftware, allCategories] = await Promise.all([
    fetchSoftwareFromDb(),
    fetchCategoriesFromDb(),
  ]);

  // Core Static Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/tools`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/categories`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/alternatives`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/best`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/guides`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/research`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/formats`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/submit`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/editorial-policy`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/review-methodology`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/corrections`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/disclosure`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
  ];

  // Dynamic Software Profiles
  const softwareRoutes: MetadataRoute.Sitemap = allSoftware.map((tool) => ({
    url: `${baseUrl}/tools/${tool.slug}`,
    lastModified: tool.verifiedDate || now,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  // Dynamic Categories
  const categoryRoutes: MetadataRoute.Sitemap = allCategories.map((cat) => ({
    url: `${baseUrl}/categories/${cat.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));


  // Dynamic Alternatives
  const alternativeRoutes: MetadataRoute.Sitemap = getAllAlternatives().map((alt) => ({
    url: `${baseUrl}/alternatives/${alt.slug}`,
    lastModified: alt.lastUpdated || now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Dynamic Best Collections
  const bestRoutes: MetadataRoute.Sitemap = getAllBestCollections().map((col) => ({
    url: `${baseUrl}/best/${col.slug}`,
    lastModified: col.lastUpdated || now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Dynamic Guides & Articles
  const articleRoutes: MetadataRoute.Sitemap = getAllArticles().map((art) => ({
    url: `${baseUrl}/guides/${art.slug}`,
    lastModified: art.updatedAt || now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Dynamic File Formats
  const formatRoutes: MetadataRoute.Sitemap = getAllFormats().map((fmt) => ({
    url: `${baseUrl}/formats/${fmt.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...softwareRoutes,
    ...categoryRoutes,
    ...alternativeRoutes,
    ...bestRoutes,
    ...articleRoutes,
    ...formatRoutes,
  ];
}
