'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  Folder01Icon,
  GridIcon,
  CodeIcon,
  PuzzleIcon,
  Plug01Icon,
  ArrowLeftRightIcon,
  Notebook01Icon,
  DollarCircleIcon,
  CloudIcon,
  Share01Icon,
  File01Icon,
  Shield01Icon,
  Pdf01Icon,
  SignatureIcon,
  ArrowUpRight01Icon,
  Key01Icon,
  InformationCircleIcon,
  Cancel01Icon,
  ArrowRight01Icon,
  SidebarLeft01Icon,
} from 'hugeicons-react';

interface LeftSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse?: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

function LeftSidebarInternal({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}: LeftSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const exploreLinks = [
    { name: 'All Tools', href: '/', icon: Folder01Icon },
    { name: 'Categories', href: '/categories', icon: GridIcon },
    { name: 'Open Source', href: '/open-source', icon: CodeIcon },
    { name: 'Extensions', href: '/extensions', icon: PuzzleIcon },
    { name: 'Plugins & MCP', href: '/plugins', icon: Plug01Icon },
    { name: 'Alternatives', href: '/alternatives', icon: ArrowLeftRightIcon },
    { name: 'Pricing', href: '/pricing', icon: DollarCircleIcon },
    { name: 'Blog', href: '/blog', icon: Notebook01Icon },
  ];

  const categoryLinks = [
    { name: 'Cloud Storage', href: '/categories/business-cloud-storage', icon: CloudIcon },
    { name: 'File Sharing', href: '/categories/secure-file-sharing', icon: Share01Icon },
    { name: 'Document Management', href: '/categories/document-management-systems', icon: File01Icon },
    { name: 'Document Security', href: '/categories/pdf-security', icon: Shield01Icon },
    { name: 'PDF & File Tools', href: '/categories/pdf-editors', icon: Pdf01Icon },
    { name: 'E-Signatures', href: '/categories/electronic-signatures', icon: SignatureIcon },
    { name: 'File Transfer', href: '/categories/large-file-transfer', icon: ArrowUpRight01Icon },
    { name: 'Virtual Data Rooms', href: '/categories/virtual-data-rooms', icon: Key01Icon },
  ];

  const contributeLinks = [
    { name: 'About & FAQ', href: '/about', icon: InformationCircleIcon },
  ];

  const renderNavList = (
    title: string,
    links: { name: string; href: string; icon: any }[],
    showCategoryFooter = false,
    forceExpanded = false
  ) => {
    const collapsed = isCollapsed && !forceExpanded;

    return (
      <div className="mb-5 last:mb-2">
        {!collapsed ? (
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717a]">
              {title}
            </span>
            {title === 'Explore' && onToggleCollapse && !forceExpanded && (
              <button
                type="button"
                onClick={onToggleCollapse}
                className="p-1 -mr-1 rounded-md text-[#71717a] hover:text-[#09090b] hover:bg-[#e4e4e7] transition-colors cursor-pointer"
                title="Collapse sidebar"
                aria-label="Collapse sidebar"
              >
                <SidebarLeft01Icon size={14} strokeWidth={1.8} />
              </button>
            )}
          </div>
        ) : (
          title === 'Explore' && onToggleCollapse && (
            <div className="flex justify-center mb-2">
              <button
                type="button"
                onClick={onToggleCollapse}
                className="p-1.5 rounded-md text-[#71717a] hover:text-[#09090b] hover:bg-[#e4e4e7] transition-colors cursor-pointer"
                title="Expand sidebar"
                aria-label="Expand sidebar"
              >
                <SidebarLeft01Icon size={15} strokeWidth={1.8} />
              </button>
            </div>
          )
        )}
        <div className="space-y-0.5">
          {links.map((link) => {
            const currentTab = searchParams ? (searchParams.get('tab') || searchParams.get('filter')) : null;
            let isActive = false;
            if (link.href === '/') {
              isActive = pathname === '/';
            } else if (link.href.includes('?')) {
              const [base, query] = link.href.split('?');
              const targetTab = new URLSearchParams(query).get('tab');
              isActive = pathname === base && currentTab === targetTab;
            } else {
              isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href + '/'));
            }
            const Icon = link.icon;

            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={onCloseMobile}
                title={collapsed ? link.name : undefined}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-colors ${
                  collapsed ? 'justify-center px-2' : ''
                } ${
                  isActive
                    ? 'bg-[#f4f4f5] text-[#09090b] font-semibold'
                    : 'text-[#63636b] hover:text-[#09090b] hover:bg-[#f4f4f5]'
                }`}
              >
                <Icon
                  size={17}
                  strokeWidth={isActive ? 2 : 1.6}
                  className={`shrink-0 ${isActive ? 'text-[#09090b]' : 'text-[#71717a]'}`}
                />
                {!collapsed && (
                  <span className="truncate">{link.name}</span>
                )}
              </Link>
            );
          })}

          {showCategoryFooter && !collapsed && (
            <Link
              href="/categories"
              onClick={onCloseMobile}
              className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold text-[#2563eb] hover:underline mt-1"
            >
              <span>View All Categories</span>
              <ArrowRight01Icon size={12} strokeWidth={2} />
            </Link>
          )}
        </div>
      </div>
    );
  };

  const desktopSidebarContent = (
    <div className="flex flex-col h-full py-4">
      <div className="overflow-y-auto px-2">
        {renderNavList('Explore', exploreLinks, false, false)}
        {renderNavList('Discover by Category', categoryLinks, true, false)}
        {renderNavList('Contribute', contributeLinks, false, false)}
      </div>
    </div>
  );

  const mobileSidebarContent = (
    <div className="flex flex-col h-full py-4">
      <div className="overflow-y-auto px-3">
        {renderNavList('Explore', exploreLinks, false, true)}
        {renderNavList('Discover by Category', categoryLinks, true, true)}
        {renderNavList('Contribute', contributeLinks, false, true)}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Rail (228px expanded, 56px collapsed) */}
      <aside
        className={`hidden lg:block shrink-0 border-r border-[#e4e4e7] bg-[#fafafa] transition-all duration-200 select-none ml-5 left-sidebar-rail ${
          isCollapsed ? 'w-[56px]' : 'w-[228px]'
        }`}
        style={{ height: 'calc(100vh - 57px)', position: 'sticky', top: '57px' }}
      >
        {desktopSidebarContent}
      </aside>

      {/* Mobile Slide-Over Drawer (Always fully expanded with full titles, names & icons) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-200"
            onClick={onCloseMobile}
          />
          <div className="relative w-[280px] sm:w-[320px] max-w-[85vw] h-full bg-white border-r border-[#e4e4e7] shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-250 left-sidebar-rail">
            <div className="h-[57px] flex items-center justify-between px-4 border-b border-[#e4e4e7]">
              <span className="font-bold text-sm text-[#09090b]">Navigation</span>
              <button
                onClick={onCloseMobile}
                className="p-1.5 rounded-lg text-[#71717a] hover:text-[#09090b] hover:bg-[#f4f4f5] transition-colors cursor-pointer"
                aria-label="Close navigation"
              >
                <Cancel01Icon size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {mobileSidebarContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function LeftSidebar(props: LeftSidebarProps) {
  return (
    <Suspense fallback={null}>
      <LeftSidebarInternal {...props} />
    </Suspense>
  );
}
