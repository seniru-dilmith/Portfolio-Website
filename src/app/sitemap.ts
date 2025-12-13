import { MetadataRoute } from 'next';
import { getArticles } from '@/controllers/articleController';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://seniru.dev';

  // Fetch all articles from your DB
  const articles = await getArticles();

  // Generate URLs for each article
  const articleUrls = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: new Date(article.updatedAt || article.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Define your static pages
  const staticRoutes = [
    '',
    '/articles',
    '/projects',
    '/story',
    '/contact',
    '/work-with-me',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.7, // Home page has highest priority
  }));

  // Combine them
  return [...staticRoutes, ...articleUrls];
}