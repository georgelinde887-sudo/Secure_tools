"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  ArrowRight, 
  Puzzle, 
  Plug, 
  FileText, 
  Scale, 
  Shield, 
  Lightbulb,
  Folder,
  Users,
  Key,
  PenTool,
  Lock,
  Cpu,
  Share2,
  Cloud,
  FolderCheck,
  FileCheck,
  Layers,
  Server,
  Briefcase,
  ShieldCheck,
  Eye,
  HardDrive
} from "lucide-react";

export interface HeroBannerCard {
  title: string;
  subtitle: string;
  href: string;
  icon: React.ReactNode;
}

export interface HeroBannerProps {
  badgeText?: string;
  title?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  cards?: HeroBannerCard[];
  dynamicCardSets?: HeroBannerCard[][];
}

const ROUTE_DEFAULTS: Record<
  string,
  { badgeText?: string; title: string; description: string; ctaText: string; ctaHref: string }
> = {
  "/": {
    title: "Make your product easier to find.",
    description:
      "The right tools aren't always easy to discover. Give your product a dedicated place where people can explore what it does, understand its value, and decide if it's right for them.",
    ctaText: "List Your Software",
    ctaHref: "/submit",
  },
  "/dashboard": {
    title: "Get discovered. Get trusted. Get cited by LLMs.",
    description:
      "The right tools aren't always easy to discover. Give your product a dedicated place where buyers, enterprises, and AI search engines can explore what it does, evaluate its value, and adopt it.",
    ctaText: "List Your Software",
    ctaHref: "/submit",
  },
  "/tools": {
    title: "Make your product easier to find.",
    description:
      "The right tools aren't always easy to discover. Give your product a dedicated place where people can explore what it does, understand its value, and decide if it's right for them.",
    ctaText: "List Your Software",
    ctaHref: "/submit",
  },
  "/open-source": {
    title: "Find open-source tools you can trust.",
    description:
      "Discover open-source software for privacy, security, and everyday workflows. Explore projects, review their source code, and choose tools that give you more control.",
    ctaText: "List Your Software",
    ctaHref: "/submit",
  },
  "/extensions": {
    title: "Discover extensions worth installing.",
    description:
      "Find browser extensions that protect your privacy, improve productivity, and make everyday browsing easier. Explore useful add-ons for the way you work online.",
    ctaText: "List Your Software",
    ctaHref: "/submit",
  },
  "/plugins": {
    title: "Discover tools that extend your AI.",
    description:
      "Explore MCP servers and plugins that connect AI assistants to apps, data, and everyday workflows. Find integrations that help your AI tools do more.",
    ctaText: "List Your Software",
    ctaHref: "/submit",
  },
  "/blog": {
    title: "Explore smarter ways to use software.",
    description:
      "Read practical guides, software comparisons, and security tips to help you choose better tools, protect your files, and work more confidently online.",
    ctaText: "Explore Articles",
    ctaHref: "#articles",
  },
  "/guides": {
    title: "Explore smarter ways to use software.",
    description:
      "Read practical guides, software comparisons, and security tips to help you choose better tools, protect your files, and work more confidently online.",
    ctaText: "Explore Articles",
    ctaHref: "#articles",
  },
  "/categories": {
    badgeText: "24 SPECIALIZED SECTORS",
    title: "Software Categories",
    description:
      "Explore a structured directory covering the entire digital file lifecycle across 8 architectural pillars and 24 specialized sectors.",
    ctaText: "Browse Categories",
    ctaHref: "#categories-list",
  },
};

