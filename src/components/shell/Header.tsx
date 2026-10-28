'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SidebarLeft01Icon, Menu01Icon } from 'hugeicons-react';

interface HeaderProps {
  onToggleDesktopSidebar?: () => void;
  onToggleMobileSidebar: () => void;
  isSidebarCollapsed?: boolean;
}

export function Header({
  onToggleMobileSidebar,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 h-[57px] w-full bg-white border-b border-[#e4e4e7] flex items-center justify-between pl-5 pr-[10px]" suppressHydrationWarning>
      {/* Left: Brand & Sidebar Toggles */}
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-1.5 rounded-md hover:bg-[#f4f4f5] text-[#71717a] hover:text-[#09090b] transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu01Icon size={18} strokeWidth={1.6} />
        </button>

        {/* Brand Mark (Icon Only) */}
        <Link href="/" className="flex items-center group" aria-label="SecureTools Home">
          <Image
            src="/securetools-hero-logo.png"
            alt="SecureTools Logo"
            width={38}
            height={38}
            className="w-[38px] h-[38px] object-contain rounded-[8px] shadow-2xs hover:opacity-90 transition-opacity"
            priority
          />
        </Link>
      </div>

      {/* Right: Exact AltHunt Header Actions: Dashboard & List Your Software */}
      <div className="flex items-center gap-2.5">
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center h-[36px] px-4 rounded-[10px] bg-white text-[#09090b] font-semibold text-[13.5px] tracking-tight border border-[#e4e4e7] shadow-xs hover:bg-[#f4f4f5] hover:border-[#d4d4d8] transition-all cursor-pointer"
        >
          <span>Dashboard</span>
        </Link>

        {/* Primary Action Button (Reference Royal Blue #1c63ed) */}
        <Link
          href="/submit"
          className="inline-flex items-center justify-center h-[36px] px-4 rounded-[14px] bg-[#1c63ed] hover:bg-[#1554cc] text-white font-medium text-[13.5px] tracking-tight shadow-xs transition-colors cursor-pointer active:translate-y-0"
        >
          <span>List Your Software</span>
        </Link>
      </div>
    </header>
  );
}
