import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  Clock01Icon, 
  UserIcon, 
  Calendar01Icon, 
  BookOpen01Icon, 
  ArrowUpRight01Icon, 
  ArrowRight01Icon, 
  SecurityCheckIcon 
} from 'hugeicons-react';
import { getArticleBySlug, getAllArticles, getSoftwareById } from '@/lib/data';
import { Breadcrumbs } from '@/components/Breadcrumbs';

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
      canonical: `https://securetools.live/guides/${article.slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.summary,
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author.name],
    }
  };
}

export default async function GuideDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedTools = article.relatedToolIds
    .map(id => getSoftwareById(id))
    .filter(Boolean);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.summary,
    author: {
      '@type': 'Person',
      name: article.author.name,
      jobTitle: article.author.role
    },
    publisher: {
      '@type': 'Organization',
      name: 'SecureTools.live',
      url: 'https://securetools.live'
    },
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    mainEntityOfPage: `https://securetools.live/guides/${article.slug}`
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1100px] mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumbs
        items={[
          { label: 'Guides', href: '/guides' },
          { label: article.title }
        ]}
      />

      {/* Blueprint Article Header */}
      <div className="blueprint-card p-6 sm:p-8 mb-8 border border-[#e4e4e7] rounded-xl bg-white shadow-xs">
        <div className="flex items-center gap-2 mb-2 font-mono text-[11px] uppercase tracking-wider text-[#71717a]">
          <span className="text-[#2563eb] font-semibold">{article.type}</span>
          <span className="text-[#d4d4d8]">•</span>
          <span>{article.pillar}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#09090b] leading-tight mb-3">
          {article.title}
        </h1>

        <p className="text-[14px] text-[#71717a] leading-relaxed mb-5 max-w-3xl">
          {article.summary}
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[#f4f4f5] text-[12px] text-[#71717a]">
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <UserIcon size={14} className="text-[#09090b]" />
            <span className="font-semibold text-[#09090b]">{article.author.name}</span>
            <span className="text-[#71717a]">({article.author.role})</span>
          </div>
          <span className="text-[#d4d4d8]">•</span>
          <div className="flex items-center gap-1 font-mono text-[11px]">
            <Calendar01Icon size={14} />
            <span>Updated {article.updatedAt}</span>
          </div>
          <span className="text-[#d4d4d8]">•</span>
          <div className="flex items-center gap-1 font-mono text-[11px]">
            <Clock01Icon size={14} />
            <span>{article.readTimeMinutes} min read</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Article Body */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Table of Contents */}
          {article.tableOfContents.length > 0 && (
            <div className="bg-white rounded-xl border border-[#e4e4e7] p-5 shadow-xs">
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#09090b] block mb-2.5">
                Table of Contents
              </span>
              <ul className="space-y-1.5 text-[12px] text-[#2563eb]">
                {article.tableOfContents.map((toc, idx) => (
                  <li key={idx}>
                    <a href={`#${toc.id}`} className="hover:underline flex items-center gap-1.5">
                      <span className="font-mono text-[10px] text-[#71717a]">{idx + 1}.</span>
                      <span>{toc.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Article Markdown Rendered Content */}
          <article className="bg-white rounded-xl border border-[#e4e4e7] p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="text-[13px] sm:text-[14px] text-[#09090b] leading-relaxed whitespace-pre-line font-normal">
              {article.content}
            </div>
          </article>

          {/* Source References */}
          {article.sources.length > 0 && (
            <div className="bg-white rounded-xl border border-[#e4e4e7] p-5 shadow-xs">
              <h3 className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#09090b] mb-3 flex items-center gap-1.5">
                <BookOpen01Icon size={14} className="text-[#2563eb]" />
                Documented Citations & Standards
              </h3>
              <div className="space-y-2">
                {article.sources.map((src, idx) => (
                  <a
                    key={idx}
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-lg border border-[#e4e4e7] hover:bg-[#fafafa] text-[12px] text-[#2563eb] font-medium group transition-colors"
                  >
                    <span>{src.title}</span>
                    <ArrowUpRight01Icon size={12} className="text-[#71717a] group-hover:text-[#2563eb]" />
                  </a>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          {relatedTools.length > 0 && (
            <div className="bg-white rounded-xl border border-[#e4e4e7] p-4 shadow-xs">
              <h3 className="font-mono text-[11px] uppercase tracking-wider text-[#09090b] font-semibold mb-3 flex items-center gap-1.5">
                <SecurityCheckIcon size={14} className="text-[#2563eb]" />
                Referenced Tools
              </h3>
              <div className="space-y-2">
                {relatedTools.map((t) => (
                  <Link
                    key={t!.id}
                    href={`/tools/${t!.slug}`}
                    className="block p-2.5 rounded-lg border border-[#e4e4e7] hover:border-[#122368] bg-[#fafafa] hover:bg-white transition-colors"
                  >
                    <div className="font-bold text-[12px] text-[#09090b] mb-0.5">{t!.name}</div>
                    <div className="text-[11px] text-[#71717a] line-clamp-1">{t!.shortDescription}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="blueprint-card p-4 rounded-xl border border-[#e4e4e7] bg-white text-[12px] text-[#71717a]">
            <span className="font-semibold text-[#09090b] block mb-1">Editorial Research Standards</span>
            Our guides are peer-reviewed by practicing cybersecurity and infrastructure engineers.
            <Link href="/editorial-policy" className="text-[#2563eb] font-semibold block mt-2 hover:underline text-[12px] flex items-center gap-1">
              <span>Read Editorial Policy</span>
              <ArrowRight01Icon size={12} />
            </Link>
          </div>
        </aside>

      </div>
    </div>
  );
}
