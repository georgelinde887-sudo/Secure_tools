import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  Layers01Icon,
  ArrowRight01Icon,
  Folder01Icon,
  Shield01Icon,
  Building01Icon,
  ArrowUpRight01Icon,
  ServerStack01Icon,
  UserGroupIcon,
  LockIcon,
  CloudIcon,
  FileEditIcon,
  WorkflowCircle01Icon,
  Key01Icon,
  CheckmarkSquare01Icon,
  Pdf01Icon,
  FileZipIcon,
  SignatureIcon,
  Briefcase01Icon,
  EyeIcon,
  CpuIcon,
  ScanIcon,
  Database01Icon,
} from 'hugeicons-react';
import { getAllCategories, getPillars } from '@/lib/data';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { HeroBanner } from '@/components/HeroBanner';

export const metadata: Metadata = {
  title: 'Software Categories Taxonomy | SecureTools.live',
  description: 'Explore the complete category taxonomy covering file sharing, encrypted cloud storage, virtual data rooms, electronic signatures, database security, and PDF protection.',
  alternates: {
    canonical: 'https://securetools.live/categories',
  },
  openGraph: {
    title: 'Software Categories Taxonomy | SecureTools.live',
    description: 'Explore the complete category taxonomy covering file sharing, encrypted cloud storage, virtual data rooms, electronic signatures, database security, and PDF protection.',
    url: 'https://securetools.live/categories',
    images: [{ url: 'https://securetools.live/og-image.png', width: 1200, height: 630 }],
  },
};

function getCategoryIcon(slug: string) {
  switch (slug) {
    // 1. File Sharing & Transfer
    case 'secure-file-sharing':
      return Shield01Icon;
    case 'business-file-sharing':
      return Building01Icon;
    case 'large-file-transfer':
      return ArrowUpRight01Icon;
    case 'managed-file-transfer':
      return ServerStack01Icon;
    case 'sftp-software':
      return ServerStack01Icon;
    case 'client-file-portals':
      return UserGroupIcon;

    // 2. Cloud Storage & Backup
    case 'encrypted-cloud-storage':
      return LockIcon;
    case 'business-cloud-storage':
      return CloudIcon;
    case 'cloud-backup':
      return CloudIcon;

    // 3. Document Management
    case 'document-management-systems':
      return Folder01Icon;
    case 'document-collaboration':
      return FileEditIcon;
    case 'document-workflow':
      return WorkflowCircle01Icon;

    // 4. Virtual Data Rooms
    case 'virtual-data-rooms':
      return Key01Icon;
    case 'due-diligence-software':
      return CheckmarkSquare01Icon;

    // 5. PDF & File Tools
    case 'pdf-editors':
      return Pdf01Icon;
    case 'pdf-security':
      return Shield01Icon;
    case 'file-compression':
      return FileZipIcon;

    // 6. Electronic Signatures
    case 'electronic-signatures':
      return SignatureIcon;
    case 'contract-management':
      return Briefcase01Icon;

    // 7. Security & Compliance
    case 'file-encryption':
      return LockIcon;
    case 'digital-rights-management':
      return Shield01Icon;
    case 'document-audit-trails':
      return EyeIcon;
    case 'database-backend-security':
      return Database01Icon;

    // 8. Document Intelligence
    case 'intelligent-document-processing':
      return CpuIcon;
    case 'document-scanning-ocr':
      return ScanIcon;

    default:
      return Folder01Icon;
  }
}

export default function CategoriesIndexPage() {
  const categories = getAllCategories();
  const pillars = getPillars();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1100px] mx-auto">
      <Breadcrumbs items={[{ label: 'Categories' }]} />

      {/* Hero Banner with Rotating Taxonomy Cards */}
      <div className="mb-8">
        <HeroBanner />
      </div>

      <div id="categories-list" className="scroll-mt-6" />

      <div className="space-y-10">
        {pillars.map((pillar) => {
          const pillarCategories = categories.filter(c => c.pillar === pillar);
          if (pillarCategories.length === 0) return null;

          const pillarId = `pillar-${pillar.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

          return (
            <div key={pillar} id={pillarId} className="border-b border-[#e4e4e7] pb-10 last:border-0 last:pb-0 scroll-mt-6">
              <div className="flex items-baseline justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-[#09090b]">
                    {pillar}
                  </h2>
                  <span className="font-mono text-[11px] text-[#71717a]">
                    ({pillarCategories.length} {pillarCategories.length === 1 ? 'category' : 'categories'})
                  </span>
                </div>
                <span className="font-mono text-[11px] text-[#71717a]">
                  {pillarCategories.reduce((acc, c) => acc + c.toolCount, 0)} verified tools
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {pillarCategories.map((cat) => {
                  const CatIcon = getCategoryIcon(cat.slug);

                  return (
                    <Link
                      key={cat.id}
                      href={`/categories/${cat.slug}`}
                      className="group bg-white p-4.5 rounded-2xl border border-[#e4e4e7] hover:border-[#d4d4d8] hover:-translate-y-0.5 hover:shadow-xs transition-all duration-150 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          {/* Icon Container: border & icon color transition to dark on hover */}
                          <div className="w-9 h-9 rounded-xl border border-[#e4e4e7] bg-white text-[#71717a] flex items-center justify-center group-hover:border-[#09090b] group-hover:text-[#09090b] transition-all">
                            <CatIcon size={18} strokeWidth={1.8} />
                          </div>
                          <span className="font-mono text-[10px] text-[#71717a] bg-[#f4f4f5] px-2 py-0.5 rounded">
                            {cat.toolCount} tools
                          </span>
                        </div>

                        {/* Text stays crisp and unchanged on hover */}
                        <h3 className="text-[14px] font-bold text-[#09090b] mb-1">
                          {cat.name}
                        </h3>
                        <p className="text-[12px] text-[#71717a] leading-relaxed line-clamp-2">
                          {cat.description}
                        </p>
                      </div>

                      <div className="mt-3.5 pt-2.5 border-t border-[#f4f4f5] flex items-center justify-between text-[11px] text-[#71717a]">
                        <span>Explore category</span>
                        <ArrowRight01Icon size={14} className="group-hover:translate-x-0.5 transition-transform text-[#71717a] group-hover:text-[#09090b]" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
