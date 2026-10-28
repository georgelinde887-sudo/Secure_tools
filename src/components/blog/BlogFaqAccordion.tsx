'use client';

import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

export interface FaqItem {
  q: string;
  a: string;
}

interface BlogFaqAccordionProps {
  items: FaqItem[];
  defaultOpenIndex?: number;
}

export function BlogFaqAccordion({ items, defaultOpenIndex = 0 }: BlogFaqAccordionProps) {
  const [openIndices, setOpenIndices] = useState<number[]>(
    defaultOpenIndex >= 0 ? [defaultOpenIndex] : []
  );

  const toggleItem = (idx: number) => {
    setOpenIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="border-t border-[#e4e4e7] divide-y divide-[#e4e4e7]">
      {items.map((item, idx) => {
        const isOpen = openIndices.includes(idx);
        return (
          <div key={idx} className="transition-colors">
            <button
              type="button"
              onClick={() => toggleItem(idx)}
              className="w-full py-4 sm:py-5 flex items-center justify-between gap-4 text-left group cursor-pointer focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className="font-semibold text-[15px] sm:text-[16px] text-[#09090b] group-hover:text-[#2563eb] transition-colors leading-snug">
                {item.q}
              </span>
              <span className="shrink-0 p-1 rounded-md text-[#71717a] group-hover:text-[#09090b] transition-colors">
                {isOpen ? (
                  <X className="w-4 h-4 stroke-[2]" />
                ) : (
                  <Plus className="w-4 h-4 stroke-[2]" />
                )}
              </span>
            </button>
            {isOpen && (
              <div className="pb-5 pt-0 text-[14px] sm:text-[14.5px] text-[#52525b] leading-relaxed">
                <p>{item.a}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
