'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';
import { MobileFloatingSponsor } from './MobileFloatingSponsor';
import { Footer } from '../Footer';
import { SearchModal } from '../SearchModal';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleOpenSearch = () => setIsSearchOpen(true);
    const handleCloseSearch = () => setIsSearchOpen(false);

    window.addEventListener('open-search-modal', handleOpenSearch);
    window.addEventListener('close-search-modal', handleCloseSearch);

    return () => {
      window.removeEventListener('open-search-modal', handleOpenSearch);
      window.removeEventListener('close-search-modal', handleCloseSearch);
    };
  }, []);

  // Strict layout isolation for Internal System Administration (/ism)
  // Absolutely no public LeftSidebar, Right Sponsorship Rail, Header, or Footer
  if (pathname?.startsWith('/ism')) {
    return (
      <div className="min-h-screen w-full bg-[#fafafa] text-[#09090b]">
        {children}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#fafafa]" suppressHydrationWarning>
      {/* 57px Minimal Header */}
      <Header
        onToggleDesktopSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
        onToggleMobileSidebar={() => setIsMobileOpen((prev) => !prev)}
        isSidebarCollapsed={isSidebarCollapsed}
      />

      {/* 3-Column Body Architecture */}
      <div className="flex flex-1 flex-col lg:flex-row min-w-0">
        {/* Left Sidebar (228px / 56px) */}
        <LeftSidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          isMobileOpen={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
        />

        {/* Center Main Content (Flexible width) */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 py-6 overflow-x-hidden bg-[#fafafa]">
          {children}
        </main>

        {/* Right Sponsorship Rail (250px on desktop) */}
        <RightSidebar />

        {/* Bottom Floating Sponsorship Banner (Mobile & Tablet) */}
        <MobileFloatingSponsor />
      </div>

      {/* Global Full-Width Footer */}
      <Footer />

      {/* Global Command Palette Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
