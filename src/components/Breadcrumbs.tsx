import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://securetools.live'
      },
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.label,
        item: item.href ? `https://securetools.live${item.href}` : undefined
      }))
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="flex items-center text-[12px] text-[#71717a] mb-4 overflow-x-auto py-1">
        <Link href="/" className="flex items-center hover:text-[#09090b] transition-colors shrink-0">
          <Home className="w-3.5 h-3.5 mr-1" />
          <span>Home</span>
        </Link>

        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <div key={idx} className="flex items-center shrink-0">
              <ChevronRight className="w-3 h-3 mx-1.5 text-[#a1a1aa]" />
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:text-[#09090b] transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-[#09090b] font-medium truncate max-w-[240px]">
                  {item.label}
                </span>
              )}
            </div>
          );
        })}
      </nav>
    </>
  );
}