const CATEGORIES_CARD_SETS: HeroBannerCard[][] = [
  // Set 1: Core Taxonomy Pillars (Initial Hero state from Screenshot)
  [
    {
      title: "File Sharing & Transfer",
      subtitle: "6 categories",
      href: "#pillar-file-sharing-transfer",
      icon: <Folder className="w-4 h-4 text-[#09090b] shrink-0" strokeWidth={1.8} />,
    },
    {
      title: "Storage & Backup",
      subtitle: "5 categories",
      href: "#pillar-cloud-storage-backup",
      icon: <Shield className="w-4 h-4 text-[#09090b] shrink-0" strokeWidth={1.8} />,
    },
    {
      title: "Document & PDF Tools",
      subtitle: "4 categories",
      href: "#pillar-document-management",
      icon: <FileText className="w-4 h-4 text-[#09090b] shrink-0" strokeWidth={1.8} />,
    },
    {
      title: "Collaboration & Security",
      subtitle: "10 categories",
      href: "#pillar-security-compliance",
      icon: <Users className="w-4 h-4 text-[#09090b] shrink-0" strokeWidth={1.8} />,
    },
  ],
  // Set 2: Core File & Storage Solutions
  [
    {
      title: "Secure File Sharing",
      subtitle: "14 verified tools",
      href: "/categories/secure-file-sharing",
      icon: <Share2 className="w-4 h-4 text-[#09090b] shrink-0" strokeWidth={1.8} />,
    },
    {
      title: "Encrypted Cloud Storage",
      subtitle: "15 verified tools",
      href: "/categories/encrypted-cloud-storage",
      icon: <Cloud className="w-4 h-4 text-[#09090b] shrink-0" strokeWidth={1.8} />,
    },
    {
      title: "Business File Sharing",
      subtitle: "18 verified tools",
      href: "/categories/business-file-sharing",
      icon: <Briefcase className="w-4 h-4 text-[#09090b] shrink-0" strokeWidth={1.8} />,
    },
    {
      title: "Business Cloud Storage",
      subtitle: "20 verified tools",
      href: "/categories/business-cloud-storage",
      icon: <Server className="w-4 h-4 text-[#09090b] shrink-0" strokeWidth={1.8} />,
    },
  ],
  // Set 3: Enterprise & Transactions
  [
    {
      title: "Virtual Data Rooms",
      subtitle: "12 verified tools",
      href: "/categories/virtual-data-rooms",
      icon: <Key className="w-4 h-4 text-[#09090b] shrink-0" strokeWidth={1.8} />,
    },
    {
      title: "Electronic Signatures",
      subtitle: "13 verified tools",
      href: "/categories/electronic-signatures",
      icon: <PenTool className="w-4 h-4 text-[#09090b] shrink-0" strokeWidth={1.8} />,
    },
    {
      title: "Due Diligence Software",
      subtitle: "8 verified tools",
      href: "/categories/due-diligence-software",
      icon: <Layers className="w-4 h-4 text-[#09090b] shrink-0" strokeWidth={1.8} />,
    },
    {
      title: "Contract Management",
      subtitle: "10 verified tools",
      href: "/categories/contract-management",
      icon: <FileCheck className="w-4 h-4 text-[#09090b] shrink-0" strokeWidth={1.8} />,
    },
  ],
  // Set 4: Security & Document Control
  [
    {
      title: "Document DRM Protection",
      subtitle: "7 verified tools",
      href: "/categories/digital-rights-management",
      icon: <Lock className="w-4 h-4 text-[#09090b] shrink-0" strokeWidth={1.8} />,
    },
    {
      title: "File & Disk Encryption",
      subtitle: "11 verified tools",
      href: "/categories/file-encryption",
      icon: <ShieldCheck className="w-4 h-4 text-[#09090b] shrink-0" strokeWidth={1.8} />,
    },
    {
      title: "Document Audit Trails",
      subtitle: "9 verified tools",
      href: "/categories/document-audit-trails",
      icon: <Eye className="w-4 h-4 text-[#09090b] shrink-0" strokeWidth={1.8} />,
    },
    {
      title: "PDF Security & Redaction",
      subtitle: "7 verified tools",
      href: "/categories/pdf-security",
      icon: <Shield className="w-4 h-4 text-[#09090b] shrink-0" strokeWidth={1.8} />,
    },
  ],
  // Set 5: Portals, Transfer & Backup
  [
    {
      title: "Client File Portals",
      subtitle: "12 verified tools",
      href: "/categories/client-file-portals",
      icon: <FolderCheck className="w-4 h-4 text-[#09090b] shrink-0" strokeWidth={1.8} />,
    },
    {
      title: "Large File Transfer",
      subtitle: "11 verified tools",
      href: "/categories/large-file-transfer",
      icon: <Share2 className="w-4 h-4 text-[#09090b] shrink-0" strokeWidth={1.8} />,
    },
    {
      title: "Managed File Transfer",
      subtitle: "8 verified tools",
      href: "/categories/managed-file-transfer",
      icon: <Server className="w-4 h-4 text-[#09090b] shrink-0" strokeWidth={1.8} />,
    },
    {
      title: "Cloud Backup & Recovery",
      subtitle: "10 verified tools",
      href: "/categories/cloud-backup",
      icon: <HardDrive className="w-4 h-4 text-[#09090b] shrink-0" strokeWidth={1.8} />,
    },
  ],
  // Set 6: Intelligence & Document Systems
  [
    {
      title: "Document Management",
      subtitle: "16 verified tools",
      href: "/categories/document-management-systems",
      icon: <Folder className="w-4 h-4 text-[#09090b] shrink-0" strokeWidth={1.8} />,
    },
    {
      title: "Document Collaboration",
      subtitle: "14 verified tools",
      href: "/categories/document-collaboration",
      icon: <Users className="w-4 h-4 text-[#09090b] shrink-0" strokeWidth={1.8} />,
    },
    {
      title: "Intelligent Doc Processing",
      subtitle: "8 verified tools",
      href: "/categories/intelligent-document-processing",
      icon: <Cpu className="w-4 h-4 text-[#09090b] shrink-0" strokeWidth={1.8} />,
    },
    {
      title: "PDF Editors & Tools",
      subtitle: "15 verified tools",
      href: "/categories/pdf-editors",
      icon: <FileText className="w-4 h-4 text-[#09090b] shrink-0" strokeWidth={1.8} />,
    },
  ],
];

