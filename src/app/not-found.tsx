import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="p-4 sm:p-6 lg:p-12 text-center max-w-[560px] mx-auto font-geist">
      <div className="p-8 rounded-2xl border border-[#e4e4e7] bg-white shadow-2xs">
        <div className="w-36 h-36 mx-auto mb-3 flex items-center justify-center">
          <img
            src="/animations/05-browser-scan-transparent.gif"
            alt="Page Not Found"
            className="w-full h-full object-contain"
          />
        </div>
        <span className="font-mono text-[11px] font-bold text-[#71717a] bg-[#f4f4f5] px-2.5 py-0.5 rounded border border-[#e4e4e7]">
          404 ERROR
        </span>
        <h1 className="text-xl sm:text-2xl font-bold text-[#09090b] mt-3 mb-2">
          Page or Profile Not Found
        </h1>
        <p className="text-[13px] text-[#71717a] mb-6 leading-relaxed">
          The requested software profile, category, extension, or comparison could not be located in our directory. It may have been moved, renamed, or is currently under editorial review.
        </p>

        <div className="space-y-2.5">
          <Link
            href="/tools"
            className="w-full py-2.5 px-4 rounded-xl bg-[#09090b] hover:bg-[#27272a] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <span>Browse Software Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/"
            className="w-full py-2.5 px-4 rounded-xl border border-[#e4e4e7] bg-white hover:bg-[#fafafa] text-[#09090b] text-xs font-semibold transition-colors flex items-center justify-center"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
