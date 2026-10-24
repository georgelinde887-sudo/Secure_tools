import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  Award01Icon, 
  ArrowRight01Icon, 
  ArrowUpRight01Icon, 
  CheckmarkCircle02Icon
} from 'hugeicons-react';
import { getBestCollectionBySlug, getAllBestCollections, getSoftwareById } from '@/lib/data';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { withUtm } from '@/lib/logo-utils';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const collections = getAllBestCollections();
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const col = getBestCollectionBySlug(slug);
  if (!col) return { title: 'Collection Not Found' };

  return {
    title: `${col.title} | SecureTools.live`,
    description: col.subtitle,
    alternates: {
      canonical: `https://securetools.live/best/${col.slug}`,
    }
  };
}

export default async function BestCollectionDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const col = getBestCollectionBySlug(slug);

  if (!col) {
    notFound();
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1100px] mx-auto">
      <Breadcrumbs
        items={[
          { label: 'Best Collections', href: '/best' },
          { label: col.title }
        ]}
      />

      {/* Blueprint Header */}
      <div className="blueprint-card p-6 mb-8 border border-[#e4e4e7] rounded-xl bg-white shadow-xs">
        <div className="flex items-center gap-2 mb-2 font-mono text-[11px] uppercase tracking-wider text-[#71717a]">
          <Award01Icon size={14} className="text-[#2563eb]" />
          <span>Editorial Guide</span>
          <span className="text-[#d4d4d8]">•</span>
          <span>Updated {col.lastUpdated}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#09090b] mb-2">
          {col.title}
        </h1>
        <p className="text-[13px] text-[#71717a] max-w-2xl leading-relaxed">
          {col.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Methodology & Criteria */}
          <section className="bg-white rounded-xl border border-[#e4e4e7] p-5 shadow-xs">
            <h2 className="text-[14px] font-bold text-[#09090b] mb-2">
              Selection Methodology & Evaluation Criteria
            </h2>
            <p className="text-[12px] text-[#71717a] leading-relaxed mb-4">
              {col.selectionMethodology}
            </p>

            <div className="space-y-2">
              {col.evaluationCriteria.map((crit, idx) => (
                <div key={idx} className="flex items-start gap-2 text-[12px] text-[#09090b] p-2.5 bg-[#fafafa] rounded-lg border border-[#e4e4e7]">
                  <CheckmarkCircle02Icon size={14} className="text-[#2563eb] shrink-0 mt-0.5" />
                  <span>{crit}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Ranked Evaluations */}
          <section className="space-y-4">
            <h2 className="text-[14px] font-bold text-[#09090b] uppercase tracking-wider font-mono">
              Top Ranked Solutions
            </h2>

            {col.rankings.map((rank, idx) => {
              const tool = getSoftwareById(rank.toolId);
              if (!tool) return null;

              return (
                <div key={idx} className="bg-white rounded-xl border border-[#e4e4e7] p-5 shadow-xs hover:border-[#122368] transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold text-[#2563eb] bg-[#f4f4f5] px-2 py-0.5 rounded border border-[#e4e4e7]">
                      <Award01Icon size={12} />
                      {rank.awardBadge}
                    </span>
                    <span className="font-mono text-[11px] text-[#71717a]">Rank #{idx + 1}</span>
                  </div>

                  <div className="flex items-baseline justify-between mb-2">
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="text-[16px] font-bold text-[#09090b] hover:text-[#2563eb]"
                    >
                      {tool.name}
                    </Link>
                    <span className="font-mono text-[11px] text-[#71717a]">
                      {tool.startingPrice || tool.pricingModel}
                    </span>
                  </div>

                  <p className="text-[12px] text-[#71717a] leading-relaxed mb-3.5">
                    {rank.editorialSummary}
                  </p>

                  <div className="p-3 bg-[#fafafa] rounded-lg border border-[#e4e4e7] text-[12px] mb-4">
                    <strong className="text-[#09090b] block mb-0.5 text-[11px] font-mono uppercase tracking-wider">Key Differentiator:</strong>
                    <span className="text-[#71717a]">{rank.keyDifferentiator}</span>
                  </div>

                  <div className="flex items-center justify-end gap-3 text-[12px] pt-3 border-t border-[#f4f4f5]">
                    <a
                      href={withUtm(tool.websiteUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#71717a] hover:text-[#09090b] flex items-center gap-1"
                    >
                      <span>Website</span>
                      <ArrowUpRight01Icon size={12} />
                    </a>
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="text-[#2563eb] font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>Technical Profile</span>
                      <ArrowRight01Icon size={12} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </section>

          {/* Buying Advice */}
          <section className="bg-white rounded-xl border border-[#e4e4e7] p-5 shadow-xs">
            <h2 className="text-[14px] font-bold text-[#09090b] mb-2">
              Buyer Procurement Guidance
            </h2>
            <p className="text-[12px] text-[#71717a] leading-relaxed">
              {col.buyingAdvice}
            </p>
          </section>

        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="bg-white rounded-xl border border-[#e4e4e7] p-4 shadow-xs">
            <h3 className="font-mono text-[11px] uppercase tracking-wider text-[#09090b] font-semibold mb-2">
              Trust & Independence
            </h3>
            <p className="text-[12px] text-[#71717a] leading-relaxed mb-3">
              SecureTools.live does not accept paid placements or sponsored ranking positions. Rankings reflect independent technical assessments.
            </p>
            <div className="font-mono text-[10px] text-[#71717a] pt-2 border-t border-[#f4f4f5]">
              Verified by SecureTools Research Desk
            </div>
          </div>

        </aside>

      </div>
    </div>
  );
}
