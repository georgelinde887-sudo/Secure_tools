import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Folder01Icon, ArrowRight01Icon } from 'hugeicons-react';
import { getCategoryBySlug, getSoftwareByCategory, getAllCategories, fetchCategoriesFromDb, fetchSoftwareByCategoryFromDb } from '@/lib/data';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { SoftwareCard } from '@/components/SoftwareCard';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const categories = await fetchCategoriesFromDb();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await fetchCategoriesFromDb();
  const cat = categories.find(c => c.slug === slug) || getCategoryBySlug(slug);
  if (!cat) return { title: 'Category Not Found' };

  return {
    title: `${cat.name} Software & Tools (2026 Directory) | SecureTools.live`,
    description: cat.description,
    alternates: {
      canonical: `https://securetools.live/categories/${cat.slug}`,
    }
  };
}

export default async function CategoryDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const categories = await fetchCategoriesFromDb();
  const category = categories.find(c => c.slug === slug) || getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const tools = await fetchSoftwareByCategoryFromDb(category.slug);
  const siblingCategories = categories.filter(
    c => c.pillar === category.pillar && c.slug !== category.slug
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1100px] mx-auto">
      <Breadcrumbs
        items={[
          { label: 'Categories', href: '/categories' },
          { label: category.name }
        ]}
      />

      {/* Blueprint Hero */}
      <div className="blueprint-card p-6 mb-8 border border-[#e4e4e7] rounded-xl bg-white shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-lg bg-[#f4f4f5] text-[#09090b] flex items-center justify-center shrink-0 border border-[#e4e4e7]">
            <Folder01Icon size={22} className="text-[#02ccc1]" />
          </div>
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[#71717a] mb-1">
              <span>{category.pillar}</span>
              <span className="text-[#d4d4d8]">•</span>
              <span>Category Taxonomy</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#09090b]">
              {category.name}
            </h1>
            <p className="text-[13px] text-[#71717a] max-w-2xl mt-1.5 leading-relaxed">
              {category.description}
            </p>
          </div>
        </div>
      </div>

            {/* Verified Software Section (Clean 2-card layout without squishing sidebar) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#e4e4e7] pb-3">
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#09090b] font-semibold">
            Verified Software ({tools.length})
          </span>
          <Link
            href="/"
            className="text-[12px] sm:text-[13px] font-medium text-[#09090b] hover:text-black hover:underline flex items-center gap-1.5 transition-colors cursor-pointer"
            style={{ fontFamily: "var(--font-geist-sans), Geist, -apple-system, sans-serif" }}
          >
            <span>All Tools Directory</span>
            <ArrowRight01Icon size={13} className="text-[#09090b]" />
          </Link>
        </div>

        {tools.length === 0 ? (
          <div className="pt-4 pb-12 px-4 text-center flex flex-col items-center justify-center bg-transparent text-[13px] text-[#71717a]">
            <div className="w-[150px] sm:w-[170px] aspect-[255/241] mb-3 flex items-center justify-center overflow-hidden">
              <Image
                src="/animations/05-browser-scan.gif"
                alt="No tools listed"
                width={170}
                height={160}
                unoptimized
                className="w-full h-full object-contain"
              />
            </div>
            <p className="font-semibold text-[#09090b] mb-1">No verified tools currently listed</p>
            <p className="text-[12px] text-[#71717a] mb-4">Our editorial research team is currently auditing products in this category.</p>
            <Link href="/submit" className="font-mono text-[11px] text-[#02ccc1] underline">
              Submit a tool for editorial evaluation &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tools.map((tool) => (
              <SoftwareCard key={tool.id} software={tool} />
            ))}
          </div>
        )}
      </div>

      {/* Related Categories: Dedicated section at the bottom in separate clean boxes */}
      {siblingCategories.length > 0 && (
        <div className="pt-6 border-t border-[#e4e4e7]">
          <div className="flex items-center gap-2 mb-4">
            <Folder01Icon size={16} className="text-[#02ccc1]" />
            <h3 className="font-mono text-[11px] uppercase tracking-wider text-[#09090b] font-semibold">
              Related in {category.pillar}
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {siblingCategories.map((sib) => (
              <Link
                key={sib.id}
                href={'/categories/' + sib.slug}
                className="p-4 rounded-xl border border-[#e4e4e7] bg-white hover:border-[#d4d4d8] hover:-translate-y-0.5 hover:shadow-xs transition-all duration-150 flex items-center justify-between group cursor-pointer"
              >
                <div className="min-w-0 pr-2">
                  <h4
                    className="text-[13px] font-semibold text-[#09090b] transition-colors truncate"
                    style={{ fontFamily: "var(--font-geist-sans), Geist, -apple-system, sans-serif" }}
                  >
                    {sib.name}
                  </h4>
                  <p className="text-[11.5px] text-[#71717a] mt-0.5 truncate">
                    Explore verified tools
                  </p>
                </div>
                <span className="font-mono text-[10.5px] font-medium text-[#71717a] bg-[#f4f4f5] px-2 py-0.5 rounded shrink-0 group-hover:bg-[#e4e4e7] group-hover:text-[#09090b] transition-colors">
                  {sib.toolCount}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
