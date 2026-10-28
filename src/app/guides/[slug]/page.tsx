import { notFound, redirect } from 'next/navigation';
import { Metadata } from 'next';
import { getArticleBySlug, getAllArticles } from '@/lib/data';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: 'Article Not Found' };

  return {
    title: `${article.title} | SecureTools.live`,
    description: article.summary,
    alternates: {
      canonical: `https://securetools.live/blog/${article.slug}`,
    },
  };
}

export default async function GuideDetailPage({ params }: PageProps) {
  const { slug } = await params;
  
  if (slug === 'setting-up-vdr-seed-series-a-diligence') {
    redirect('/blog/setting-up-virtual-data-room-seed-series-a-due-diligence');
  }

  const article = getArticleBySlug(slug);
  if (article) {
    redirect(`/blog/${article.slug}`);
  }
  
  notFound();
}