export function HeroBanner({
  badgeText: propBadgeText,
  title: propTitle,
  description: propDescription,
  ctaText: propCtaText,
  ctaHref: propCtaHref,
  cards: propCards,
  dynamicCardSets,
}: HeroBannerProps = {}) {
  const pathname = usePathname();
  const currentDefaults = ROUTE_DEFAULTS[pathname] || ROUTE_DEFAULTS["/"];

  const badgeText = propBadgeText ?? currentDefaults.badgeText;
  const title = propTitle ?? currentDefaults.title;
  const description = propDescription ?? currentDefaults.description;
  const ctaText = propCtaText ?? currentDefaults.ctaText;
  const ctaHref = propCtaHref ?? currentDefaults.ctaHref;

  const isCardActive = (href: string) => {
    if (href === "/" && (pathname === "/" || pathname === "/tools" || pathname === "/dashboard")) return true;
    if (href !== "/" && !href.includes("#") && pathname?.startsWith(href)) return true;
    return false;
  };

  const isBlogRoute = pathname === "/blog" || pathname === "/guides" || pathname?.startsWith("/blog") || pathname?.startsWith("/guides");
  const isCategoriesRoute = pathname === "/categories" || pathname?.startsWith("/categories");

  // Determine dynamic rotating card sets
  const cardSets = useMemo(() => {
    if (dynamicCardSets) return dynamicCardSets;
    if (isCategoriesRoute) return CATEGORIES_CARD_SETS;
    return null;
  }, [dynamicCardSets, isCategoriesRoute]);

  const [activeSetIndex, setActiveSetIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  // Dynamic automatic card rotation
  useEffect(() => {
    if (!cardSets || cardSets.length <= 1) return;

    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setActiveSetIndex((prev) => (prev + 1) % cardSets.length);
        setIsFading(false);
      }, 350);
    }, 3800);

    return () => clearInterval(interval);
  }, [cardSets]);

  const cards = useMemo(() => {
    if (propCards) return propCards;
    if (cardSets) return cardSets[activeSetIndex];

    if (isBlogRoute) {
      return [
        {
          title: "How-to Guides",
          subtitle: "Learn step by step",
          href: "/blog?category=How-to#articles",
          icon: <FileText className="w-4 h-4 text-[#09090b] shrink-0" strokeWidth={1.8} />,
        },
        {
          title: "Software Comparisons",
          subtitle: "Find the right tools",
          href: "/compare",
          icon: <Scale className="w-4 h-4 text-[#09090b] shrink-0" strokeWidth={1.8} />,
        },
        {
          title: "Security & Privacy",
          subtitle: "Keep your data safer",
          href: "/blog?category=Document+Security#articles",
          icon: <Shield className="w-4 h-4 text-[#09090b] shrink-0" strokeWidth={1.8} />,
        },
        {
          title: "Tips & Tutorials",
          subtitle: "Simple, practical advice",
          href: "/blog?category=Fundraising#articles",
          icon: <Lightbulb className="w-4 h-4 text-[#09090b] shrink-0" strokeWidth={1.8} />,
        },
      ];
    }

    return [
      {
        title: "Software",
        subtitle: "Web & Desktop Apps",
        href: "/",
        icon: (
          <svg
            className="w-4 h-4 text-[#09090b] shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="14" x="3" y="5" rx="2" />
            <path d="M3 9h18" />
            <path d="M7 7h.01" />
          </svg>
        ),
      },
      {
        title: "Open Source",
        subtitle: "Transparent & Secure",
        href: "/open-source",
        icon: (
          <svg
            className="w-4 h-4 text-[#09090b] shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8 4H6a2 2 0 0 0-2 2v3a2 2 0 0 1-2 2 2 2 0 0 1 2 2v3a2 2 0 0 0 2 2h2" />
            <path d="M16 4h2a2 2 0 0 1 2 2v3a2 2 0 0 0 2 2 2 2 0 0 0-2 2v3a2 2 0 0 1-2 2h-2" />
            <circle cx="9.5" cy="12" r="0.75" fill="currentColor" />
            <circle cx="12" cy="12" r="0.75" fill="currentColor" />
            <circle cx="14.5" cy="12" r="0.75" fill="currentColor" />
          </svg>
        ),
      },
      {
        title: "Extensions",
        subtitle: "Browser Add-ons",
        href: "/extensions",
        icon: <Puzzle className="w-4 h-4 text-[#09090b] shrink-0" strokeWidth={1.8} />,
      },
      {
        title: "MCP & Plugins",
        subtitle: "AI & Productivity",
        href: "/plugins",
        icon: <Plug className="w-4 h-4 text-[#09090b] shrink-0" strokeWidth={1.8} />,
      },
    ];
  }, [isBlogRoute, cardSets, activeSetIndex, propCards]);

  // Draggable logo position (offset from default resting spot)
  const [logoOffset, setLogoOffset] = useState({ x: 0, y: 0 });
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const logoDragStartRef = useRef({ clientX: 0, clientY: 0, startX: 0, startY: 0 });

  // Draggable cards positions (offsets for each of the 4 cards)
  const [cardOffsets, setCardOffsets] = useState<Array<{ x: number; y: number }>>([
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ]);
  const [draggingCardIndex, setDraggingCardIndex] = useState<number | null>(null);
  const cardDragStartRef = useRef({
    clientX: 0,
    clientY: 0,
    startX: 0,
    startY: 0,
    distance: 0,
  });

  const stageRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // Dynamic SVG path calculations
  const [paths, setPaths] = useState<string[]>([]);
  const [dots, setDots] = useState<{ x: number; y: number }[]>([]);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);

  const updateCurves = useCallback(() => {
    if (!stageRef.current || !logoRef.current) return;
    const stageRect = stageRef.current.getBoundingClientRect();
    const logoRect = logoRef.current.getBoundingClientRect();

    // The connector curves emerge from the right edge of the "S" logo, centered vertically
    const startX = logoRect.right - stageRect.left;
    const startY = logoRect.top - stageRect.top + logoRect.height / 2;

    // Dynamically query each card element's live bounding rect
    const targets = cards.map((_, i) => {
      const cardEl = cardRefs.current[i];
      if (cardEl) {
        const rect = cardEl.getBoundingClientRect();
        return {
          x: rect.left - stageRect.left,
          y: rect.top - stageRect.top + rect.height / 2,
        };
      }
      return { x: 175, y: 27 + i * 52 };
    });

    const newPaths = targets.map((t) => {
      const dx = t.x - startX;
      const cp1x = startX + Math.max(16, dx * 0.45);
      const cp1y = startY;
      const cp2x = t.x - Math.max(16, dx * 0.45);
      const cp2y = t.y;
      return `M ${startX},${startY} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${t.x},${t.y}`;
    });

    setStartPoint({ x: startX, y: startY });
    setDots(targets);
    setPaths(newPaths);
  }, [cards]);

  useEffect(() => {
    updateCurves();
    const ro = new ResizeObserver(() => updateCurves());
    if (stageRef.current) ro.observe(stageRef.current);
    window.addEventListener("resize", updateCurves);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateCurves);
    };
  }, [updateCurves, logoOffset, cardOffsets, activeSetIndex]);

  // Pointer drag logic for Logo
  const handleLogoPointerDown = (e: React.PointerEvent) => {
    setIsDraggingLogo(true);
    logoDragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      startX: logoOffset.x,
      startY: logoOffset.y,
    };
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
  };

  const handleLogoPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingLogo) return;
    const deltaX = e.clientX - logoDragStartRef.current.clientX;
    const deltaY = e.clientY - logoDragStartRef.current.clientY;

    const boundedX = Math.max(-120, Math.min(100, logoDragStartRef.current.startX + deltaX));
    const boundedY = Math.max(-60, Math.min(60, logoDragStartRef.current.startY + deltaY));

    setLogoOffset({ x: boundedX, y: boundedY });
  };

  const handleLogoPointerUp = (e: React.PointerEvent) => {
    setIsDraggingLogo(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  const handleLogoDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLogoOffset({ x: 0, y: 0 });
  };

  // Pointer drag logic for individual Cards
  const handleCardPointerDown = (index: number, e: React.PointerEvent<HTMLAnchorElement>) => {
    setDraggingCardIndex(index);
    cardDragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      startX: cardOffsets[index]?.x || 0,
      startY: cardOffsets[index]?.y || 0,
      distance: 0,
    };
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
  };

  const handleCardPointerMove = (index: number, e: React.PointerEvent<HTMLAnchorElement>) => {
    if (draggingCardIndex !== index) return;
    const deltaX = e.clientX - cardDragStartRef.current.clientX;
    const deltaY = e.clientY - cardDragStartRef.current.clientY;
    cardDragStartRef.current.distance = Math.hypot(deltaX, deltaY);

    const boundedX = Math.max(-140, Math.min(100, cardDragStartRef.current.startX + deltaX));
    const boundedY = Math.max(-70, Math.min(70, cardDragStartRef.current.startY + deltaY));

    setCardOffsets((prev) => {
      const next = [...prev];
      next[index] = { x: boundedX, y: boundedY };
      return next;
    });
  };

  const handleCardPointerUp = (index: number, e: React.PointerEvent<HTMLAnchorElement>) => {
    if (draggingCardIndex !== index) return;
    setDraggingCardIndex(null);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  const handleCardClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (cardDragStartRef.current.distance > 5) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleCardDoubleClick = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCardOffsets((prev) => {
      const next = [...prev];
      next[index] = { x: 0, y: 0 };
      return next;
    });
  };

  const handleResetAll = () => {
    setLogoOffset({ x: 0, y: 0 });
    setCardOffsets([
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
    ]);
  };

  return (
    <div
      className="hero-banner w-full rounded-[22px] border border-[#e4e4e7] bg-white p-5 sm:p-6 lg:py-6 lg:px-8 shadow-xs overflow-hidden"
      style={{ fontFamily: 'var(--font-geist-sans), "Geist", -apple-system, sans-serif' }}
      suppressHydrationWarning
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-8">
        {/* Left Side: Badge, Headline, Description & Royal Blue CTA Button */}
        <div className="flex-1 min-w-0 max-w-[560px] lg:max-w-[620px]">
          {badgeText && (
            <div className="flex items-center gap-2 mb-2 font-mono text-[11px] sm:text-[11.5px] uppercase tracking-wider text-[#71717a]">
              <svg className="w-3.5 h-3.5 text-[#1c63ed] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
                <path d="m22 12.5-8.58 3.91a2 2 0 0 1-1.66 0L2 12.5" />
                <path d="m22 17.5-8.58 3.91a2 2 0 0 1-1.66 0L2 17.5" />
              </svg>
              <span>{badgeText}</span>
            </div>
          )}

          <h1
            className="text-[25px] sm:text-[28px] lg:text-[31px] font-semibold text-[#09090b] tracking-[-0.03em] leading-[1.18]"
            style={{ fontFamily: 'var(--font-geist-sans), "Geist", sans-serif', fontWeight: 600 }}
          >
            {title}
          </h1>

          <p
            className="text-[13px] sm:text-[13.5px] text-[#71717a] leading-relaxed mt-2.5 sm:mt-3 font-normal"
            style={{ fontFamily: 'var(--font-geist-sans), "Geist", sans-serif', fontWeight: 400 }}
          >
            {description}
          </p>

          <div className="mt-4 sm:mt-5">
            <Link
              href={ctaHref}
              role="button"
              className="inline-flex items-center gap-2.5 px-4.5 py-2 sm:px-5 sm:py-2.5 rounded-[14px] bg-[#1c63ed] hover:bg-[#1554cc] active:bg-[#1247b5] text-white font-medium text-[13px] sm:text-[13.5px] tracking-tight transition-all duration-150 shadow-xs cursor-pointer group"
              style={{ fontFamily: 'var(--font-geist-sans), "Geist", sans-serif', fontWeight: 500 }}
            >
              <span>{ctaText}</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.2] group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Right Side: Interactive Draggable "S" Logo + Dynamic Branching Connectors + Draggable 4 Cards */}
        <div className="flex items-center justify-center lg:justify-end shrink-0 pt-2 lg:pt-0">
          <div
            ref={stageRef}
            onDoubleClick={handleResetAll}
            title="Interactive Stage: Drag the logo or any card! Double click background to reset all."
            className="relative flex items-center justify-end w-[320px] sm:w-[350px] lg:w-[370px] h-[210px] select-none"
          >
            {/* Dynamic SVG Connector Curves */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
              xmlns="http://www.w3.org/2000/svg"
            >
              {paths.length > 0 ? (
                <>
                  {paths.map((d, i) => {
                    const isTargetActive = cards[i] && isCardActive(cards[i].href);
                    return (
                      <path
                        key={i}
                        d={d}
                        stroke={isTargetActive ? "#1c63ed" : "#cbd5e1"}
                        strokeWidth={isTargetActive ? "1.8" : "1.5"}
                        fill="none"
                        strokeLinecap="round"
                      />
                    );
                  })}
                  {/* Origin connector dot at the right of the S logo */}
                  {startPoint && (
                    <circle
                      cx={startPoint.x}
                      cy={startPoint.y}
                      r="2.8"
                      fill="#1c63ed"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                  )}
                  {/* Target connector dots at each card edge */}
                  {dots.map((dot, i) => {
                    const isTargetActive = cards[i] && isCardActive(cards[i].href);
                    return (
                      <circle
                        key={i}
                        cx={dot.x}
                        cy={dot.y}
                        r={isTargetActive ? "3" : "2.4"}
                        fill={isTargetActive ? "#1c63ed" : "#94a3b8"}
                        stroke="#ffffff"
                        strokeWidth={isTargetActive ? "1.2" : "1"}
                      />
                    );
                  })}
                </>
              ) : null}
            </svg>

            {/* Draggable Logo */}
            <div
              ref={logoRef}
              onPointerDown={handleLogoPointerDown}
              onPointerMove={handleLogoPointerMove}
              onPointerUp={handleLogoPointerUp}
              onPointerCancel={handleLogoPointerUp}
              onDoubleClick={handleLogoDoubleClick}
              style={{
                transform: `translate(${logoOffset.x}px, ${logoOffset.y}px)`,
                touchAction: "none",
              }}
              title="SecureTools Logo (Drag to move, double-click to reset)"
              className={`absolute left-0 sm:left-1 lg:left-2 z-20 w-[120px] sm:w-[130px] lg:w-[140px] h-[45px] sm:h-[50px] flex items-center justify-center select-none cursor-grab active:cursor-grabbing transition-transform ${
                isDraggingLogo ? "scale-105 drop-shadow-md z-30" : "hover:scale-102"
              }`}
            >
              <Image
                src="/securetools-logo.png"
                alt="SecureTools Logo"
                width={140}
                height={35}
                priority
                draggable={false}
                className="w-full h-auto object-contain pointer-events-none select-none"
                unoptimized
              />
            </div>

            {/* 4 Draggable / Adjustable Cards Stack */}
            <div className="relative z-20 flex flex-col gap-2.5 shrink-0">
              {cards.map((card, i) => {
                const active = isCardActive(card.href);
                const offset = cardOffsets[i] || { x: 0, y: 0 };
                const isThisDragging = draggingCardIndex === i;

                return (
                  <Link
                    key={`${card.title}-${i}`}
                    ref={(el) => {
                      cardRefs.current[i] = el;
                    }}
                    href={card.href}
                    onPointerDown={(e) => handleCardPointerDown(i, e)}
                    onPointerMove={(e) => handleCardPointerMove(i, e)}
                    onPointerUp={(e) => handleCardPointerUp(i, e)}
                    onPointerCancel={(e) => handleCardPointerUp(i, e)}
                    onClick={handleCardClick}
                    onDoubleClick={(e) => handleCardDoubleClick(i, e)}
                    style={{
                      transform: `translate(${offset.x}px, ${offset.y}px)`,
                      touchAction: "none",
                    }}
                    title={`${card.title} (Drag to adjust, double-click to reset)`}
                    className={`w-[150px] sm:w-[160px] lg:w-[175px] h-[42px] rounded-[13px] border px-3 flex items-center gap-2.5 select-none cursor-grab transition-all duration-150 ${
                      isThisDragging
                        ? "cursor-grabbing scale-105 drop-shadow-md z-30"
                        : "hover:scale-[1.02] transition-transform duration-100 z-20"
                    } ${
                      active
                        ? "border-[#1c63ed] bg-[#1c63ed] text-white shadow-xs"
                        : "border-[#e4e4e7] bg-white hover:border-[#a1a1aa] shadow-2xs"
                    }`}
                  >
                    <div
                      className={`shrink-0 pointer-events-none transition-all duration-300 transform ${
                        isFading ? "opacity-0 scale-90" : "opacity-100 scale-100"
                      } ${active ? "text-white [&_svg]:text-white [&_svg]:stroke-white" : "text-[#09090b]"}`}
                    >
                      {card.icon}
                    </div>
                    <div
                      className={`min-w-0 pointer-events-none transition-all duration-300 transform ${
                        isFading ? "opacity-0 -translate-y-1" : "opacity-100 translate-y-0"
                      }`}
                    >
                      <div
                        className={`text-[12.5px] sm:text-[13px] tracking-tight leading-none truncate ${
                          active ? "font-bold text-white" : "font-semibold text-[#09090b]"
                        }`}
                        style={{ fontFamily: 'var(--font-geist-sans), "Geist", sans-serif' }}
                      >
                        {card.title}
                      </div>
                      <div
                        className={`text-[10px] sm:text-[10.5px] font-normal leading-none mt-1 truncate ${
                          active ? "text-white/85" : "text-[#71717a]"
                        }`}
                        style={{ fontFamily: 'var(--font-geist-sans), "Geist", sans-serif' }}
                      >
                        {card.subtitle}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
