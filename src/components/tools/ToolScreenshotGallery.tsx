'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X, ExternalLink, Globe } from 'lucide-react';
import { withUtm } from '@/lib/logo-utils';

interface ToolScreenshotGalleryProps {
  toolName: string;
  websiteUrl: string;
  slug?: string;
  screenshots?: string[];
}

export function ToolScreenshotGallery({
  toolName,
  websiteUrl,
  slug,
  screenshots = [],
}: ToolScreenshotGalleryProps) {
  const domain = websiteUrl
    ? websiteUrl.replace(/^https?:\/\//, '').split('/')[0].replace(/^www\./, '')
    : '';

  const cleanSlug =
    slug || toolName.toLowerCase().replace(/[\s_]+/g, '-').replace(/[^\w-]/g, '');

  const supabaseFallback = `https://dpygfnfznubzpnouoafw.supabase.co/storage/v1/object/public/listing-assets/screenshots/${cleanSlug}.png`;
  const localFallback = `/screenshots/${cleanSlug}.png`;

  // Filter out any stale/broken third-party URLs
  const validScreenshots = screenshots.filter(
    (s) => Boolean(s) && !s.includes('thum.io') && !s.includes('placeholder')
  );

  const displayImages =
    validScreenshots.length > 0 ? validScreenshots : [supabaseFallback, localFallback];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  const availableImages = displayImages.filter((_, idx) => !failedImages[idx]);
  const hasMultiple = availableImages.length > 1;

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % availableImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + availableImages.length) % availableImages.length);
  };

  const handleImageError = (index: number) => {
    setFailedImages((prev) => ({ ...prev, [index]: true }));
    if (currentIndex >= availableImages.length - 1) {
      setCurrentIndex(0);
    }
  };

  // If all images fail, show clean branded fallback browser frame
  if (availableImages.length === 0) {
    return (
      <div className="rounded-2xl border border-[#e4e4e7] bg-white overflow-hidden shadow-2xs">
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#fafafa] border-b border-[#e4e4e7]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#fca5a5]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#fde047]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#86efac]" />
          </div>
          <div className="font-mono text-[11px] text-[#71717a] bg-white px-3 py-1 rounded-md border border-[#e4e4e7] flex items-center gap-1.5 shadow-2xs">
            <Globe className="w-3 h-3 text-[#a1a1aa]" />
            <span>{domain ? `https://${domain}` : websiteUrl}</span>
          </div>
          <a
            href={withUtm(websiteUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11.5px] font-medium text-[#71717a] hover:text-[#09090b] flex items-center gap-1"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <div className="p-8 sm:p-12 text-center bg-gradient-to-b from-[#fafafa] to-white flex flex-col items-center justify-center min-h-[260px]">
          <div className="w-12 h-12 rounded-xl bg-white border border-[#e4e4e7] flex items-center justify-center font-bold text-base text-[#09090b] shadow-2xs mb-3">
            {toolName.substring(0, 2).toUpperCase()}
          </div>
          <h3 className="text-sm font-semibold text-[#09090b]">{toolName} Product Interface</h3>
          <p className="text-xs text-[#71717a] mt-1 max-w-sm">
            Visit the official website to explore product tours, interactive workspaces, and enterprise demos.
          </p>
          <a
            href={withUtm(websiteUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 px-4 py-2 rounded-xl bg-[#09090b] hover:bg-[#27272a] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <span>Explore {domain || 'Official Site'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  const currentImage = availableImages[currentIndex] || availableImages[0];

  return (
    <>
      <div className="rounded-2xl border border-[#e4e4e7] bg-white overflow-hidden shadow-2xs group font-geist">
        {/* Browser Top Navigation Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#fafafa] border-b border-[#e4e4e7]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#fca5a5]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#fde047]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#86efac]" />
          </div>

          <div className="font-mono text-[11px] text-[#71717a] bg-white px-3.5 py-1 rounded-md border border-[#e4e4e7] flex items-center gap-1.5 shadow-2xs max-w-xs truncate">
            <Globe className="w-3 h-3 text-[#a1a1aa] shrink-0" />
            <span className="truncate">{domain ? `https://${domain}` : websiteUrl}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLightboxOpen(true)}
              title="Expand Screenshot"
              className="p-1 rounded-md text-[#71717a] hover:text-[#09090b] hover:bg-[#e4e4e7]/60 transition-colors cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <a
              href={withUtm(websiteUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11.5px] font-medium text-[#71717a] hover:text-[#09090b] flex items-center gap-1 transition-colors"
            >
              <span>Visit Site</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Screenshot Viewport Container */}
        <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-[#09090b]/5 overflow-hidden flex items-center justify-center">
          <img
            src={currentImage}
            alt={`${toolName} workspace preview`}
            className="w-full h-full object-cover sm:object-contain transition-transform duration-300"
            onError={() => handleImageError(currentIndex)}
            loading="eager"
          />

          {/* Navigation Controls */}
          {hasMultiple && (
            <>
              <button
                onClick={prevImage}
                aria-label="Previous screenshot"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white border border-[#e4e4e7] text-[#09090b] shadow-md flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs opacity-80 hover:opacity-100"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextImage}
                aria-label="Next screenshot"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white border border-[#e4e4e7] text-[#09090b] shadow-md flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs opacity-80 hover:opacity-100"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Step indicator */}
              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-sm text-white font-mono text-[11px] font-medium shadow-sm">
                {currentIndex + 1} / {availableImages.length}
              </div>
            </>
          )}
        </div>

        {/* Thumbnail Strip (if multiple) */}
        {hasMultiple && (
          <div className="flex items-center gap-2 p-3 bg-[#fafafa] border-t border-[#e4e4e7] overflow-x-auto">
            {availableImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`relative w-16 h-10 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                  idx === currentIndex ? 'border-[#09090b] shadow-xs' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative max-w-5xl w-full max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl border border-[#e4e4e7]">
            <div className="flex items-center justify-between px-4 py-3 bg-[#fafafa] border-b border-[#e4e4e7]">
              <span className="font-semibold text-xs text-[#09090b]">
                {toolName} Preview {hasMultiple ? `(${currentIndex + 1}/${availableImages.length})` : ''}
              </span>
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="w-7 h-7 rounded-lg bg-[#f4f4f5] hover:bg-[#e4e4e7] flex items-center justify-center text-[#71717a] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-2 max-h-[80vh] overflow-auto flex items-center justify-center bg-[#09090b]/5">
              <img
                src={currentImage}
                alt={`${toolName} fullscreen`}
                className="max-w-full max-h-[75vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
