'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  CheckmarkCircle02Icon, 
  AlertCircleIcon, 
  ArrowRight01Icon, 
  Upload01Icon, 
  Delete02Icon, 
  Copy01Icon, 
  PlayIcon, 
  Search01Icon,
  Folder01Icon,
  Shield01Icon,
  Building02Icon,
  ArrowUpRight01Icon,
  ServerStack01Icon,
  UserMultiple02Icon,
  CloudIcon,
  FileEditIcon,
  WorkflowCircle01Icon,
  Key01Icon,
  Pdf01Icon,
  FileZipIcon,
  SignatureIcon,
  Briefcase01Icon,
  EyeIcon
} from 'hugeicons-react';
import { Puzzle, Plug, Globe, ChevronDown, Check, Webhook, Cpu, Code2, ChevronLeft, ChevronRight, X, Terminal, Database, ClipboardPaste, ClipboardCopy } from 'lucide-react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { getAllCategories, getAllSoftware } from '@/lib/data';
import { ListingItemType } from '@/types';
import { doUrlsMatch, checkDuplicateInItems, MatchResult } from '@/lib/url-match';
import confetti from 'canvas-confetti';

const getCategoryIcon = (slug?: string) => {
  if (!slug) return Folder01Icon;
  const s = slug.toLowerCase();
  if (s.includes('compression') || s.includes('archive') || s.includes('zip')) return FileZipIcon;
  if (s.includes('business')) return Building02Icon;
  if (s.includes('portal') || s.includes('client')) return UserMultiple02Icon;
  if (s.includes('mft') || s.includes('server') || s.includes('sftp') || s.includes('ftp')) return ServerStack01Icon;
  if (s.includes('cloud') || s.includes('storage') || s.includes('backup')) return CloudIcon;
  if (s.includes('large-file') || s.includes('fast-transfer')) return ArrowUpRight01Icon;
  if (s.includes('share') || s.includes('transfer')) return Shield01Icon;
  if (s.includes('pdf')) return Pdf01Icon;
  if (s.includes('sign')) return SignatureIcon;
  if (s.includes('security') || s.includes('encrypt')) return Shield01Icon;
  if (s.includes('data-room') || s.includes('vdr') || s.includes('key') || s.includes('due-diligence')) return Key01Icon;
  if (s.includes('workflow')) return WorkflowCircle01Icon;
  if (s.includes('document')) return FileEditIcon;
  if (s.includes('contract')) return Briefcase01Icon;
  if (s.includes('audit') || s.includes('tracking')) return EyeIcon;
  return Folder01Icon;
};

// Icons from Root Page (HeroBanner)
const SoftwareIcon = () => (
  <svg
    className="w-4 h-4 shrink-0"
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
);

const OpenSourceIcon = () => (
  <svg
    className="w-4 h-4 shrink-0"
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
);

const COMMON_BROWSERS = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Brave', 'Opera'];
const BROWSER_FAVICON_DOMAINS: Record<string, string> = {
  Chrome: 'chrome.google.com',
  Firefox: 'firefox.com',
  Safari: 'safari.apple.com',
  Edge: 'microsoft.com',
  Brave: 'brave.com',
  Opera: 'opera.com'
};
const COMMON_AI_PLATFORMS = ['Claude Desktop', 'Cursor', 'Windsurf', 'Claude Code', 'ChatGPT', 'Open-source LLMs', 'LibreChat'];
const AI_PLATFORM_FAVICON_DOMAINS: Record<string, string> = {
  'Claude Desktop': 'claude.ai',
  Cursor: 'cursor.com',
  Windsurf: 'codeium.com',
  'Claude Code': 'anthropic.com',
  ChatGPT: 'chatgpt.com',
  'Open-source LLMs': 'huggingface.co',
  LibreChat: 'librechat.ai'
};

// Comprehensive Major and Minor Open-Source Licenses
const COMMON_LICENSES = [
  'MIT',
  'Apache-2.0',
  'GPL-3.0',
  'AGPL-3.0',
  'LGPL-3.0',
  'LGPL-2.1',
  'BSD-3-Clause',
  'BSD-2-Clause',
  'MPL-2.0',
  'ISC',
  'EUPL-1.2',
  'CC0-1.0',
  'Unlicense',
  'BSL-1.1',
  'SSPL-1.0',
  'Other Open Source'
];

const MCP_PROTOCOLS = [
  { value: 'stdio', label: 'stdio (Local Process CLI)' },
  { value: 'sse', label: 'SSE (Server-Sent Events / HTTP)' },
  { value: 'hybrid', label: 'Hybrid (stdio + SSE)' },
  { value: 'chatgpt-plugin', label: 'ChatGPT Custom GPT / Plugin' }
];

// Curated top platforms for integrations with official domains for Google Favicon API
const POPULAR_INTEGRATIONS = [
  { name: 'Slack', domain: 'slack.com' },
  { name: 'Google Drive', domain: 'drive.google.com' },
  { name: 'Microsoft 365', domain: 'microsoft.com' },
  { name: 'AWS S3', domain: 'aws.amazon.com' },
  { name: 'Salesforce', domain: 'salesforce.com' },
  { name: 'Jira', domain: 'atlassian.com' },
  { name: 'GitHub', domain: 'github.com' },
  { name: 'Zapier', domain: 'zapier.com' },
  { name: 'Notion', domain: 'notion.so' },
  { name: 'Zoom', domain: 'zoom.us' },
  { name: 'HubSpot', domain: 'hubspot.com' },
  { name: 'Box', domain: 'box.com' },
  { name: 'Dropbox', domain: 'dropbox.com' },
  { name: 'Okta', domain: 'okta.com' },
  { name: 'Stripe', domain: 'stripe.com' },
  { name: 'DocuSign', domain: 'docusign.com' },
  { name: 'Linear', domain: 'linear.app' },
  { name: 'Model Context Protocol (MCP)', domain: 'modelcontextprotocol.io' },
  { name: 'Webhooks', domain: 'webhooks.org' },
  { name: 'REST API', domain: 'restfulapi.net' }
];

// Curated Category-specific features (SoftwareAdvice & SoftwareSuggest tick-mark style)
const CATEGORY_POPULAR_FEATURES: Record<string, string[]> = {
  'secure-file-sharing': [
    'Password-Protected Links',
    'Expiring Access Links',
    'End-to-End Encryption',
    'Real-Time Viewing Analytics',
    'Granular Access Control',
    'Document Watermarking',
    'Download Limits & Restrictions',
    'Audit Trail & Access Logs',
    'Custom Branding / CNAME',
    'Recipient Verification'
  ],
  'business-file-sharing': [
    'Team Folders & Permissions',
    'SSO / SAML 2.0 Integration',
    'Centralized Admin Console',
    'Real-Time Activity Audit',
    'Custom Domain & Branding',
    'Role-Based Access Control',
    'Two-Factor Authentication (2FA)',
    'Data Retention Policies'
  ],
  'large-file-transfer': [
    'Fast Transfer Acceleration',
    'Resume Interrupted Uploads',
    'Large File Capacity (100GB+)',
    'Download Expiration Dates',
    'Password Protected Transfers',
    'Delivery & Download Receipts',
    'End-to-End Encryption'
  ],
  'managed-file-transfer': [
    'Automated Batch File Routing',
    'Compliance SLA Monitoring',
    'End-to-End PGP Encryption',
    'High-Availability Failover',
    'Regulatory Audit Logging (HIPAA/SOC2)',
    'Event-Driven Workflow Triggers'
  ],
  'sftp-software': [
    'SSH Key & Certificate Authentication',
    'Bandwidth Throttling Controls',
    'Automated Directory Synchronization',
    'IP Whitelisting & Geo-Fencing',
    'REST API Automation',
    'Granular Session Logging'
  ],
  'client-file-portals': [
    'White-Label Branded Portal',
    'Secure Client File Uploads',
    'Automated File Request Reminders',
    'Real-Time Email Notifications',
    'Custom Domain & SSL',
    'Granular Client Permissions',
    'Direct Document Commenting'
  ],
  'encrypted-cloud-storage': [
    'Zero-Knowledge Client Encryption',
    'Automated Background Sync',
    'File Version History & Rollback',
    'Multi-Platform Desktop & Mobile Sync',
    'Encrypted File Previews',
    'Ransomware Recovery',
    'Cryptographic Key Management',
    'Two-Factor Authentication'
  ],
  'business-cloud-storage': [
    'Centralized User & Group Management',
    'Single Sign-On (SSO / Okta / Azure AD)',
    'Granular Folder Permissions',
    'Comprehensive Audit Logging',
    'Data Loss Prevention (DLP) Policies',
    'Admin Backup & Disaster Recovery'
  ],
  'cloud-backup': [
    'Continuous Automated Backup',
    'Immutable Ransomware Backups',
    'Point-in-Time System Restore',
    'AES-256 Storage Encryption',
    'Bandwidth Throttling & Scheduling',
    'Disaster Recovery Orchestration'
  ],
  'document-management-systems': [
    'Centralized Document Repository',
    'Full-Text OCR Search & Indexing',
    'Version History & Check-In/Check-Out',
    'Metadata & Tagging Hierarchy',
    'Compliance Retention Schedules',
    'Automated Document Approval Routing'
  ],
  'document-collaboration': [
    'Real-Time Multi-User Co-Authoring',
    'Inline Comments & Suggestions',
    'Document Version Tracking',
    'Granular View & Edit Permissions',
    'Slack & Microsoft Teams Alerts',
    'Document Template Library'
  ],
  'document-workflow': [
    'Visual Drag-and-Drop Workflow Builder',
    'Automated Document Routing & Approvals',
    'Conditional Logic & Triggers',
    'Integration with CRM & ERP Systems',
    'Audit Trail of All Document Actions',
    'Deadline Reminders & Escalations'
  ],
  'virtual-data-rooms': [
    'Dynamic Watermarking (Email & IP)',
    'Fence-View Anti-Screen Capture',
    'Detailed Audit Trails & Engagement Heatmaps',
    'Q&A Collaboration Workflows',
    'NDA Gating & Clickwrap Agreements',
    'Granular File-Level DRM & Revocation',
    'Bulk Drag-and-Drop Indexing'
  ],
  'due-diligence-software': [
    'Structured Diligence Checklist & Trackers',
    'Role-Based Investor & Buyer Access',
    'Automated Redaction of PII',
    'Document-Level Engagement Analytics',
    'Exportable Diligence Archive'
  ],
  'pdf-editors': [
    'Direct Text & Image Editing',
    'Page Reordering, Deletion & Merging',
    'Permanent Redaction of Sensitive Info',
    'Interactive Form Field Creator',
    'Document Password Protection',
    'OCR Text Recognition'
  ],
  'pdf-security': [
    'Irreversible Redaction Sanitization',
    'Metadata & Hidden Data Removal',
    'Certificate-Based PDF Encryption',
    'Copy & Print Prevention Controls',
    'Digital Rights Management (DRM)'
  ],
  'file-compression': [
    'High-Ratio Lossless Compression',
    'AES-256 Archive Encryption',
    'Multi-Volume Archive Splitting',
    'Automated CLI Scripting',
    'Support for ZIP, 7Z, TAR, RAR'
  ],
  'electronic-signatures': [
    'Legally Binding e-Signatures (ESIGN/eIDAS)',
    'Sequential & Parallel Signing Order',
    'Court-Admissible Audit Trail Certificate',
    'Reusable Signature Templates',
    'SMS & In-Person Verification',
    'Webhook & API Automation'
  ],
  'contract-lifecycle-management': [
    'Automated Contract Generation',
    'Collaborative Redlining & Negotiations',
    'Milestone & Renewal Alerts',
    'Searchable Central Contract Repository',
    'CRM & ERP Two-Way Sync'
  ],
  'file-disk-encryption': [
    'Full Disk & Volume AES-256 Encryption',
    'Zero-Knowledge Key Architecture',
    'Pre-Boot Authentication',
    'Hardware Security Module (HSM) Integration',
    'Encrypted Virtual Drive Mounting'
  ],
  'document-drm': [
    'Dynamic Screen Watermarking',
    'Remote Document Access Revocation',
    'Expiration by Date or Open Count',
    'Prevent Printing & Copy-Pasting',
    'Detailed Page-by-Page Audit Trail'
  ],
  'document-tracking': [
    'Page-by-Page Viewing Analytics',
    'Time Spent Per Page Heatmaps',
    'Instant Email Alert on Document Open',
    'Download & Print Notifications',
    'Forwarding & Share Tracking'
  ],
  'intelligent-document-processing': [
    'AI Data Extraction from Invoices & Forms',
    'Automated Document Classification',
    'Multi-Language OCR Support',
    'Human-in-the-Loop Verification',
    'ERP & Database Auto-Export'
  ],
  'ocr-scanning': [
    'High-Accuracy Multi-Language OCR',
    'Searchable PDF Output',
    'Automated Deskew & Image Cleaning',
    'Barcode & QR Code Recognition',
    'Batch Document Scanning'
  ]
};

const DEFAULT_SOFTWARE_FEATURES = [
  'End-to-End Encryption',
  'Real-Time Viewing Analytics',
  'Password-Protected Share Links',
  'Expiring Access Links',
  'Granular Access Controls',
  'Dynamic Watermarking',
  'Audit Trail & Activity Logs',
  'Two-Factor Authentication (2FA)',
  'Custom Branding & CNAME',
  'SSO & SAML Integration'
];

const DEFAULT_EXTENSION_FEATURES = [
  'One-Click Browser Toolbar Action',
  'Real-Time Phishing & Tracker Blocker',
  'Client-Side Zero-Knowledge Encryption',
  'Cross-Browser Sync (Chrome, Firefox, Edge)',
  'Context Menu Quick Shortcuts',
  'Zero Data Tracking Policy',
  'Offline Security Operations'
];

const DEFAULT_PLUGIN_FEATURES = [
  'Model Context Protocol (MCP) Standard Support',
  'stdio & SSE Transports',
  'Fine-Grained Prompt & Tool Sandboxing',
  'Multi-Agent Coordination Support',
  'Local Privacy & Secret Key Isolation',
  'Zero Network Leakage Guarantee',
  'Live Streaming Response'
];

// SimpleIcons CDN slugs mapping for 100% reliable SVG vector brand logos
function getSimpleIconSlug(name: string): string | null {
  const lower = name.toLowerCase().trim();
  if (lower.includes('bootstrap')) return 'bootstrap';
  if (lower.includes('maven')) return 'apachemaven';
  if (lower === 'mysql' || lower.includes('mysql')) return 'mysql';
  if (lower.includes('openoffice')) return 'apacheopenoffice';
  if (lower.includes('libreoffice')) return 'libreoffice';
  if (lower === 'eclipse' || lower.includes('eclipse') || lower.includes('eclipselink')) return 'eclipseide';
  if (lower.includes('primefaces') || lower === 'prime') return 'prime';
  if (lower.includes('glassfish')) return 'eclipseide';
  if (lower.includes('jodconverter')) return 'libreoffice';
  if (lower.includes('java ee') || lower.includes('jakarta') || lower.includes('ejb') || lower.includes('faces') || lower.includes('jsf')) return 'openjdk';
  if (lower === 'java' || lower.includes('openjdk') || lower.includes('jdk')) return 'openjdk';
  if (lower.includes('spring') || lower.includes('springboot')) return 'springboot';
  if (lower.includes('docker')) return 'docker';
  if (lower.includes('kubernetes') || lower === 'k8s') return 'kubernetes';
  if (lower.includes('react')) return 'react';
  if (lower.includes('vue')) return 'vuedotjs';
  if (lower.includes('angular')) return 'angular';
  if (lower.includes('svelte')) return 'svelte';
  if (lower.includes('tailwind')) return 'tailwindcss';
  if (lower.includes('node')) return 'nodedotjs';
  if (lower.includes('next.js') || lower === 'nextjs') return 'nextdotjs';
  if (lower.includes('nuxt')) return 'nuxt';
  if (lower.includes('astro')) return 'astro';
  if (lower.includes('vite')) return 'vite';
  if (lower.includes('webpack')) return 'webpack';
  if (lower.includes('python')) return 'python';
  if (lower.includes('golang') || lower === 'go') return 'go';
  if (lower.includes('rust')) return 'rust';
  if (lower.includes('typescript') || lower === 'ts') return 'typescript';
  if (lower.includes('javascript') || lower === 'js') return 'javascript';
  if (lower.includes('php')) return 'php';
  if (lower.includes('laravel')) return 'laravel';
  if (lower.includes('ruby') || lower.includes('rails')) return 'rubyonrails';
  if (lower.includes('.net') || lower.includes('dotnet') || lower.includes('c#')) return 'dotnet';
  if (lower.includes('redis')) return 'redis';
  if (lower.includes('postgres')) return 'postgresql';
  if (lower.includes('mongodb') || lower.includes('mongo')) return 'mongodb';
  if (lower.includes('sqlite')) return 'sqlite';
  if (lower.includes('mariadb')) return 'mariadb';
  if (lower.includes('cassandra')) return 'apachecassandra';
  if (lower.includes('couchdb')) return 'apachecouchdb';
  if (lower.includes('kafka')) return 'apachekafka';
  if (lower.includes('rabbitmq')) return 'rabbitmq';
  if (lower.includes('graphql')) return 'graphql';
  if (lower.includes('apache')) return 'apache';
  if (lower.includes('nginx')) return 'nginx';
  if (lower.includes('github')) return 'github';
  if (lower.includes('gitlab')) return 'gitlab';
  if (lower.includes('bitbucket')) return 'bitbucket';
  if (lower.includes('jira')) return 'jira';
  if (lower.includes('confluence')) return 'confluence';
  if (lower.includes('trello')) return 'trello';
  if (lower.includes('slack')) return 'slack';
  if (lower.includes('discord')) return 'discord';
  if (lower.includes('notion')) return 'notion';
  if (lower.includes('figma')) return 'figma';
  if (lower.includes('postman')) return 'postman';
  if (lower.includes('swagger')) return 'swagger';
  if (lower.includes('stripe')) return 'stripe';
  if (lower.includes('paypal')) return 'paypal';
  if (lower.includes('auth0')) return 'auth0';
  if (lower.includes('okta')) return 'okta';
  if (lower.includes('clerk')) return 'clerk';
  if (lower.includes('keycloak')) return 'keycloak';
  if (lower.includes('supabase')) return 'supabase';
  if (lower.includes('firebase')) return 'firebase';
  if (lower.includes('aws') || lower.includes('amazon')) return 'amazonwebservices';
  if (lower.includes('google cloud') || lower === 'gcp') return 'googlecloud';
  if (lower.includes('azure')) return 'microsoftazure';
  if (lower.includes('cloudflare')) return 'cloudflare';
  if (lower.includes('vercel')) return 'vercel';
  if (lower.includes('sentry')) return 'sentry';
  if (lower.includes('datadog')) return 'datadog';
  if (lower.includes('grafana')) return 'grafana';
  if (lower.includes('prometheus')) return 'prometheus';
  if (lower.includes('terraform')) return 'terraform';
  if (lower.includes('ansible')) return 'ansible';
  if (lower.includes('jenkins')) return 'jenkins';
  if (lower.includes('linux')) return 'linux';
  if (lower.includes('ubuntu')) return 'ubuntu';
  if (lower.includes('debian')) return 'debian';
  return null;
}

// Brand monogram avatar styling for guaranteed fallback
const BRAND_AVATAR_COLORS = [
  'bg-blue-100 text-blue-700 border-blue-200',
  'bg-purple-100 text-purple-700 border-purple-200',
  'bg-emerald-100 text-emerald-700 border-emerald-200',
  'bg-amber-100 text-amber-800 border-amber-200',
  'bg-rose-100 text-rose-700 border-rose-200',
  'bg-cyan-100 text-cyan-800 border-cyan-200',
  'bg-indigo-100 text-indigo-700 border-indigo-200',
  'bg-teal-100 text-teal-800 border-teal-200',
];

function getBrandColorClass(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return BRAND_AVATAR_COLORS[Math.abs(hash) % BRAND_AVATAR_COLORS.length];
}

function getInitials(name: string): string {
  const clean = name.trim().replace(/^[-*•]\s*/, '').replace(/["'`]/g, '');
  const parts = clean.split(/[\s_.-]+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return (clean.slice(0, 2) || clean.slice(0, 1)).toUpperCase();
}

// Dynamic domain resolver for integrations, tools, and alternatives
function resolveDomainForTool(name: string, domain?: string): string {
  if (domain && domain.includes('.') && !domain.endsWith('.com.com')) {
    let clean = domain.trim();
    if (clean.includes('://')) {
      try {
        clean = new URL(clean).hostname;
      } catch {}
    }
    return clean.replace(/^www\./, '');
  }

  const lower = name.toLowerCase().trim();

  // 1. UI Frameworks, CSS & Design
  if (lower.includes('bootstrap')) return 'getbootstrap.com';
  if (lower.includes('tailwind')) return 'tailwindcss.com';
  if (lower.includes('material ui') || lower.includes('mui')) return 'mui.com';
  if (lower.includes('ant design') || lower.includes('antd')) return 'ant.design';
  if (lower.includes('chakra')) return 'chakra-ui.com';
  if (lower.includes('shadcn')) return 'ui.shadcn.com';
  if (lower.includes('radix')) return 'radix-ui.com';

  // 2. Java Ecosystem & Enterprise Frameworks
  if (lower.includes('maven')) return 'maven.apache.org';
  if (lower.includes('glassfish')) return 'glassfish.org';
  if (lower.includes('jodconverter')) return 'jodconverter.org';
  if (lower.includes('openoffice')) return 'openoffice.org';
  if (lower.includes('libreoffice')) return 'libreoffice.org';
  if (lower.includes('primefaces')) return 'primefaces.org';
  if (lower.includes('eclipse') || lower.includes('eclipselink')) return 'eclipse.org';
  if (lower.includes('java ee') || lower.includes('jakarta') || lower.includes('ejb') || lower.includes('faces') || lower.includes('jsf')) return 'jakarta.ee';
  if (lower === 'java' || lower.includes('openjdk') || lower.includes('jdk')) return 'oracle.com';
  if (lower.includes('spring') || lower.includes('springboot')) return 'spring.io';
  if (lower.includes('hibernate')) return 'hibernate.org';
  if (lower.includes('tomcat')) return 'tomcat.apache.org';
  if (lower.includes('jetty')) return 'eclipse.dev/jetty';
  if (lower.includes('wildfly') || lower.includes('jboss')) return 'wildfly.org';
  if (lower.includes('quarkus')) return 'quarkus.io';
  if (lower.includes('gradle')) return 'gradle.org';

  // 3. Web Frameworks & Runtimes
  if (lower.includes('react')) return 'react.dev';
  if (lower.includes('vue')) return 'vuejs.org';
  if (lower.includes('angular')) return 'angular.dev';
  if (lower.includes('svelte')) return 'svelte.dev';
  if (lower.includes('next.js') || lower === 'nextjs') return 'nextjs.org';
  if (lower.includes('nuxt')) return 'nuxt.com';
  if (lower.includes('astro')) return 'astro.build';
  if (lower.includes('vite')) return 'vite.dev';
  if (lower.includes('webpack')) return 'webpack.js.org';
  if (lower.includes('node')) return 'nodejs.org';
  if (lower.includes('deno')) return 'deno.com';
  if (lower.includes('bun')) return 'bun.sh';

  // 4. Cloud, Hosting & Serverless
  if (lower.includes('vercel')) return 'vercel.com';
  if (lower.includes('aws') || lower.includes('amazon') || lower.includes('s3') || lower.includes('dynamodb') || lower.includes('lambda')) return 'aws.amazon.com';
  if (lower.includes('cloudflare') || lower.includes('r2')) return 'cloudflare.com';
  if (lower.includes('supabase')) return 'supabase.com';
  if (lower.includes('firebase')) return 'firebase.google.com';
  if (lower.includes('azure')) return 'azure.microsoft.com';
  if (lower.includes('google cloud') || lower.includes('gcp')) return 'cloud.google.com';
  if (lower.includes('digitalocean')) return 'digitalocean.com';
  if (lower.includes('heroku')) return 'heroku.com';
  if (lower.includes('render')) return 'render.com';
  if (lower.includes('fly.io') || lower === 'fly') return 'fly.io';
  if (lower.includes('railway')) return 'railway.app';
  if (lower.includes('netlify')) return 'netlify.com';

  // 5. Databases & Storage
  if (lower.includes('postgres') || lower.includes('postgresql')) return 'postgresql.org';
  if (lower.includes('mysql')) return 'mysql.com';
  if (lower.includes('redis') || lower.includes('upstash')) return 'redis.io';
  if (lower.includes('tinybird')) return 'tinybird.co';
  if (lower.includes('mongodb') || lower.includes('mongo')) return 'mongodb.com';
  if (lower.includes('sqlite') || lower.includes('turso')) return 'turso.tech';
  if (lower.includes('mariadb')) return 'mariadb.org';
  if (lower.includes('cassandra')) return 'cassandra.apache.org';
  if (lower.includes('couchdb')) return 'couchdb.apache.org';
  if (lower.includes('prisma')) return 'prisma.io';
  if (lower.includes('drizzle')) return 'orm.drizzle.team';

  // 6. Email & Communications
  if (lower.includes('resend')) return 'resend.com';
  if (lower.includes('sendgrid')) return 'sendgrid.com';
  if (lower.includes('postmark')) return 'postmarkapp.com';
  if (lower.includes('mailgun')) return 'mailgun.com';
  if (lower.includes('twilio')) return 'twilio.com';
  if (lower.includes('slack')) return 'slack.com';
  if (lower.includes('discord')) return 'discord.com';
  if (lower.includes('teams')) return 'microsoft.com';
  if (lower.includes('zoom')) return 'zoom.us';

  // 7. Payments, Auth & Identity
  if (lower.includes('stripe')) return 'stripe.com';
  if (lower.includes('paypal')) return 'paypal.com';
  if (lower.includes('okta')) return 'okta.com';
  if (lower.includes('auth0')) return 'auth0.com';
  if (lower.includes('clerk')) return 'clerk.com';
  if (lower.includes('keycloak')) return 'keycloak.org';
  if (lower.includes('nextauth') || lower.includes('auth.js')) return 'authjs.dev';

  // 8. Code, DevOps & Monitoring
  if (lower.includes('github')) return 'github.com';
  if (lower.includes('gitlab')) return 'gitlab.com';
  if (lower.includes('bitbucket')) return 'bitbucket.org';
  if (lower.includes('docker')) return 'docker.com';
  if (lower.includes('kubernetes') || lower.includes('k8s')) return 'kubernetes.io';
  if (lower.includes('terraform')) return 'terraform.io';
  if (lower.includes('ansible')) return 'ansible.com';
  if (lower.includes('jenkins')) return 'jenkins.io';
  if (lower.includes('sentry')) return 'sentry.io';
  if (lower.includes('datadog')) return 'datadoghq.com';
  if (lower.includes('grafana')) return 'grafana.com';
  if (lower.includes('prometheus')) return 'prometheus.io';

  // 9. Productivity, CRM & Design
  if (lower.includes('google drive') || lower.includes('gdrive')) return 'drive.google.com';
  if (lower.includes('microsoft 365') || lower.includes('office 365')) return 'microsoft.com';
  if (lower.includes('salesforce')) return 'salesforce.com';
  if (lower.includes('hubspot')) return 'hubspot.com';
  if (lower.includes('notion')) return 'notion.so';
  if (lower.includes('linear')) return 'linear.app';
  if (lower.includes('jira') || lower.includes('confluence') || lower.includes('trello') || lower.includes('atlassian')) return 'atlassian.com';
  if (lower.includes('asana')) return 'asana.com';
  if (lower.includes('figma')) return 'figma.com';
  if (lower.includes('postman')) return 'postman.com';
  if (lower.includes('docusign')) return 'docusign.com';
  if (lower.includes('dropbox')) return 'dropbox.com';
  if (lower.includes('box') && !lower.includes('mailbox')) return 'box.com';
  if (lower.includes('zapier')) return 'zapier.com';
  if (lower.includes('make.com') || lower === 'make') return 'make.com';

  // 10. AI & LLMs
  if (lower.includes('openai') || lower.includes('gpt')) return 'openai.com';
  if (lower.includes('anthropic') || lower.includes('claude')) return 'anthropic.com';
  if (lower.includes('huggingface') || lower.includes('hugging face')) return 'huggingface.co';
  if (lower.includes('ollama')) return 'ollama.com';
  if (lower.includes('pinecone')) return 'pinecone.io';
  if (lower.includes('weaviate')) return 'weaviate.io';
  if (lower.includes('qdrant')) return 'qdrant.tech';

  // 11. Known Competitors & Security Tools
  if (lower.includes('docsend')) return 'docsend.com';
  if (lower.includes('digify')) return 'digify.com';
  if (lower.includes('tresorit')) return 'tresorit.com';
  if (lower.includes('nextcloud')) return 'nextcloud.com';
  if (lower.includes('owncloud')) return 'owncloud.com';
  if (lower.includes('sharefile')) return 'sharefile.com';
  if (lower.includes('onehub')) return 'onehub.com';
  if (lower.includes('egnyte')) return 'egnyte.com';
  if (lower.includes('securedocs')) return 'securedocs.com';
  if (lower.includes('ideals')) return 'idealsvdr.com';
  if (lower.includes('datasite')) return 'datasite.com';
  if (lower.includes('intralinks')) return 'intralinks.com';
  if (lower.includes('firmex')) return 'firmex.com';
  if (lower.includes('wetransfer')) return 'wetransfer.com';
  if (lower.includes('filemail')) return 'filemail.com';
  if (lower.includes('fromsmash') || lower === 'smash') return 'fromsmash.com';
  if (lower.includes('sendsafely')) return 'sendsafely.com';
  if (lower.includes('kiteworks')) return 'kiteworks.com';
  if (lower.includes('proton')) return 'proton.me';
  if (lower.includes('mega')) return 'mega.io';
  if (lower.includes('pcloud')) return 'pcloud.com';
  if (lower.includes('adobe') || lower.includes('acrobat')) return 'adobe.com';
  if (lower.includes('pandadoc')) return 'pandadoc.com';
  if (lower.includes('signnow')) return 'signnow.com';
  if (lower.includes('hellosign')) return 'hellosign.com';
  if (lower.includes('cryptomator')) return 'cryptomator.org';
  if (lower.includes('veracrypt')) return 'veracrypt.fr';
  if (lower.includes('axcrypt')) return 'axcrypt.net';
  if (lower.includes('nordlocker')) return 'nordlocker.com';

  if (lower.includes('.')) {
    return lower.replace(/^https?:\/\//, '').split('/')[0].replace(/^www\./, '');
  }

  return `${lower.replace(/[^a-z0-9]/g, '')}.com`;
}

// Robust validator for alternatives: ensures only real software products are extracted
const isValidAlternative = (alt: string, currentProductName: string = ''): boolean => {
  if (!alt || typeof alt !== 'string') return false;
  const clean = alt.trim().replace(/^[-*•]\s*/, '').replace(/["'`]/g, '');
  if (clean.length < 2 || clean.length > 35) return false;

  // Real product names are 1 to 3 words
  const words = clean.split(/\s+/);
  if (words.length > 3) return false;

  const lower = clean.toLowerCase();
  const currentLower = (currentProductName || '').toLowerCase().trim();

  // Never allow self as alternative
  if (currentLower && (lower === currentLower || lower.startsWith(currentLower + ' ') || lower.endsWith(' ' + currentLower))) {
    return false;
  }

  // Reject hallucinated phrases, descriptions, generic categories
  const invalidPhrases = [
    'fork', 'compatible', 'alternative', 'competitor', 'similar',
    'solution', 'system', 'sharing', 'platform', 'tool', 'service',
    'open-source', 'document-sharing', 'and more', 'etc', 'various',
    'custom', 'generic', 'none', 'n/a', 'in-house', 'build', 'self-host',
    'proprietary', 'commercial', 'free', 'community'
  ];

  if (invalidPhrases.some(kw => lower.includes(kw))) {
    return false;
  }

  return true;
};

// Reusable Tool / Integration Icon with multi-tier dynamic resolution
function ToolItemIcon({ name, domain, className = 'w-3.5 h-3.5' }: { name: string; domain?: string; className?: string }) {
  const [attempt, setAttempt] = useState(0);
  const lower = name.toLowerCase().trim();
  const lowerDomain = (domain || '').toLowerCase().trim();

  // 1. Direct Icon match for Developer Tools (CLI, API, MCP, Webhooks)
  if (lower.includes('cli') || lower.includes('terminal') || lower.includes('command line') || lower.includes('shell') || lower.includes('console')) {
    return <Terminal className={`${className} text-[#09090b] shrink-0`} strokeWidth={2} />;
  }
  if (lower === 'mcp' || lower.includes('model context protocol') || lowerDomain.includes('modelcontextprotocol')) {
    return <Cpu className={`${className} text-[#09090b] shrink-0`} strokeWidth={2} />;
  }
  if (lower.includes('webhook') || lowerDomain.includes('webhook')) {
    return <Webhook className={`${className} text-[#09090b] shrink-0`} strokeWidth={2} />;
  }
  if (lower === 'api' || lower.includes('rest api') || lower.includes('restful') || lower.includes('graphql') || lower.includes('grpc') || lower.includes('sdk')) {
    return <Code2 className={`${className} text-[#09090b] shrink-0`} strokeWidth={2} />;
  }

  const cleanDomain = resolveDomainForTool(name, domain);
  const simpleSlug = getSimpleIconSlug(name);

  // Candidate sources in prioritized order
  const sources: string[] = [];
  if (simpleSlug) {
    sources.push(`https://cdn.simpleicons.org/${simpleSlug}`);
  }
  sources.push(`https://www.google.com/s2/favicons?domain=${encodeURIComponent(cleanDomain)}&sz=64`);
  sources.push(`https://icons.duckduckgo.com/ip3/${encodeURIComponent(cleanDomain)}.ico`);

  if (attempt >= sources.length) {
    return (
      <span
        title={name}
        className={`${className} rounded-full flex items-center justify-center font-bold text-[8px] uppercase shrink-0 border select-none ${getBrandColorClass(name)}`}
      >
        {getInitials(name)}
      </span>
    );
  }

  return (
    <img
      src={sources[attempt]}
      alt={name}
      className={`${className} rounded-full object-contain shrink-0`}
      onError={() => setAttempt(prev => prev + 1)}
    />
  );
}

export default function SubmitPage() {
  const categories = getAllCategories();
  const allSoftwareCatalog = useMemo(() => getAllSoftware(), []);

  // Active product type
  const [itemType, setItemType] = useState<ListingItemType>('software');

  // URL quick-start & Mega Prompt state
  const [targetUrl, setTargetUrl] = useState('');
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [aiNotice, setAiNotice] = useState<string | null>(null);

  // Logo & Screenshot upload refs
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const screenshotFileInputRef = useRef<HTMLInputElement>(null);

  // Alternatives search auto-suggest state
  const [altSearchQuery, setAltSearchQuery] = useState('');
  const [altDropdownOpen, setAltDropdownOpen] = useState(false);

  // Integrations search auto-suggest state
  const [integrationSearchQuery, setIntegrationSearchQuery] = useState('');
  const [integrationDropdownOpen, setIntegrationDropdownOpen] = useState(false);

  // Screenshot Gallery Lightbox Modal state
  const [previewGalleryIndex, setPreviewGalleryIndex] = useState<number | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    // Essentials
    softwareName: '',
    tagline: '',
    description: '',
    websiteUrl: '',
    primaryCategory: 'secure-file-sharing',

    // Media
    logoUrl: '',
    screenshots: [] as string[],
    videoUrl: '',

    // Software specific
    pricingModel: 'Freemium',
    startingPrice: '',
    pricingUrl: '',
    freeTierAvailable: false,
    freeTrialDays: '',
    pricingPlans: '',
    mainFeatures: '',
    alternatives: [] as Array<{ name: string; domain?: string }>,
    integrations: [] as Array<{ name: string; domain?: string }>,

    // Open Source specific
    repositoryUrl: '',
    sourceCodeLicense: 'MIT',
    projectDocumentationUrl: '',
    openSourceCategory: 'Security & Encryption',
    selfHostingSpecs: '',

    // Extension specific
    extensionStoreUrl: '',
    browserCompatibility: ['Chrome', 'Firefox', 'Edge'] as string[],
    extensionId: '',
    developerName: '',
    extensionCategory: 'Privacy & Security',

    // MCP & Plugin specific
    packageUrl: '',
    mcpPlatforms: ['Claude Desktop', 'Cursor'] as string[],
    mcpProtocol: 'stdio',
    mcpRunCommand: '',
    mcpConfigSnippet: '{\n  "mcpServers": {\n    "my-server": {\n      "command": "npx",\n      "args": ["-y", "@modelcontextprotocol/server-..."]\n    }\n  }\n}',

    // Submitter / Verification
    submitterName: '',
    submitterEmail: '',
    contactPhone: '',
    relationship: 'Founder / Co-Founder',
    agreement: false
  });

  // Keyboard navigation for Screenshot Gallery Modal (Escape, ArrowLeft, ArrowRight)
  useEffect(() => {
    if (previewGalleryIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPreviewGalleryIndex(null);
      } else if (e.key === 'ArrowLeft') {
        setPreviewGalleryIndex(prev => prev !== null ? (prev - 1 + formData.screenshots.length) % formData.screenshots.length : null);
      } else if (e.key === 'ArrowRight') {
        setPreviewGalleryIndex(prev => prev !== null ? (prev + 1) % formData.screenshots.length : null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previewGalleryIndex, formData.screenshots.length]);

  // Check if current user already has an active submission under review
  const [activeExistingListing, setActiveExistingListing] = useState<{ id: string; name: string; submission_status: string } | null>(null);
  const [limitNotification, setLimitNotification] = useState<{ toolName: string; toolId?: string; status?: string; message?: string } | null>(null);

  useEffect(() => {
    fetch('/api/submit')
      .then(res => res.json())
      .then(data => {
        if (data.hasActiveSubmission && data.activeListing) {
          setActiveExistingListing(data.activeListing);
        }
      })
      .catch(() => {});
  }, []);

  const triggerCelebrationConfetti = () => {
    try {
      confetti({
        particleCount: 65,
        angle: 60,
        spread: 70,
        origin: { x: 0, y: 0.7 },
        colors: ['#02ccc1', '#09090b', '#3b82f6', '#10b981', '#f59e0b', '#ec4899']
      });
      confetti({
        particleCount: 65,
        angle: 120,
        spread: 70,
        origin: { x: 1, y: 0.7 },
        colors: ['#02ccc1', '#09090b', '#3b82f6', '#10b981', '#f59e0b', '#ec4899']
      });
      setTimeout(() => {
        confetti({
          particleCount: 90,
          spread: 90,
          origin: { y: 0.55 },
          colors: ['#02ccc1', '#00baa9', '#09090b', '#6366f1', '#14b8a6']
        });
      }, 200);
    } catch {}
  };

  // Structured Pricing Plans Tiers (High Readability) - Empty by default
  const [pricingTiers, setPricingTiers] = useState<Array<{ name: string; price: string; features: string }>>([]);

  const updateTier = (index: number, field: 'name' | 'price' | 'features', val: string) => {
    setPricingTiers(prev => {
      const updated = prev.map((t, i) => i === index ? { ...t, [field]: val } : t);
      const text = updated.map(t => `- ${t.name}: ${t.price}${t.features ? `, ${t.features}` : ''}`).join('\n');
      setFormData(f => ({ ...f, pricingPlans: text }));
      return updated;
    });
  };

  const addTier = () => {
    setPricingTiers(prev => {
      const nextIdx = prev.length + 1;
      const defaultName = nextIdx === 1 ? 'Free Tier' : nextIdx === 2 ? 'Pro Plan' : nextIdx === 3 ? 'Enterprise' : `Tier ${nextIdx}`;
      const defaultPrice = nextIdx === 1 ? '$0/mo' : nextIdx === 2 ? '$12/user/mo' : 'Custom quote';
      const updated = [...prev, { name: defaultName, price: defaultPrice, features: '' }];
      const text = updated.map(t => `- ${t.name}: ${t.price}${t.features ? `, ${t.features}` : ''}`).join('\n');
      setFormData(f => ({ ...f, pricingPlans: text }));
      return updated;
    });
  };

  const removeTier = (index: number) => {
    setPricingTiers(prev => {
      const updated = prev.filter((_, i) => i !== index);
      const text = updated.map(t => `- ${t.name}: ${t.price}${t.features ? `, ${t.features}` : ''}`).join('\n');
      setFormData(f => ({ ...f, pricingPlans: text }));
      return updated;
    });
  };

  // Verified Product Features (SoftwareAdvice & SoftwareSuggest Style)
  const [productFeatures, setProductFeatures] = useState<string[]>([]);

  const updateFeature = (index: number, val: string) => {
    setProductFeatures(prev => {
      const updated = prev.map((f, i) => i === index ? val : f);
      setFormData(f => ({ ...f, mainFeatures: updated.filter(Boolean).join(', ') }));
      return updated;
    });
  };

  const addFeature = (val = '') => {
    setProductFeatures(prev => {
      const updated = [...prev, val];
      setFormData(f => ({ ...f, mainFeatures: updated.filter(Boolean).join(', ') }));
      return updated;
    });
  };

  const removeFeature = (index: number) => {
    setProductFeatures(prev => {
      const updated = prev.filter((_, i) => i !== index);
      setFormData(f => ({ ...f, mainFeatures: updated.filter(Boolean).join(', ') }));
      return updated;
    });
  };

  const toggleSuggestedFeature = (featName: string) => {
    setProductFeatures(prev => {
      const exists = prev.some(f => f.trim().toLowerCase() === featName.trim().toLowerCase());
      let updated: string[];
      if (exists) {
        updated = prev.filter(f => f.trim().toLowerCase() !== featName.trim().toLowerCase());
      } else {
        updated = [...prev, featName];
      }
      setFormData(f => ({ ...f, mainFeatures: updated.filter(Boolean).join(', ') }));
      return updated;
    });
  };

  const activeSuggestedFeatures = useMemo(() => {
    if (itemType === 'extension') return DEFAULT_EXTENSION_FEATURES;
    if (itemType === 'plugin') return DEFAULT_PLUGIN_FEATURES;
    return CATEGORY_POPULAR_FEATURES[formData.primaryCategory] || DEFAULT_SOFTWARE_FEATURES;
  }, [itemType, formData.primaryCategory]);

  // Completion score calculation - strictly starts at 0% until actual user input is provided
  const completionPercentage = useMemo(() => {
    let score = 0;
    const hasName = Boolean(formData.softwareName && formData.softwareName.trim().length > 0);
    const hasUrl = Boolean(
      (formData.websiteUrl && formData.websiteUrl.trim().length > 0) ||
      (targetUrl && targetUrl.trim().length > 0) ||
      (formData.repositoryUrl && formData.repositoryUrl.trim().length > 0) ||
      (formData.extensionStoreUrl && formData.extensionStoreUrl.trim().length > 0) ||
      (formData.packageUrl && formData.packageUrl.trim().length > 0)
    );
    const hasTagline = Boolean(formData.tagline && formData.tagline.trim().length > 0);
    const hasDescription = Boolean(formData.description && formData.description.trim().length > 0);
    const hasLogo = Boolean(formData.logoUrl && formData.logoUrl.trim().length > 0);
    const hasScreenshots = Boolean(formData.screenshots && formData.screenshots.length > 0);
    const hasFeatures = Boolean(
      (productFeatures && productFeatures.length > 0) ||
      (itemType === 'open-source' && formData.repositoryUrl && formData.repositoryUrl.trim().length > 0)
    );
    const hasSubmitter = Boolean(formData.submitterEmail && formData.submitterEmail.trim().length > 0);
    const hasAgreement = Boolean(formData.agreement);

    if (hasName) score += 15;
    if (hasUrl) score += 15;
    if (hasTagline) score += 10;
    if (hasDescription) score += 20;
    if (hasLogo) score += 10;
    if (hasScreenshots) score += 10;
    if (hasFeatures) score += 10;
    if (hasSubmitter) score += 5;
    if (hasAgreement) score += 5;

    return Math.min(100, score);
  }, [formData, targetUrl, productFeatures, itemType]);

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  // Close category dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close category dropdown on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsCategoryOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [categoryMismatchError, setCategoryMismatchError] = useState<{
    title: string;
    message: string;
    suggestedCategory?: string;
    typeLabel: string;
    isNonProduct?: boolean;
    reason?: string;
  } | null>(null);

  useEffect(() => {
    if (!categoryMismatchError) return;
    const timer = setTimeout(() => {
      setCategoryMismatchError(null);
    }, 12000);
    return () => clearTimeout(timer);
  }, [categoryMismatchError]);

  // Real-time duplicate match state
  const [duplicateTargetMatch, setDuplicateTargetMatch] = useState<MatchResult | null>(null);
  const [duplicateWebsiteMatch, setDuplicateWebsiteMatch] = useState<MatchResult | null>(null);
  const [duplicateRepoMatch, setDuplicateRepoMatch] = useState<MatchResult | null>(null);
  const [duplicateExtMatch, setDuplicateExtMatch] = useState<MatchResult | null>(null);
  const [duplicatePkgMatch, setDuplicatePkgMatch] = useState<MatchResult | null>(null);

  const checkUrlDuplicate = async (url: string, setter: (res: MatchResult | null) => void) => {
    const trimmed = (url || '').trim();
    if (!trimmed || trimmed.length < 4) {
      setter(null);
      return;
    }

    // 1. Fast sync local check against all catalog items
    const localMatch = checkDuplicateInItems([trimmed], allSoftwareCatalog);
    if (localMatch) {
      setter(localMatch);
      return;
    }

    // 2. Async check via API against DB listings
    try {
      const res = await fetch(`/api/submit/check-url?url=${encodeURIComponent(trimmed)}`);
      const data = await res.json();
      if (data.isDuplicate) {
        setter(data);
      } else {
        setter(null);
      }
    } catch {
      setter(null);
    }
  };

  // Bogus feature phrases characteristic of blogs, directories, buying guides, and listicles
  const BOGUS_FEATURE_PATTERNS = [
    /\b(vdr\s+)?provider\s+directory\b/i,
    /\bdirectory\b/i,
    /\bcomparison(s)?\b/i,
    /\bguide(s)?\b/i,
    /\bchecklist(s)?\b/i,
    /\breview(s)?\b/i,
    /\bblog\b/i,
    /\barticle(s)?\b/i,
    /\beditorial\b/i,
    /\bbuyer('?s)?\s+guide\b/i,
    /\bbuying\s+guide\b/i,
    /\broundup\b/i,
    /\blisticle\b/i,
    /\bvendor\s+update(s)?\b/i,
    /\bpricing\s+research\b/i,
    /\brecommendation(s)?\b/i,
    /\btop\s+\d+\b/i,
    /\brankings\b/i,
    /\bnews\b/i
  ];

  const isBogusFeature = (feat: string): boolean => {
    if (!feat || typeof feat !== 'string') return true;
    const trimmed = feat.trim();
    if (trimmed.length < 3) return true;
    return BOGUS_FEATURE_PATTERNS.some(pat => pat.test(trimmed));
  };

  // Check if a URL, domain, name, or tagline represents an informational blog or content directory rather than software
  const detectIneligibleContentSite = (urlOrDomain: string, name?: string, tagline?: string, desc?: string): { isIneligible: boolean; reason?: string } => {
    const target = (urlOrDomain || '').toLowerCase();
    const targetName = (name || '').toLowerCase();
    const targetTagline = (tagline || '').toLowerCase();
    const targetDesc = (desc || '').toLowerCase();

    // 1. TLD check (.blog, publication platforms)
    if (
      target.includes('.blog') || 
      target.includes('.wordpress.com') || 
      target.includes('.medium.com') || 
      target.includes('.substack.com') || 
      target.includes('.ghost.io') ||
      target.includes('.blogspot.com')
    ) {
      return {
        isIneligible: true,
        reason: 'Domains under .blog or publication platforms (WordPress, Medium, Substack) are informational content sites, not standalone software products or SaaS platforms.'
      };
    }

    // 2. Domain / path keywords
    if (
      target.includes('vdrdirectory') ||
      target.includes('softwaredirectory') ||
      target.includes('toolsdirectory') ||
      target.includes('reviewdirectory') ||
      target.includes('buyerguide') ||
      target.includes('buyersguide') ||
      target.includes('/blog') ||
      target.includes('/directory') ||
      target.includes('/reviews') ||
      target.includes('/buyers-guide')
    ) {
      return {
        isIneligible: true,
        reason: 'The domain or URL path indicates an informational directory, article collection, or review guide rather than an actual software product.'
      };
    }

    // 3. Name / Tagline indicators
    if (
      targetName.includes('provider directory') ||
      targetName.includes('vdr directory') ||
      targetName.includes('software directory') ||
      targetName.includes('buyer\'s guide') ||
      targetName.includes('buyers guide') ||
      targetName.includes('reviews portal') ||
      targetTagline.includes('directory of') ||
      targetTagline.includes('guide to providers') ||
      targetDesc.includes('directory of providers') ||
      targetDesc.includes('buyer\'s guide for')
    ) {
      return {
        isIneligible: true,
        reason: 'The title or description describes an informational directory, buyer guide, or reviews listing rather than a software tool.'
      };
    }

    return { isIneligible: false };
  };

  // Helper: Google Favicon API
  const getGoogleFavicon = (domainOrUrl?: string) => {
    if (!domainOrUrl) return 'https://www.google.com/s2/favicons?domain=securetools.live&sz=64';
    let clean = domainOrUrl;
    try {
      if (clean.includes('://')) {
        clean = new URL(clean).hostname;
      }
      clean = clean.replace(/^www\./, '');
    } catch {
      clean = domainOrUrl;
    }
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(clean)}&sz=64`;
  };

  // Helper: Video Embed parser (YouTube, Vimeo, Loom, direct video)
  const getVideoEmbedUrl = (url: string) => {
    if (!url) return null;
    const trimmed = url.trim();

    // YouTube: watch?v=ID or youtu.be/ID or embed/ID or shorts/ID
    const ytMatch = trimmed.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
    if (ytMatch && ytMatch[1]) {
      return { type: 'iframe', src: `https://www.youtube.com/embed/${ytMatch[1]}` };
    }

    // Vimeo: vimeo.com/ID
    const vimeoMatch = trimmed.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)/i);
    if (vimeoMatch && vimeoMatch[3]) {
      return { type: 'iframe', src: `https://player.vimeo.com/video/${vimeoMatch[3]}` };
    }

    // Loom: loom.com/share/ID or loom.com/embed/ID
    const loomMatch = trimmed.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/i);
    if (loomMatch && loomMatch[1]) {
      return { type: 'iframe', src: `https://www.loom.com/embed/${loomMatch[1]}` };
    }

    // Direct video file
    if (trimmed.match(/\.(mp4|webm|ogg)$/i)) {
      return { type: 'video', src: trimmed };
    }

    return null;
  };

  const videoEmbed = useMemo(() => getVideoEmbedUrl(formData.videoUrl), [formData.videoUrl]);

  // Dynamic Mega Prompt tailored for active product category format
  const activeUrl = targetUrl.trim() || formData.websiteUrl.trim() || 'https://example.com';
  const categorySlugs = useMemo(() => categories.map(c => c.slug).join(', '), [categories]);

  const megaPrompt = useMemo(() => {
    let typeSpecificIntro = '';
    let typeSpecificSchema = '';

    if (itemType === 'open-source') {
      typeSpecificIntro = `Product Category: OPEN SOURCE PROJECT & REPOSITORY
Focus on: source code repository, OSI license, self-hosting specifications (Docker/k8s), and official documentation. Open source projects are free. Always return "pricingPlans": [].`;
      typeSpecificSchema = `  "repositoryUrl": "Find GitHub / GitLab / Git repository URL",
  "sourceCodeLicense": "MIT | Apache-2.0 | GPL-3.0 | AGPL-3.0 | LGPL-3.0 | BSD-3-Clause | BSD-2-Clause | MPL-2.0 | ISC | EUPL-1.2 | CC0-1.0 | Unlicense | BSL-1.1 | SSPL-1.0",
  "projectDocumentationUrl": "Official documentation URL",
  "selfHostingSpecs": "Docker, Docker Compose, Kubernetes, or self-hosting specs",
  "pricingModel": "Open Source",
  "startingPrice": "Free ($0)",
  "pricingPlans": [],`;
    } else if (itemType === 'extension') {
      typeSpecificIntro = `Product Category: BROWSER EXTENSION / ADD-ON
Focus on: supported browsers (Chrome, Firefox, Safari, Edge, Brave, Opera), web store listing, developer name, and extension ID.
IMPORTANT: Most browser extensions are 100% FREE. If this extension has no paid plans or is free to install, set "pricingModel": "Free", set "startingPrice": "Free ($0)", and return "pricingPlans": [] as an empty array. DO NOT invent or hallucinate fake pricing tiers!`;
      typeSpecificSchema = `  "extensionStoreUrl": "Direct Chrome Web Store or Firefox Add-ons store listing URL",
  "browserCompatibility": ["Chrome", "Firefox", "Edge", "Safari"],
  "extensionId": "Store extension ID or package identifier",
  "developerName": "Verified extension developer or organization name",
  "pricingModel": "Free | Freemium | Paid",
  "startingPrice": "Free ($0)",
  "pricingPlans": [],`;
    } else if (itemType === 'plugin') {
      typeSpecificIntro = `Product Category: MODEL CONTEXT PROTOCOL (MCP) RUNTIME / AI PLUGIN
Focus on: MCP transport protocol (stdio, sse), supported AI clients (Claude Desktop, Cursor, Windsurf, Claude Code, ChatGPT), package URL, and configuration snippet.`;
      typeSpecificSchema = `  "packageUrl": "NPM or GitHub repository URL for the MCP server",
  "mcpProtocol": "stdio | sse | hybrid | chatgpt-plugin",
  "mcpPlatforms": ["Claude Desktop", "Cursor", "Windsurf", "Claude Code", "ChatGPT"],
  "mcpRunCommand": "CLI command e.g. npx -y @modelcontextprotocol/server-name",
  "mcpConfigSnippet": "{\\n  \\"mcpServers\\": {\\n    \\"server-name\\": {\\n      \\"command\\": \\"npx\\",\\n      \\"args\\": [\\"-y\\", \\"@modelcontextprotocol/server-...\\"]\\n    }\\n  }\\n}",
  "pricingModel": "Free | Freemium | Open Source",
  "startingPrice": "Free ($0)",
  "pricingPlans": [],`;
    } else {
      // Default: Software
      typeSpecificIntro = `Product Category: SOFTWARE (WEB & DESKTOP APPS)
Focus on: commercial pricing plans (Free Tier, Pro Plan, Enterprise), security features, and SaaS integrations.`;
      typeSpecificSchema = `  "pricingModel": "Free | Freemium | Paid | Enterprise Quote",
  "startingPrice": "$0 or lowest entry plan e.g. $9/mo",
  "pricingUrl": "${activeUrl.replace(/\/+$/, '')}/pricing",
  "pricingPlans": [
    { "name": "Free / Trial", "price": "$0/mo", "features": "24h trial or free tier, 2 documents, basic tracking" },
    { "name": "Starter / Lite", "price": "$6.25/mo annual / $9/mo monthly", "features": "5 documents, 2 GB storage, 1 user seat, password protection" },
    { "name": "Pro / Business", "price": "$20/mo annual / $43/mo monthly", "features": "300 documents, 50 GB storage, dynamic watermarking, NDA gating, custom domains" },
    { "name": "Enterprise", "price": "Custom quote", "features": "Dedicated encryption keys, custom SLA, audit compliance, SSO" }
  ],`;
    }

    const currentCatSlug = formData.primaryCategory || 'secure-file-sharing';

    return `You are an expert technical software analyst for the SecureTools.live directory.
Analyze the following product website in full detail:
Website URL: ${activeUrl}
${typeSpecificIntro}

Examine its home page, features, pricing page, contact/about page, documentation, and security/compliance specs.
PRICING RULES (CRITICAL ANTI-HALLUCINATION RULE):
- If this product has commercial paid subscription plans or freemium tiers with distinct prices (e.g. Pro, Business), extract them into "pricingPlans".
- CRITICAL: If this is a 100% FREE tool, browser extension, or open-source software with NO paid subscriptions or pricing tiers, set "pricingModel": "Free" (or "Open Source"), set "startingPrice": "Free ($0)", and return "pricingPlans": [] as an EMPTY ARRAY. NEVER invent or hallucinate dummy tiers (such as "Lite $0/mo", "Pro $0/mo", "Business $0/mo") for a free product!

## MANDATORY OUTPUT FORMAT: EXACTLY ONE (1) JSON CODE BLOCK

STRICT OUTPUT RULES:
0. PRODUCT ELIGIBILITY & LEGITIMACY VERIFICATION (CRITICAL):
   SecureTools.live is EXCLUSIVELY a software product discovery directory for functional digital tools:
   - SaaS / Web / Desktop Software Tools
   - Open-Source Software Repositories
   - Browser Extensions
   - MCP Servers, Plugins, & AI Integrations
   It STRICTLY EXCLUDES:
   - Informational blogs, articles, magazines, news, educational guides (e.g. .blog domains, Medium, Substack, tutorial sites)
   - Directories, aggregator portals, review sites, top-10 listicles (e.g. sites listing other vendors, directories of software)
   - Consulting agencies, law firms, brokers, marketing agencies (selling manual human services, not software products)
   - Unrelated consumer industries (e-commerce, food delivery, gaming, dating, real estate, general accounting, crypto casino)
   
   If the website is an actual functional software tool/app/repo/extension/plugin:
     "isEligibleProduct": true,
     "productTypeDetection": "${itemType}",
     "ineligibilityReason": ""
   If the website is an informational blog, directory of vendors, buyer's guide, agency, or non-software:
     "isEligibleProduct": false,
     "productTypeDetection": "ineligible_blog_or_directory",
     "ineligibilityReason": "Explain clearly why this is a blog/directory/informational page and not an actual software application or tool.",
     "features": [],
     "pricingPlans": []

1. SINGLE CODE BLOCK ONLY (NO SPLITTING, DO NOT CLOSE EARLY):
   Output the entire JSON object inside EXACTLY ONE \`\`\`json code block.
   - Line 1 must be: \`\`\`json
   - Line 2 must be the opening brace: {
   - The last line must be the closing: \`\`\`
   - Under NO circumstances should you produce two boxes, split the JSON across multiple blocks, or close the code block early.
   - All fields from "isEligibleProduct" through "contactPhone" must be 100% inside this single block.

2. ZERO TEXT OUTSIDE THE CODE BLOCK:
   Do NOT output ANY greeting, introductory text, commentary, summary, preview, or closing notes before or after the code block.

3. STRICTLY NO WEB SEARCH CITATIONS OR ARROWS:
   - Do NOT include any search citation arrows (e.g. ↗, ↱, ➔) anywhere in the output.
   - Do NOT include citation superscripts or footnote numbers (e.g. [1], [2], [web:1]).
   - Do NOT use markdown links (e.g. [domain](url)).
   - All URLs MUST be plain, clean JSON string literals (e.g. "websiteUrl": "${activeUrl}").

4. VALID JSON SYNTAX:
   - Use double quotes only for all keys and strings.
   - Escape internal newlines inside strings as \\n.
   - No trailing commas.

5. CATEGORY SELECTION & SCOPE MATCH:
   Does this tool directly fit one of the 24 SecureTools directory categories:
   [${categorySlugs}]
   - If YES, select the single best matching category slug for "primaryCategory", and set "categoryMatch": true.
   - If NO (out-of-scope or incompatible industry), set "primaryCategory": "incompatible-category", set "categoryMatch": false, and set "categoryMismatchReason": "Explain why this software does not match any of our 24 secure file sharing, cloud storage, virtual data rooms, document systems, or cybersecurity categories."

6. ALTERNATIVES (REAL COMPETITOR PRODUCT NAMES ONLY):
   Provide ONLY 3 to 5 real, actual competitor commercial or open-source software brand names (e.g. ["DocSend", "Digify", "Tresorit", "Box", "Dropbox Sign"]).
   CRITICAL: NEVER output descriptive phrases, generic categories, or text containing "compatible", "forks", "similar", or "alternatives". Each entry MUST be a single real software product name (1 to 3 words max).

7. INTEGRATIONS:
   Provide real ecosystem services, frameworks, and developer tools (e.g. ["AWS S3", "Vercel Blob", "Slack", "PostgreSQL", "Stripe", "Resend", "Tinybird"]).

8. SEO TITLE (TAGLINE) & SEO META DESCRIPTION (STRICT LENGTH & OPTIMIZATION):
   - "tagline" (SEO Title / Tagline):
     * MUST be SEO-optimized and strictly between 50 to 60 characters in total length (including spaces).
     * Must include primary software capability keywords (e.g. "End-to-End Encrypted Cloud Storage & Secure File Sharing").
     * Do NOT exceed 60 characters and do NOT make it shorter than 50 characters. Zero promotional hype.
   - "description" (SEO Meta Description):
     * MUST be concise, SEO-optimized, and strictly between 150 to 300 characters in total length (including spaces).
     * NEVER write lengthy paragraphs or multi-paragraph essays (STRICT LIMIT: 150-300 characters).
     * Factually summarize: core capability, encryption / security standard (e.g. AES-256, Zero-Knowledge, SOC 2), and target users.

${itemType !== 'open-source' ? `9. KEY FEATURES (SOFTWARE ADVICE & SOFTWARESUGGEST TICK-STYLE - ANTI-BLOG RULE):
   Provide 6 to 10 verified, crisp technical and functional capabilities of the interactive software in the "features" array (e.g. ["Password-Protected Share Links", "Dynamic Watermarking", "Expiring Access Links", "Real-Time Viewing Analytics", "End-to-End Encryption", "Granular Access Permissions"]).
   CRITICAL ANTI-BLOG / ANTI-EDITORIAL RULE:
   NEVER output editorial sections, blog titles, buyer's guides, comparison lists, or directory features (e.g. NEVER output "Provider Directory", "Side-by-Side Comparisons", "Public Vendor Pricing Research", "Security and Compliance Standards Guide", "Buyer's Guide", "Checklists", "Reviews", "Editorial Corrections").
   If the site is an informational blog or directory, leave "features": []!` : ''}

Fill in and return the JSON structure below:

\`\`\`json
{
  "isEligibleProduct": true,
  "productTypeDetection": "${itemType}",
  "ineligibilityReason": "",
  "categoryMatch": true,
  "categoryMismatchReason": "",
  "softwareName": "Official product name",
  "tagline": "SEO title/tagline strictly 50-60 characters with core capability keywords",
  "description": "Concise, SEO-optimized meta description strictly between 150-300 characters covering functionality, security, and target audience.",
  "primaryCategory": "${currentCatSlug}",
  "websiteUrl": "${activeUrl}",
${typeSpecificSchema}
${itemType !== 'open-source' ? `  "features": [
    "Feature 1 (e.g. Password Protected Links)",
    "Feature 2 (e.g. Real-Time Document Analytics)",
    "Feature 3 (e.g. Dynamic Watermarking)",
    "Feature 4 (e.g. Expiring Access Links)",
    "Feature 5 (e.g. Granular Permissions)",
    "Feature 6 (e.g. Audit Trail & Logging)"
  ],` : ''}
  "mainFeatures": "Feature 1, Feature 2, Feature 3, AES-256 encryption, Zero-knowledge architecture, SOC 2 Type II",
  "alternatives": ["DocSend", "Digify", "Tresorit"],
  "integrations": ["AWS S3", "Vercel Blob", "PostgreSQL", "Stripe", "Resend"],
  "contactEmail": "Find official contact or support email from website (e.g. contact@domain, support@domain, hello@domain, info@domain)",
  "contactPhone": "Official phone or support mobile number if published on website, else empty string"
}
\`\`\`

FINAL REMINDER: Return EXACTLY ONE \`\`\`json code block starting with \`\`\`json on line 1 and closing with \`\`\` at the end. Keep all fields inside the block. No citation arrows (no ↗ or [1]), no split boxes, no text outside!`;
  }, [activeUrl, formData.primaryCategory, itemType, categorySlugs]);

  // Copy Mega Prompt to Clipboard with bulletproof fallback
  const handleCopyMegaPrompt = async () => {
    let success = false;
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(megaPrompt);
        success = true;
      } catch (err) {
        console.warn('navigator.clipboard.writeText failed:', err);
      }
    }
    if (!success && typeof document !== 'undefined') {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = megaPrompt;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        textArea.setAttribute('readonly', '');
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        success = document.execCommand('copy');
        document.body.removeChild(textArea);
      } catch (fallbackErr) {
        console.error('execCommand copy fallback failed:', fallbackErr);
      }
    }
    setCopiedPrompt(true);
    setAiNotice('✓ Mega Prompt copied to clipboard! Paste (Cmd+V) into ChatGPT or Claude.');
    setTimeout(() => {
      setCopiedPrompt(false);
      setAiNotice(null);
    }, 4500);
    return success;
  };

  // Open in ChatGPT directly with Mega Prompt preloaded
  const handleOpenChatGPT = async () => {
    await handleCopyMegaPrompt();
    setAiNotice('✓ Mega Prompt loaded & copied! Opening ChatGPT...');
    const targetUrl = `https://chatgpt.com/?q=${encodeURIComponent(megaPrompt)}`;
    window.open(targetUrl, '_blank');
  };

  // Open in Claude directly with Mega Prompt preloaded
  const handleOpenClaude = async () => {
    await handleCopyMegaPrompt();
    setAiNotice('✓ Mega Prompt loaded & copied! Opening Claude...');
    const targetUrl = `https://claude.ai/new?q=${encodeURIComponent(megaPrompt)}`;
    window.open(targetUrl, '_blank');
  };

  // Open in Perplexity directly with Mega Prompt preloaded
  const handleOpenPerplexity = async () => {
    await handleCopyMegaPrompt();
    setAiNotice('✓ Mega Prompt loaded & copied! Opening Perplexity...');
    const targetUrl = `https://www.perplexity.ai/search?q=${encodeURIComponent(megaPrompt)}`;
    window.open(targetUrl, '_blank');
  };

  // Tolerant JSON field extractor (extracts fields even from unclosed, raw, or conversational text)
  const tolerantExtractJson = (text: string): Record<string, any> => {
    const result: Record<string, any> = {};

    const stringFields = [
      'softwareName',
      'tagline',
      'title',
      'description',
      'websiteUrl',
      'primaryCategory',
      'pricingModel',
      'startingPrice',
      'pricingUrl',
      'freeTrialDays',
      'mainFeatures',
      'contactEmail',
      'contactPhone',
      'submitterEmail',
      'phone',
      'email',
      'repositoryUrl',
      'sourceCodeLicense',
      'license',
      'projectDocumentationUrl',
      'documentationUrl',
      'selfHostingSpecs',
      'extensionStoreUrl',
      'developerName',
      'extensionId',
      'packageUrl',
      'mcpProtocol',
      'mcpRunCommand',
      'productTypeDetection',
      'ineligibilityReason',
      'categoryMismatchReason'
    ];

    for (const field of stringFields) {
      try {
        const regex = new RegExp(`["']?${field}["']?\\s*:\\s*["']([^"'\\\\]*(?:\\\\.[^"'\\\\]*)*)["']?`, 'i');
        const match = text.match(regex);
        if (match && match[1]) {
          result[field] = match[1]
            .replace(/\\"/g, '"')
            .replace(/\\n/g, '\n')
            .replace(/[\u2190-\u21FF]/g, '')
            .replace(/\s*↗\s*$/, '')
            .trim();
        }
      } catch (err) {
        console.warn(`Error extracting field ${field}:`, err);
      }
    }

    // Map title fallback to tagline if tagline not provided directly
    if (!result.tagline && result.title) {
      result.tagline = result.title;
    }

    const boolFields = ['isEligibleProduct', 'categoryMatch'];
    for (const field of boolFields) {
      try {
        const regex = new RegExp(`["']?${field}["']?\\s*:\\s*(true|false)`, 'i');
        const match = text.match(regex);
        if (match && match[1]) {
          result[field] = match[1].toLowerCase() === 'true';
        }
      } catch (err) {
        console.warn(`Error extracting bool field ${field}:`, err);
      }
    }

    if (!result.description) {
      const descMatch = text.match(/["']?description["']?\\s*:\\s*["']([\s\S]*?)(?:["']\\s*,\\s*["']|\n\\s*["']|$)/i);
      if (descMatch && descMatch[1]) {
        result.description = descMatch[1].replace(/\\"/g, '"').replace(/["']\\s*,\\s*$/, '').trim();
      }
    }

    const altMatch = text.match(/["']?alternatives["']?\\s*:\\s*\[([\s\S]*?)\]/i);
    if (altMatch && altMatch[1]) {
      const items = altMatch[1].match(/["']([^"']+)["']/g);
      if (items) {
        result.alternatives = items
          .map(s => s.replace(/["']/g, '').trim())
          .filter(s => isValidAlternative(s, result.softwareName));
      }
    }

    const integMatch = text.match(/["']?integrations["']?\\s*:\\s*\[([\s\S]*?)\]/i);
    if (integMatch && integMatch[1]) {
      const items = integMatch[1].match(/["']([^"\']+)["']/g);
      if (items) {
        result.integrations = items.map(s => s.replace(/["']/g, '').trim());
      }
    }

    const browserMatch = text.match(/["']?browserCompatibility["']?\\s*:\\s*\[([\s\S]*?)\]/i);
    if (browserMatch && browserMatch[1]) {
      const items = browserMatch[1].match(/["']([^"\']+)["']/g);
      if (items) {
        result.browserCompatibility = items.map(s => s.replace(/["']/g, '').trim());
      }
    }

    const platformMatch = text.match(/["']?mcpPlatforms["']?\\s*:\\s*\[([\s\S]*?)\]/i);
    if (platformMatch && platformMatch[1]) {
      const items = platformMatch[1].match(/["']([^"\']+)["']/g);
      if (items) {
        result.mcpPlatforms = items.map(s => s.replace(/["']/g, '').trim());
      }
    }

    const pricingMatch = text.match(/["']?pricingPlans["']?\\s*:\\s*\[([\s\S]*?)\]/i);
    let tierText = '';
    if (pricingMatch && pricingMatch[1]) {
      tierText = pricingMatch[1];
    } else {
      const partialPricing = text.match(/["']?pricingPlans["']?\s*:\s*\[([\s\S]*)/i);
      if (partialPricing && partialPricing[1]) {
        tierText = partialPricing[1];
      }
    }
    if (tierText) {
      const tierBlocks = tierText.match(/\{[\s\S]*?\}/g);
      if (tierBlocks) {
        result.pricingPlans = tierBlocks.map(block => {
          const nameM = block.match(/["']?(?:name|planName)["']?\\s*:\\s*["']([^"\']+)["']/i);
          const priceM = block.match(/["']?price["']?\\s*:\\s*["']([^"\']+)["']/i);
          const featM = block.match(/["']?(?:features|description)["']?\\s*:\\s*["']([^"\']+)["']/i);
          return {
            name: nameM ? nameM[1] : 'Plan',
            price: priceM ? priceM[1] : '$0/mo',
            features: featM ? featM[1] : ''
          };
        });
      }
    }

    const featMatch = text.match(/["']?(?:features|keyFeatures|mainFeatures)["']?\s*:\s*\[([\s\S]*?)\]/i);
    let featItems: string[] | null = null;
    if (featMatch && featMatch[1]) {
      featItems = featMatch[1].match(/["']([^"']+)["']/g);
    } else {
      const partialFeat = text.match(/["']?(?:features|keyFeatures)["']?\s*:\s*\[([\s\S]*)/i);
      if (partialFeat && partialFeat[1]) {
        featItems = partialFeat[1].match(/["']([^"']+)["']/g);
      }
    }
    if (featItems) {
      result.features = featItems.map(s => s.replace(/["']/g, '').trim()).filter(Boolean);
    }
    if ((!result.features || result.features.length === 0) && result.mainFeatures) {
      result.features = result.mainFeatures
        .split(/[\n,]+/)
        .map((s: string) => s.replace(/^[-*•✓]\s*/, '').trim())
        .filter(Boolean);
    }

    return result;
  };

  // Robust JSON Extractor & Sanitizer (handles markdown fences, intros, outros, trailing commas, newlines, single quotes, BOM, citations)
  const extractAndParseJson = (input: string): { success: boolean; data?: any; error?: string; prettyJson?: string } => {
    if (!input || !input.trim()) {
      return { success: false, error: 'Please paste the JSON content.' };
    }

    let text = input.trim();

    // 0. Strip BOM, zero-width characters, and search citation arrows / footnote tokens
    text = text
      .replace(/^\uFEFF/, '')
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
      .replace(/[\u2190-\u21FF]/g, '')
      .replace(/\[\d+\]|\[web:\d+\]|\[\^\d+\^\]/gi, '');

    // 1. Replace smart / curly quotes with standard quotes
    text = text
      .replace(/[\u201C\u201D\u201E\u201F\u00AB\u00BB\u2033]/g, '"')
      .replace(/[\u2018\u2019\u201A\u201B\u2032]/g, "'");

    // 2. Strip markdown code fences: ```json, ```JSON, ```plaintext, etc.
    text = text.replace(/```(?:json|JSON|plaintext|text)?\s*/gi, '').replace(/```/g, '');

    // 2b. Strip any leading text before JSON (e.g., "Here is the JSON:")
    const jsonStart = text.indexOf('{');
    if (jsonStart > 0) {
      text = text.substring(jsonStart);
    }

    // Helper to merge fields extracted from full text into parsed data if missing or placed outside the box
    const mergeExtractedFallback = (data: Record<string, any>) => {
      const extracted = tolerantExtractJson(text);
      if (!data.tagline && data.title) {
        data.tagline = data.title;
      }
      for (const [key, val] of Object.entries(extracted)) {
        if (
          val !== undefined && 
          val !== '' && 
          (data[key] === undefined || 
           data[key] === '' || 
           (Array.isArray(data[key]) && data[key].length === 0))
        ) {
          data[key] = val;
        }
      }
      if (!data.tagline && data.title) {
        data.tagline = data.title;
      }
      if (data.websiteUrl && typeof data.websiteUrl === 'string') {
        data.websiteUrl = data.websiteUrl.replace(/[\u2190-\u21FF]/g, '').trim();
      }
      return data;
    };

    // 3. Find outermost JSON object
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');

    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
      const extracted = tolerantExtractJson(text);
      if (extracted.softwareName || extracted.tagline || extracted.title || extracted.description) {
        const data: Record<string, any> = {
          isEligibleProduct: extracted.isEligibleProduct !== undefined ? extracted.isEligibleProduct : true,
          productTypeDetection: extracted.productTypeDetection || itemType,
          ineligibilityReason: extracted.ineligibilityReason || '',
          categoryMatch: extracted.categoryMatch !== undefined ? extracted.categoryMatch : true,
          categoryMismatchReason: extracted.categoryMismatchReason || '',
          softwareName: extracted.softwareName || 'Product',
          tagline: extracted.tagline || extracted.title || '',
          description: extracted.description || '',
          websiteUrl: extracted.websiteUrl || activeUrl || '',
          primaryCategory: extracted.primaryCategory || formData.primaryCategory,
          pricingModel: extracted.pricingModel || 'Freemium',
          pricingPlans: extracted.pricingPlans || [],
          features: extracted.features || [],
          mainFeatures: extracted.mainFeatures || (extracted.features ? extracted.features.join(', ') : ''),
          alternatives: extracted.alternatives || [],
          integrations: extracted.integrations || [],
          contactEmail: extracted.contactEmail || extracted.submitterEmail || extracted.email || '',
          contactPhone: extracted.contactPhone || extracted.phone || '',
          ...extracted
        };
        return { success: true, data, prettyJson: JSON.stringify(data, null, 2) };
      }
      return { 
        success: false, 
        error: 'Could not find a valid JSON object. Ensure the text starts with { and ends with }.' 
      };
    }

    let jsonStr = text.substring(firstBrace, lastBrace + 1).trim();

    // Helper: attempt parse and return result with merged fallback fields
    const tryParse = (str: string): { success: boolean; data?: any; prettyJson?: string } => {
      try {
        const rawData = JSON.parse(str);
        const data = mergeExtractedFallback(rawData);
        return { success: true, data, prettyJson: JSON.stringify(data, null, 2) };
      } catch {
        return { success: false };
      }
    };

    // 4. Try standard parse first
    let result = tryParse(jsonStr);
    if (result.success) return result;

    // 5. Clean trailing commas in objects and arrays: ,\s*} or ,\s*]
    let cleaned = jsonStr.replace(/,\s*([}\]])/g, '$1');
    result = tryParse(cleaned);
    if (result.success) return result;

    // 5b. Replace single-quoted JSON keys/values with double quotes (if single quotes used throughout)
    if (cleaned.includes("'") && !cleaned.match(/"\s*:/)) {
      const doubleQuoted = cleaned.replace(/'/g, '"');
      result = tryParse(doubleQuoted);
      if (result.success) return result;
    }

    // 5c. Fix double-escaped characters (\\" -> \", \\n -> \n)
    const unDoubleEscaped = cleaned
      .replace(/\\\\"/g, '\\"')
      .replace(/\\\\n/g, '\\n')
      .replace(/\\\\t/g, '\\t');
    result = tryParse(unDoubleEscaped);
    if (result.success) return result;

    // 6. Fix unescaped control characters / newlines within string literals
    try {
      let insideString = false;
      let escaped = false;
      let sanitized = '';
      for (let i = 0; i < cleaned.length; i++) {
        const char = cleaned[i];
        if (char === '"' && !escaped) {
          insideString = !insideString;
          sanitized += char;
        } else if (char === '\\' && !escaped) {
          escaped = true;
          sanitized += char;
        } else {
          if (escaped) escaped = false;
          if (insideString) {
            if (char === '\n') sanitized += '\\n';
            else if (char === '\r') sanitized += '\\r';
            else if (char === '\t') sanitized += '\\t';
            else sanitized += char;
          } else {
            sanitized += char;
          }
        }
      }
      result = tryParse(sanitized);
      if (result.success) return result;

      // 6b. Also try with trailing comma cleanup on sanitized
      const sanitizedCleaned = sanitized.replace(/,\s*([}\]])/g, '$1');
      result = tryParse(sanitizedCleaned);
      if (result.success) return result;
    } catch {
      // continue to tolerant fallback
    }

    // 7. Tolerant regex-based field extraction as final fallback
    const extracted = tolerantExtractJson(text);
    if (extracted.softwareName || extracted.tagline || extracted.title || extracted.description) {
      const data: Record<string, any> = {
        isEligibleProduct: extracted.isEligibleProduct !== undefined ? extracted.isEligibleProduct : true,
        productTypeDetection: extracted.productTypeDetection || itemType,
        ineligibilityReason: extracted.ineligibilityReason || '',
        categoryMatch: extracted.categoryMatch !== undefined ? extracted.categoryMatch : true,
        categoryMismatchReason: extracted.categoryMismatchReason || '',
        softwareName: extracted.softwareName || 'Product',
        tagline: extracted.tagline || extracted.title || '',
        description: extracted.description || '',
        websiteUrl: extracted.websiteUrl || activeUrl || '',
        primaryCategory: extracted.primaryCategory || formData.primaryCategory,
        pricingModel: extracted.pricingModel || 'Freemium',
        pricingPlans: extracted.pricingPlans || [],
        mainFeatures: extracted.mainFeatures || (extracted.features ? extracted.features.join(', ') : ''),
        features: extracted.features || [],
        alternatives: extracted.alternatives || [],
        integrations: extracted.integrations || [],
        contactEmail: extracted.contactEmail || extracted.submitterEmail || extracted.email || '',
        contactPhone: extracted.contactPhone || extracted.phone || '',
        ...extracted
      };
      return { success: true, data, prettyJson: JSON.stringify(data, null, 2) };
    }
    return { 
      success: false, 
      error: 'Could not parse JSON. Please make sure the JSON output from ChatGPT or Claude was copied correctly.' 
    };
  };

  // Parse & Apply JSON returned from ChatGPT / Claude
  const handleApplyAiJson = () => {
    if (!jsonInput.trim()) {
      setError('Please paste the JSON output from ChatGPT or Claude first.');
      return;
    }
    setError(null);

    const res = extractAndParseJson(jsonInput);
    if (!res.success || !res.data) {
      setError(res.error || 'Could not parse JSON. Please make sure to copy only the raw JSON output from ChatGPT or Claude.');
      return;
    }

    const parsed = res.data;

    // Automatically format jsonInput into clean pretty-printed JSON
    if (res.prettyJson) {
      setJsonInput(res.prettyJson);
    }

    try {
      // Map and filter alternatives to strictly real products with valid domains
      let parsedAlts: Array<{ name: string; domain?: string }> = formData.alternatives;
      if (Array.isArray(parsed.alternatives)) {
        const prodName = parsed.softwareName || formData.softwareName;
        const filtered = parsed.alternatives
          .map((altName: any) => String(altName).trim().replace(/^[-*•]\s*/, '').replace(/["'`]/g, ''))
          .filter((altName: string) => isValidAlternative(altName, prodName));

        if (filtered.length > 0) {
          parsedAlts = filtered.map((altName: string) => {
            const match = allSoftwareCatalog.find(s => s.name.toLowerCase() === altName.toLowerCase());
            return {
              name: altName,
              domain: match ? match.websiteUrl : resolveDomainForTool(altName)
            };
          });
        }
      }

      // Map integrations with intelligent dynamic domain resolution
      let parsedIntegs: Array<{ name: string; domain?: string }> = formData.integrations;
      if (Array.isArray(parsed.integrations)) {
        parsedIntegs = parsed.integrations.map((integName: string) => {
          const match = POPULAR_INTEGRATIONS.find(i => i.name.toLowerCase() === integName.toLowerCase());
          return {
            name: integName,
            domain: match ? match.domain : resolveDomainForTool(integName)
          };
        });
      }

      // 1. Auto-detect itemType first if category specific fields are present
      let detectedItemType = itemType;
      if (parsed.repositoryUrl || parsed.sourceCodeLicense || parsed.selfHostingSpecs) {
        setItemType('open-source');
        detectedItemType = 'open-source';
      } else if (parsed.extensionStoreUrl || parsed.browserCompatibility || parsed.extensionId) {
        setItemType('extension');
        detectedItemType = 'extension';
      } else if (parsed.packageUrl || parsed.mcpProtocol || parsed.mcpPlatforms || parsed.mcpConfigSnippet) {
        setItemType('plugin');
        detectedItemType = 'plugin';
      }

      // 2. Parse structured pricing tiers
      let updatedPricingPlans = '';
      let parsedTiers: Array<{ name: string; price: string; features: string }> = [];

      if (Array.isArray(parsed.pricingPlans)) {
        parsedTiers = parsed.pricingPlans.map((p: any) => {
          if (typeof p === 'object' && p !== null) {
            return {
              name: p.name || p.planName || 'Plan',
              price: p.price || '$0/mo',
              features: p.features || p.description || ''
            };
          }
          const str = String(p).replace(/^[-*•]\s*/, '');
          const parts = str.split(':');
          const name = parts[0]?.trim() || 'Plan';
          const rest = parts.slice(1).join(':').trim();
          const pParts = rest.split(',');
          return { name, price: pParts[0]?.trim() || '$0', features: pParts.slice(1).join(',').trim() };
        });
      } else if (typeof parsed.pricingPlans === 'string' && parsed.pricingPlans.trim()) {
        const lines = parsed.pricingPlans.split('\n').filter((l: string) => l.trim().length > 0);
        if (lines.length > 0) {
          parsedTiers = lines.map((l: string) => {
            const clean = l.replace(/^[-*•]\s*/, '').trim();
            const parts = clean.split(':');
            const name = parts[0]?.trim() || 'Plan';
            const rest = parts.slice(1).join(':').trim();
            const pParts = rest.split(',');
            return { name, price: pParts[0]?.trim() || rest, features: pParts.slice(1).join(',').trim() };
          });
        }
      }

      // Check if product is 100% Free or Open Source, or has dummy $0 tiers (e.g. Lite $0/mo, Pro $0/mo, Business $0/mo)
      const isExplicitFree = 
        parsed.pricingModel === 'Free' || 
        parsed.pricingModel === 'Open Source' || 
        detectedItemType === 'open-source' ||
        (detectedItemType === 'extension' && (!parsed.pricingModel || parsed.pricingModel === 'Free'));

      const allTiersAreZero = parsedTiers.length > 0 && parsedTiers.every(t => {
        const p = t.price.toLowerCase().replace(/[\s\-_/]/g, '');
        return p === '$0' || p === '$0mo' || p === '$0month' || p === '$0usermo' || p === 'free' || p === 'free($0)' || p === '0' || p === '';
      });

      if (isExplicitFree || allTiersAreZero || (detectedItemType === 'extension' && allTiersAreZero)) {
        // Free tool, open source, or free extension: clear tiers completely
        setPricingTiers([]);
        updatedPricingPlans = '';
        parsed.pricingModel = parsed.pricingModel || (detectedItemType === 'open-source' ? 'Open Source' : 'Free');
        parsed.startingPrice = 'Free ($0)';
        parsed.freeTierAvailable = true;
      } else if (parsedTiers.length > 0) {
        setPricingTiers(parsedTiers);
        updatedPricingPlans = parsedTiers.map((t: { name: string; price: string; features: string }) => `- ${t.name}: ${t.price}${t.features ? `, ${t.features}` : ''}`).join('\n');
      } else {
        setPricingTiers([]);
        updatedPricingPlans = '';
      }

      const itemTypeLabel = detectedItemType === 'open-source' ? 'Open-Source Project'
        : detectedItemType === 'extension' ? 'Browser Extension'
        : detectedItemType === 'plugin' ? 'MCP Server / Plugin'
        : 'Software Product';

      // 2. Extract and inspect incoming features
      const incomingFeatures = parsed.features || parsed.keyFeatures || parsed.mainFeatures;
      let rawFeatList: string[] = [];
      if (Array.isArray(incomingFeatures)) {
        rawFeatList = incomingFeatures.map((f: any) => typeof f === 'string' ? f.trim() : String(f)).filter(Boolean);
      } else if (typeof incomingFeatures === 'string') {
        rawFeatList = incomingFeatures.split(/[\n,]+/).map((s: string) => s.replace(/^[-*•✓]\s*/, '').trim()).filter(Boolean);
      }
      const bogusFeatsCount = rawFeatList.filter(f => isBogusFeature(f)).length;
      const isFeatureContaminated = rawFeatList.length >= 2 && bogusFeatsCount >= 2 && (bogusFeatsCount / rawFeatList.length >= 0.4);

      // 3. CHECK ELIGIBILITY: Is this website an informational blog, directory, guide, or non-software?
      const targetWebsite = parsed.websiteUrl || targetUrl || formData.websiteUrl;
      const contentCheck = detectIneligibleContentSite(targetWebsite, parsed.softwareName, parsed.tagline, parsed.description);

      const isExplicitIneligible = 
        parsed.isEligibleProduct === false || 
        (typeof parsed.productTypeDetection === 'string' && parsed.productTypeDetection.toLowerCase().startsWith('ineligible')) ||
        contentCheck.isIneligible ||
        isFeatureContaminated;

      if (isExplicitIneligible) {
        let typeSpecificMsg = '';
        if (detectedItemType === 'software') {
          typeSpecificMsg = `The submitted website "${parsed.softwareName || targetWebsite || 'website'}" appears to be an informational blog or content directory, not a functional software application or SaaS tool. SecureTools.live exclusively accepts functional software products with interactive apps or tools. Informational blogs and directories are not eligible for listing.`;
        } else if (detectedItemType === 'open-source') {
          typeSpecificMsg = `The submitted website "${parsed.softwareName || targetWebsite || 'website'}" is a blog or informational website, not a public open-source software code repository. SecureTools.live requires a valid open-source repository (GitHub, GitLab) with source code.`;
        } else if (detectedItemType === 'extension') {
          typeSpecificMsg = `The submitted website "${parsed.softwareName || targetWebsite || 'website'}" is a blog or article page, not an installable browser extension. A valid Chrome Web Store or Firefox Add-ons extension is required.`;
        } else {
          typeSpecificMsg = `The submitted website "${parsed.softwareName || targetWebsite || 'website'}" is an informational website, not a functional Model Context Protocol server or plugin package. A valid MCP repository, server, or package is required.`;
        }

        setCategoryMismatchError({
          title: 'Not an Eligible Software Product',
          message: typeSpecificMsg,
          typeLabel: itemTypeLabel,
          isNonProduct: true
        });
        setError(typeSpecificMsg);
        setProductFeatures([]);
        return;
      }

      // 4. CHECK CATEGORY MATCH: Does this product match one of the 24 SecureTools directory categories?
      let resolvedCategory: string | null = null;
      const catInput = parsed.primaryCategory ? String(parsed.primaryCategory).trim().toLowerCase() : '';
      const isExplicitIncompatible = 
        catInput === 'incompatible-category' || 
        catInput === 'incompatible' || 
        catInput === 'unsupported' || 
        catInput === 'none' || 
        catInput === 'other' || 
        catInput === 'n/a';

      if (!isExplicitIncompatible && catInput) {
        const found = categories.find(c => 
          c.slug.toLowerCase() === catInput ||
          c.name.toLowerCase() === catInput ||
          catInput.includes(c.name.toLowerCase()) ||
          c.name.toLowerCase().includes(catInput) ||
          c.slug.toLowerCase().replace(/-/g, ' ') === catInput.replace(/-/g, ' ')
        );
        if (found) {
          resolvedCategory = found.slug;
        }
      }

      const isCategoryMismatch = isExplicitIncompatible || parsed.categoryMatch === false || (!resolvedCategory && catInput.length > 0);

      if (isCategoryMismatch) {
        let mismatchMsg = '';
        if (detectedItemType === 'software') {
          mismatchMsg = 'This software does not match any category in our directory. SecureTools.live exclusively features security, cloud storage, virtual data rooms, and document tools.';
        } else if (detectedItemType === 'open-source') {
          mismatchMsg = 'This open-source repository does not match our directory categories. SecureTools.live exclusively features open-source security, encrypted storage, and document infrastructure projects.';
        } else if (detectedItemType === 'extension') {
          mismatchMsg = 'This browser extension does not match our directory categories. SecureTools.live exclusively features privacy, file security, and document-focused extensions.';
        } else {
          mismatchMsg = 'This MCP server / plugin does not match our directory categories. SecureTools.live exclusively features security, file, and productivity AI integrations.';
        }

        setCategoryMismatchError({
          title: 'Category Not Supported',
          message: mismatchMsg,
          suggestedCategory: parsed.primaryCategory || 'Incompatible Category',
          typeLabel: itemTypeLabel,
          isNonProduct: false
        });
        setError(mismatchMsg);
        return;
      }

      // 5. Sanitize features for Software, Extension, Plugin (never for Open Source)
      // Exclude bogus editorial phrases (guides, checklists, directories, reviews)
      let parsedFeatures: string[] = [];
      if (detectedItemType !== 'open-source') {
        parsedFeatures = rawFeatList.filter(f => !isBogusFeature(f));
        if (parsedFeatures.length > 0) {
          setProductFeatures(parsedFeatures);
        }
      }

      setFormData(prev => ({
        ...prev,
        softwareName: parsed.softwareName || prev.softwareName,
        tagline: parsed.tagline || parsed.title || prev.tagline,
        description: parsed.description || prev.description,
        websiteUrl: parsed.websiteUrl || targetUrl || prev.websiteUrl,
        primaryCategory: resolvedCategory || prev.primaryCategory,
        pricingModel: parsed.pricingModel || prev.pricingModel,
        startingPrice: parsed.startingPrice || prev.startingPrice,
        pricingUrl: parsed.pricingUrl || prev.pricingUrl,
        freeTierAvailable: parsed.freeTierAvailable !== undefined ? Boolean(parsed.freeTierAvailable) : prev.freeTierAvailable,
        freeTrialDays: parsed.freeTrialDays || prev.freeTrialDays,
        pricingPlans: updatedPricingPlans,
        mainFeatures: parsedFeatures.length > 0 ? parsedFeatures.join(', ') : (typeof parsed.mainFeatures === 'string' ? parsed.mainFeatures : (parsed.mainFeatures?.join(', ') || prev.mainFeatures)),
        alternatives: parsedAlts,
        integrations: parsedIntegs,
        submitterEmail: parsed.contactEmail || parsed.supportEmail || parsed.email || prev.submitterEmail,
        contactPhone: parsed.contactPhone || parsed.phone || parsed.mobile || prev.contactPhone,
        // Open Source specific fields
        repositoryUrl: parsed.repositoryUrl || prev.repositoryUrl,
        sourceCodeLicense: parsed.sourceCodeLicense || parsed.license || prev.sourceCodeLicense,
        projectDocumentationUrl: parsed.projectDocumentationUrl || parsed.documentationUrl || prev.projectDocumentationUrl,
        selfHostingSpecs: parsed.selfHostingSpecs || prev.selfHostingSpecs,
        // Extension specific fields
        extensionStoreUrl: parsed.extensionStoreUrl || prev.extensionStoreUrl,
        browserCompatibility: Array.isArray(parsed.browserCompatibility) ? parsed.browserCompatibility : prev.browserCompatibility,
        developerName: parsed.developerName || prev.developerName,
        extensionId: parsed.extensionId || prev.extensionId,
        // MCP & Plugin specific fields
        packageUrl: parsed.packageUrl || prev.packageUrl,
        mcpProtocol: parsed.mcpProtocol || prev.mcpProtocol,
        mcpPlatforms: Array.isArray(parsed.mcpPlatforms) ? parsed.mcpPlatforms : prev.mcpPlatforms,
        mcpRunCommand: parsed.mcpRunCommand || prev.mcpRunCommand,
        mcpConfigSnippet: typeof parsed.mcpConfigSnippet === 'object' ? JSON.stringify(parsed.mcpConfigSnippet, null, 2) : (parsed.mcpConfigSnippet || prev.mcpConfigSnippet)
      }));

      setAiNotice('Successfully applied AI-extracted data! Review and adjust any field below.');
      setTimeout(() => setAiNotice(null), 6000);
    } catch {
      setError('Could not apply fields from JSON. Please verify the JSON structure.');
    }
  };

  // Quick Local Draft helper
  const handleQuickLocalDraft = () => {
    const url = targetUrl.trim() || formData.websiteUrl.trim();
    if (!url) {
      setError('Please enter a website URL first.');
      return;
    }

    if (duplicateTargetMatch) {
      setError(`Cannot draft: "${duplicateTargetMatch.name}" is already listed in SecureTools.live. Duplicate listings are strictly prohibited.`);
      return;
    }

    setError(null);

    // Guard against blog / directory / non-software sites
    const ineligibleCheck = detectIneligibleContentSite(url);
    if (ineligibleCheck.isIneligible) {
      const itemTypeLabel = itemType === 'open-source' ? 'Open-Source Project'
        : itemType === 'extension' ? 'Browser Extension'
        : itemType === 'plugin' ? 'MCP Server / Plugin'
        : 'Software Product';

      let typeSpecificMsg = '';
      if (itemType === 'software') {
        typeSpecificMsg = `The entered website "${url}" appears to be an informational blog or directory guide, not a functional software application. SecureTools.live exclusively accepts functional software platforms. Blogs and directories are not eligible for listing.`;
      } else if (itemType === 'open-source') {
        typeSpecificMsg = `The entered website "${url}" is a blog or informational website, not a public open-source software code repository.`;
      } else if (itemType === 'extension') {
        typeSpecificMsg = `The entered website "${url}" is a blog or informational website, not an installable browser extension.`;
      } else {
        typeSpecificMsg = `The entered website "${url}" is an informational website, not an MCP server or plugin package.`;
      }

      setCategoryMismatchError({
        title: 'Not an Eligible Software Product',
        message: typeSpecificMsg,
        typeLabel: itemTypeLabel,
        isNonProduct: true,
        reason: ineligibleCheck.reason
      });
      setError(typeSpecificMsg);
      return;
    }

    let hostname = '';
    try {
      hostname = new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace('www.', '');
    } catch {
      hostname = url.replace(/^https?:\/\//, '').split('/')[0];
    }

    const domainName = hostname.split('.')[0] || 'MyProduct';
    const capitalized = domainName.charAt(0).toUpperCase() + domainName.slice(1);

    const isFreeType = itemType === 'extension' || itemType === 'open-source' || formData.pricingModel === 'Free' || formData.pricingModel === 'Open Source';

    if (isFreeType) {
      setPricingTiers([]);
    } else {
      const defaultTiers = [
        { name: 'Free Tier', price: '$0/mo', features: 'Basic storage & core features' },
        { name: 'Pro Plan', price: '$12/user/mo', features: 'Advanced encryption & 1TB storage' },
        { name: 'Enterprise', price: 'Custom quote', features: 'Dedicated SLA & audit compliance' }
      ];
      setPricingTiers(defaultTiers);
    }

    // Populate category-specific default features for Software/Extension/Plugin
    if (itemType !== 'open-source') {
      const defaultFeats = itemType === 'extension'
        ? DEFAULT_EXTENSION_FEATURES
        : itemType === 'plugin'
          ? DEFAULT_PLUGIN_FEATURES
          : (CATEGORY_POPULAR_FEATURES[formData.primaryCategory] || DEFAULT_SOFTWARE_FEATURES);
      setProductFeatures(defaultFeats);
    }

    setFormData(prev => ({
      ...prev,
      websiteUrl: url.startsWith('http') ? url : `https://${url}`,
      softwareName: prev.softwareName || capitalized,
      tagline: prev.tagline || `Secure, high-performance platform engineered for ${domainName}`,
      description: prev.description || `${capitalized} delivers end-to-end encrypted infrastructure, automated access controls, and audited security compliance for modern digital operations.`,
      logoUrl: prev.logoUrl || getGoogleFavicon(hostname),
      pricingUrl: prev.pricingUrl || `${(url.startsWith('http') ? url : `https://${url}`).replace(/\/+$/, '')}/pricing`,
      startingPrice: isFreeType ? 'Free ($0)' : (prev.startingPrice || 'Free ($0)'),
      pricingModel: isFreeType ? (itemType === 'open-source' ? 'Open Source' : 'Free') : (prev.pricingModel || 'Freemium'),
      freeTierAvailable: isFreeType ? true : prev.freeTierAvailable,
      pricingPlans: isFreeType ? '' : `- Free Tier: $0/mo, Basic storage & core features\n- Pro Plan: $12/user/mo, Advanced encryption & 1TB storage\n- Enterprise: Custom quote, Dedicated SLA & audit compliance`,
      mainFeatures: prev.mainFeatures || 'End-to-End Encryption, SOC 2 Compliance, Granular Access Control, Audit Logs',
      submitterEmail: prev.submitterEmail || `contact@${hostname}`
    }));

    setAiNotice(`Filled draft baseline from ${hostname}. You can now tweak details or use ChatGPT.`);
    setTimeout(() => setAiNotice(null), 5000);
  };

  // Logo file upload handler
  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Screenshot file upload handler (PNG / JPEG only, up to 5)
  const handleScreenshotFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = 5 - formData.screenshots.length;
    if (remainingSlots <= 0) {
      setError('Maximum of 5 screenshots allowed.');
      return;
    }

    const filesToProcess = Array.from(files).slice(0, remainingSlots);
    filesToProcess.forEach(file => {
      // Validate PNG or JPEG
      if (!file.type.match(/^image\/(png|jpeg|jpg|webp)$/i)) {
        setError('Please upload PNG or JPEG images only.');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setFormData(prev => {
            if (prev.screenshots.length < 5) {
              return { ...prev, screenshots: [...prev.screenshots, reader.result as string] };
            }
            return prev;
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove Screenshot
  const handleRemoveScreenshot = (index: number) => {
    setFormData(prev => ({
      ...prev,
      screenshots: prev.screenshots.filter((_, i) => i !== index)
    }));
  };

  // Helper to parse typed queries into clean names and domains with favicons
  const parseToolQuery = (query: string) => {
    const q = query.trim();
    if (!q) return null;

    let cleanDomain = '';
    let displayName = '';

    const isDomainOrUrl = q.includes('.') || q.startsWith('http://') || q.startsWith('https://');

    if (isDomainOrUrl) {
      let rawHost = q;
      try {
        if (!rawHost.startsWith('http://') && !rawHost.startsWith('https://')) {
          rawHost = 'https://' + rawHost;
        }
        cleanDomain = new URL(rawHost).hostname.replace(/^www\./, '');
      } catch {
        cleanDomain = q.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
      }

      const hostBase = cleanDomain.split('.')[0] || q;

      // Check if matches known software or popular integration
      const matchedSoftware = allSoftwareCatalog.find(s => {
        try {
          if (s.websiteUrl) {
            const sHost = new URL(s.websiteUrl).hostname.replace(/^www\./, '');
            if (sHost.toLowerCase() === cleanDomain.toLowerCase()) return true;
          }
        } catch {}
        return s.name.toLowerCase() === hostBase.toLowerCase();
      });

      const matchedInteg = POPULAR_INTEGRATIONS.find(i => 
        i.domain.toLowerCase() === cleanDomain.toLowerCase() || 
        i.name.toLowerCase() === hostBase.toLowerCase()
      );

      if (matchedSoftware) {
        displayName = matchedSoftware.name;
      } else if (matchedInteg) {
        displayName = matchedInteg.name;
      } else {
        const lowerBase = hostBase.toLowerCase();
        const KNOWN_BRANDS: Record<string, string> = {
          docsend: 'DocSend',
          dropbox: 'Dropbox',
          box: 'Box',
          wetransfer: 'WeTransfer',
          tresorit: 'Tresorit',
          nextcloud: 'Nextcloud',
          proton: 'Proton Drive',
          protondrive: 'Proton Drive',
          googledrive: 'Google Drive',
          onedrive: 'OneDrive',
          sharepoint: 'SharePoint',
          github: 'GitHub',
          gitlab: 'GitLab',
          bitbucket: 'Bitbucket',
          slack: 'Slack',
          notion: 'Notion',
          zoom: 'Zoom',
          hubspot: 'HubSpot',
          linear: 'Linear',
          docusign: 'DocuSign',
          pandadoc: 'PandaDoc',
          signwell: 'SignWell',
          yousign: 'Yousign',
          adobe: 'Adobe Acrobat Sign',
          sendnow: 'SendNow'
        };

        if (KNOWN_BRANDS[lowerBase]) {
          displayName = KNOWN_BRANDS[lowerBase];
        } else {
          displayName = hostBase.charAt(0).toUpperCase() + hostBase.slice(1);
        }
      }
    } else {
      displayName = q;
      const lower = q.toLowerCase();
      const matchedSoftware = allSoftwareCatalog.find(s => s.name.toLowerCase() === lower);
      const matchedInteg = POPULAR_INTEGRATIONS.find(i => i.name.toLowerCase() === lower);

      if (matchedSoftware && matchedSoftware.websiteUrl) {
        try {
          cleanDomain = new URL(matchedSoftware.websiteUrl).hostname.replace(/^www\./, '');
        } catch {
          cleanDomain = `${lower.replace(/[^a-z0-9]/g, '')}.com`;
        }
      } else if (matchedInteg) {
        cleanDomain = matchedInteg.domain;
      } else {
        cleanDomain = `${lower.replace(/[^a-z0-9]/g, '')}.com`;
      }
    }

    return {
      name: displayName,
      domain: cleanDomain,
      faviconUrl: getGoogleFavicon(cleanDomain),
      isDomainOrUrl
    };
  };

  // Filtered Alternatives for live search
  const filteredAlternatives = useMemo(() => {
    if (!altSearchQuery.trim()) return [];
    const q = altSearchQuery.toLowerCase();
    const cleanQ = q.replace(/^https?:\/\//, '').replace(/^www\./, '').split('.')[0];
    return allSoftwareCatalog
      .filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.name.toLowerCase().includes(cleanQ) ||
        (s.websiteUrl && s.websiteUrl.toLowerCase().includes(cleanQ)) ||
        s.primaryCategory.toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [altSearchQuery, allSoftwareCatalog]);

  const altParsedTool = useMemo(() => parseToolQuery(altSearchQuery), [altSearchQuery]);

  const addAlternative = (alt: { name: string; domain?: string }) => {
    if (!formData.alternatives.some(a => a.name.toLowerCase() === alt.name.toLowerCase())) {
      setFormData(prev => ({
        ...prev,
        alternatives: [...prev.alternatives, alt]
      }));
    }
    setAltSearchQuery('');
    setAltDropdownOpen(false);
  };

  const removeAlternative = (altName: string) => {
    setFormData(prev => ({
      ...prev,
      alternatives: prev.alternatives.filter(a => a.name !== altName)
    }));
  };

  // Filtered Integrations for live search
  const filteredIntegrations = useMemo(() => {
    if (!integrationSearchQuery.trim()) return [];
    const q = integrationSearchQuery.toLowerCase();
    const cleanQ = q.replace(/^https?:\/\//, '').replace(/^www\./, '').split('.')[0];
    return POPULAR_INTEGRATIONS
      .filter(i => 
        i.name.toLowerCase().includes(q) ||
        i.name.toLowerCase().includes(cleanQ) ||
        i.domain.toLowerCase().includes(cleanQ)
      )
      .slice(0, 6);
  }, [integrationSearchQuery]);

  const integrationParsedTool = useMemo(() => parseToolQuery(integrationSearchQuery), [integrationSearchQuery]);

  const addIntegration = (integ: { name: string; domain?: string }) => {
    if (!formData.integrations.some(i => i.name.toLowerCase() === integ.name.toLowerCase())) {
      setFormData(prev => ({
        ...prev,
        integrations: [...prev.integrations, integ]
      }));
    }
    setIntegrationSearchQuery('');
    setIntegrationDropdownOpen(false);
  };

  const removeIntegration = (integName: string) => {
    setFormData(prev => ({
      ...prev,
      integrations: prev.integrations.filter(i => i.name !== integName)
    }));
  };

  // Pill Toggles
  const toggleBrowser = (b: string) => {
    setFormData(prev => {
      const exists = prev.browserCompatibility.includes(b);
      return {
        ...prev,
        browserCompatibility: exists
          ? prev.browserCompatibility.filter(item => item !== b)
          : [...prev.browserCompatibility, b]
      };
    });
  };

  const togglePlatform = (p: string) => {
    setFormData(prev => {
      const exists = prev.mcpPlatforms.includes(p);
      return {
        ...prev,
        mcpPlatforms: exists
          ? prev.mcpPlatforms.filter(item => item !== p)
          : [...prev.mcpPlatforms, p]
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (activeExistingListing) {
      const msg = `Free accounts are limited to 1 active submission at a time. Your tool "${activeExistingListing.name}" is currently under review.`;
      setError(msg);
      setLimitNotification({
        toolName: activeExistingListing.name,
        toolId: activeExistingListing.id,
        status: activeExistingListing.submission_status,
        message: msg
      });
      return;
    }

    if (!formData.softwareName.trim()) {
      setError('Product Name is required.');
      return;
    }

    if (!formData.logoUrl) {
      setError('Product Logo is required. Please upload your tool logo.');
      return;
    }

    if (!formData.description.trim()) {
      setError('Product Description is required.');
      return;
    }

    if (!formData.submitterEmail.trim()) {
      setError('Official Contact Email is required.');
      return;
    }

    const mainUrl = formData.websiteUrl || formData.repositoryUrl || formData.extensionStoreUrl || formData.packageUrl || targetUrl;
    if (!mainUrl) {
      setError('Please provide a valid website, repository, or store URL.');
      return;
    }

    // Check duplicate URLs before submission
    const urlsToCheck = [
      formData.websiteUrl,
      formData.repositoryUrl,
      formData.extensionStoreUrl,
      formData.packageUrl,
      targetUrl,
    ].filter(Boolean);

    const localDuplicate = checkDuplicateInItems(urlsToCheck, allSoftwareCatalog);
    if (localDuplicate) {
      setError(`Cannot submit: This product or URL already exists in our directory under "${localDuplicate.name}". Duplicate submissions are strictly prohibited across Commercial Tools, Open Source, Extensions, and MCP Plugins.`);
      window.scrollTo({ top: 250, behavior: 'smooth' });
      return;
    }

    if (!formData.agreement) {
      setError('Please certify that the information provided is factual and accurate.');
      return;
    }

    setSubmitting(true);
    try {
      const isFree = formData.pricingModel === 'Free' || formData.pricingModel === 'Open Source' || itemType === 'open-source';
      const cleanPricingPlans = isFree ? '' : (pricingTiers.length > 0 
        ? pricingTiers.map(t => `- ${t.name}: ${t.price}${t.features ? `, ${t.features}` : ''}`).join('\n')
        : formData.pricingPlans);

      const payload = {
        itemType,
        ...formData,
        sourceCodeLicense: itemType === 'open-source' ? formData.sourceCodeLicense : null,
        pricingPlans: cleanPricingPlans,
        startingPrice: isFree ? 'Free ($0)' : formData.startingPrice,
        shortDescription: formData.description.trim(),
        features: (itemType !== 'open-source') ? productFeatures.filter(f => f.trim().length > 0) : undefined,
        mainFeatures: (itemType !== 'open-source' && productFeatures.length > 0) 
          ? productFeatures.filter(f => f.trim().length > 0).join(', ') 
          : formData.mainFeatures,
        websiteUrl: mainUrl,
        alternatives: formData.alternatives.map(a => a.name),
        integrations: formData.integrations.map(i => i.name)
      };

      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401 || data.code === 'UNAUTHENTICATED') {
          setError('Please sign in first to submit your software. Redirecting to sign in...');
          setTimeout(() => {
            window.location.href = '/login?next=/submit';
          }, 1200);
          return;
        }

        if (res.status === 403 && (data.code === 'SUBMISSION_LIMIT_REACHED' || data.error?.includes('Free accounts are limited'))) {
          const toolName = data.activeListing?.name || 'Your tool';
          const msg = data.error || `Free accounts are limited to 1 active submission at a time. Your tool "${toolName}" is currently under review.`;
          setError(msg);
          setLimitNotification({
            toolName,
            toolId: data.activeListing?.id,
            status: data.activeListing?.submission_status || 'under_review',
            message: msg
          });
          return;
        }

        if (res.status === 409 || data.code === 'DUPLICATE_URL_EXISTS') {
          const match = data.duplicate;
          const msg = data.error || `This product or URL is already listed under "${match?.name || 'an existing tool'}". Duplicate submissions are strictly prohibited.`;
          setError(msg);
          if (match) {
            setDuplicateTargetMatch(match);
          }
          window.scrollTo({ top: 250, behavior: 'smooth' });
          return;
        }

        throw new Error(data.error || 'Submission failed');
      }

      setSubmissionResult(data.submission || { id: data.submissionId, ...payload });
      setSubmitted(true);
      triggerCelebrationConfetti();
    } catch (err: any) {
      if (err.message?.includes('Free accounts are limited')) {
        const match = err.message.match(/tool "([^"]+)"/i);
        const toolName = match ? match[1] : 'Your tool';
        setLimitNotification({
          toolName,
          status: 'under_review',
          message: err.message
        });
      }
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div 
      className="py-6 sm:py-10 pb-28 px-4 max-w-[760px] mx-auto text-[#09090b] font-normal font-sans antialiased"
      style={{ fontFamily: 'var(--font-geist-sans), "Geist", -apple-system, BlinkMacSystemFont, sans-serif', fontWeight: 400 }}
    >
      <Breadcrumbs items={[{ label: 'Launch a product' }]} />

      {/* Header */}
      <div className="mb-6 pt-2">
        <h1 className="text-[28px] sm:text-[32px] font-bold tracking-tight text-[#09090b] leading-tight font-geist">
          Launch a product
        </h1>
        <p className="text-[13.5px] text-[#71717a] mt-1 leading-normal font-geist font-normal">
          Paste your URL, let AI fill the listing, pick a boost, pay once. Everything else is optional.
        </p>
      </div>

      <hr className="border-[#e4e4e7] mb-7" />

      {/* 1. PRODUCT CATEGORY FORMAT (Card with dashed border, black outline only when selected, no mint blue) */}
      <div className="rounded-2xl border border-dashed border-[#cbd5e1] p-5 sm:p-6 mb-6 bg-white shadow-2xs space-y-4 font-geist">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#09090b] font-geist">
            1. PRODUCT CATEGORY FORMAT
          </div>
          <p className="text-[12px] text-[#71717a] mt-0.5 font-normal font-geist">
            Select your product architecture and distribution format.
          </p>
        </div>

        <hr className="border-[#e4e4e7]" />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={() => setItemType('software')}
            className={`p-3 rounded-xl text-left transition-all cursor-pointer flex items-start gap-2.5 ${
              itemType === 'software'
                ? 'border border-[#09090b] bg-white text-[#09090b] shadow-xs'
                : 'border border-[#e4e4e7] bg-white hover:border-[#a1a1aa] text-[#71717a]'
            }`}
          >
            <div className={`shrink-0 mt-0.5 ${itemType === 'software' ? 'text-[#09090b]' : 'text-[#71717a]'}`}>
              <SoftwareIcon />
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-bold text-[#09090b] leading-tight font-geist">Software</div>
              <div className="text-[10.5px] text-[#71717a] mt-0.5 font-geist font-normal leading-snug">Web & Desktop Apps</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setItemType('open-source');
              setFormData(prev => ({
                ...prev,
                pricingModel: 'Open Source',
                startingPrice: 'Free ($0)',
                freeTierAvailable: true,
                pricingPlans: ''
              }));
              setPricingTiers([]);
            }}
            className={`p-3 rounded-xl text-left transition-all cursor-pointer flex items-start gap-2.5 ${
              itemType === 'open-source'
                ? 'border border-[#09090b] bg-white text-[#09090b] shadow-xs'
                : 'border border-[#e4e4e7] bg-white hover:border-[#a1a1aa] text-[#71717a]'
            }`}
          >
            <div className={`shrink-0 mt-0.5 ${itemType === 'open-source' ? 'text-[#09090b]' : 'text-[#71717a]'}`}>
              <OpenSourceIcon />
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-bold text-[#09090b] leading-tight font-geist">Open Source</div>
              <div className="text-[10.5px] text-[#71717a] mt-0.5 font-geist font-normal leading-snug">Transparent & Secure</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setItemType('extension');
              if (formData.pricingModel === 'Freemium' || formData.pricingModel === 'Paid') {
                setFormData(prev => ({
                  ...prev,
                  pricingModel: 'Free',
                  startingPrice: 'Free ($0)',
                  freeTierAvailable: true,
                  pricingPlans: ''
                }));
                setPricingTiers([]);
              }
            }}
            className={`p-3 rounded-xl text-left transition-all cursor-pointer flex items-start gap-2.5 ${
              itemType === 'extension'
                ? 'border border-[#09090b] bg-white text-[#09090b] shadow-xs'
                : 'border border-[#e4e4e7] bg-white hover:border-[#a1a1aa] text-[#71717a]'
            }`}
          >
            <div className={`shrink-0 mt-0.5 ${itemType === 'extension' ? 'text-[#09090b]' : 'text-[#71717a]'}`}>
              <Puzzle className="w-4 h-4 shrink-0" strokeWidth={1.8} />
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-bold text-[#09090b] leading-tight font-geist">Extension</div>
              <div className="text-[10.5px] text-[#71717a] mt-0.5 font-geist font-normal leading-snug">Browser Add-ons</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setItemType('plugin')}
            className={`p-3 rounded-xl text-left transition-all cursor-pointer flex items-start gap-2.5 ${
              itemType === 'plugin'
                ? 'border border-[#09090b] bg-white text-[#09090b] shadow-xs'
                : 'border border-[#e4e4e7] bg-white hover:border-[#a1a1aa] text-[#71717a]'
            }`}
          >
            <div className={`shrink-0 mt-0.5 ${itemType === 'plugin' ? 'text-[#09090b]' : 'text-[#71717a]'}`}>
              <Plug className="w-4 h-4 shrink-0" strokeWidth={1.8} />
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-bold text-[#09090b] leading-tight font-geist">MCP & Plugins</div>
              <div className="text-[10.5px] text-[#71717a] mt-0.5 font-geist font-normal leading-snug">AI & Productivity</div>
            </div>
          </button>
        </div>
      </div>

      {/* 2. START WITH YOUR URL (Mega Prompt & AI Auto-Fill Card) */}
      <div className="rounded-2xl p-5 sm:p-6 mb-8 border border-[#e4e4e7] bg-[#fafafa] shadow-2xs font-geist">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-[#09090b] tracking-tight font-geist">
            2. Start with your URL
          </h2>
          <span className="text-[11px] font-semibold text-[#09090b] bg-[#e4e4e7] px-2.5 py-0.5 rounded-full uppercase tracking-wide font-geist">
            {itemType === 'plugin' ? 'MCP & Plugin Format' : `${itemType} Format`}
          </span>
        </div>
        <p className="text-[12.5px] text-[#71717a] mt-1 leading-relaxed font-normal font-geist">
          Paste your website or repository URL below. Our AI Mega-Prompt will crawl pricing, features, encryption, and integrations for you.
        </p>

        <div className="mt-4 flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1 flex items-center">
            <div className="absolute left-3.5 pointer-events-none text-[#71717a]">
              <Globe className="w-4 h-4 text-[#71717a]" strokeWidth={1.8} />
            </div>
            <input
              type="url"
              placeholder="https://www.example.com/"
              value={targetUrl}
              onChange={(e) => {
                const val = e.target.value;
                setTargetUrl(val);
                if (!formData.websiteUrl) {
                  setFormData(prev => ({ ...prev, websiteUrl: val }));
                }
                checkUrlDuplicate(val, setDuplicateTargetMatch);
              }}
              onBlur={(e) => {
                checkUrlDuplicate(e.target.value, setDuplicateTargetMatch);
              }}
              className={`w-full h-11 pl-10 pr-3.5 rounded-xl border bg-white text-[13.5px] text-[#09090b] placeholder:text-[#a1a1aa] focus:outline-none transition-all shadow-2xs font-geist font-normal ${
                duplicateTargetMatch
                  ? 'border-[#ef4444] focus:border-[#ef4444] focus:ring-2 focus:ring-[#ef4444]/20'
                  : 'border-[#e4e4e7] focus:border-[#02ccc1] focus:ring-2 focus:ring-[#02ccc1]/15'
              }`}
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleQuickLocalDraft}
              className="h-11 px-4 rounded-xl bg-white hover:bg-[#f4f4f5] text-[#09090b] font-medium text-[13px] border border-[#e4e4e7] shadow-2xs transition-colors flex items-center justify-center shrink-0 cursor-pointer font-geist"
              title="Instantly generate baseline draft on this page"
            >
              <span>Quick Draft</span>
            </button>
          </div>
        </div>

        {/* Duplicate URL Error Warning Banner */}
        {duplicateTargetMatch && (
          <div className="mt-3.5 p-4 rounded-2xl border border-[#fca5a5] bg-[#fef2f2] text-[#991b1b] flex items-start gap-3.5 animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="w-8 h-8 rounded-xl bg-[#fee2e2] text-[#ef4444] border border-[#fca5a5] flex items-center justify-center shrink-0">
              <AlertCircleIcon size={18} strokeWidth={2.2} />
            </div>
            <div className="flex-1 min-w-0 text-[13px] leading-relaxed">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-[#b91c1c] text-[13.5px]">
                  Duplicate Listing Already Exists
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#fee2e2] text-[#b91c1c] border border-[#fca5a5]">
                  {duplicateTargetMatch.itemType}
                </span>
              </div>
              <p className="text-[#7f1d1d] text-[12.5px] leading-snug">
                <strong>{duplicateTargetMatch.name}</strong> is already registered in SecureTools.live under this URL. Duplicate submissions are strictly prohibited across Commercial Tools, Open Source software, Browser Extensions, and MCP Plugins.
              </p>
              <div className="mt-2.5 flex items-center gap-2">
                <Link
                  href={duplicateTargetMatch.listingPath}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#ef4444] hover:bg-[#dc2626] text-white text-[11.5px] font-semibold transition-colors shadow-2xs"
                >
                  <span>View Existing &ldquo;{duplicateTargetMatch.name}&rdquo; Listing</span>
                  <ArrowUpRight01Icon size={13} strokeWidth={2.2} />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Action Bar for ChatGPT, Claude, Perplexity & Prompt Copy (Screenshot 2 Rounded Pills) */}
        <div className="mt-4 pt-3.5 border-t border-[#e4e4e7] flex flex-wrap items-center justify-between gap-2.5 text-[12px] font-geist">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[#71717a] text-[12px] font-normal mr-1">Also compatible with:</span>

            {/* ChatGPT */}
            <button
              type="button"
              onClick={handleOpenChatGPT}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#e4e4e7] bg-white hover:bg-[#f4f4f5] hover:border-[#d4d4d8] text-[12px] font-medium text-[#09090b] shadow-2xs transition-colors cursor-pointer group font-geist"
              title="Pre-fill Mega Prompt and open ChatGPT in a new tab"
            >
              <Image
                src="/icons/chatgpt.png"
                alt="ChatGPT"
                width={14}
                height={14}
                className="w-3.5 h-3.5 object-contain rounded-full shrink-0"
                unoptimized
              />
              <span>ChatGPT</span>
            </button>

            {/* Claude */}
            <button
              type="button"
              onClick={handleOpenClaude}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#e4e4e7] bg-white hover:bg-[#f4f4f5] hover:border-[#d4d4d8] text-[12px] font-medium text-[#09090b] shadow-2xs transition-colors cursor-pointer group font-geist"
              title="Pre-fill Mega Prompt and open Claude in a new tab"
            >
              <Image
                src="/icons/claude.png"
                alt="Claude"
                width={14}
                height={14}
                className="w-3.5 h-3.5 object-contain rounded-full shrink-0"
                unoptimized
              />
              <span>Claude</span>
            </button>

            {/* Perplexity */}
            <button
              type="button"
              onClick={handleOpenPerplexity}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#e4e4e7] bg-white hover:bg-[#f4f4f5] hover:border-[#d4d4d8] text-[12px] font-medium text-[#09090b] shadow-2xs transition-colors cursor-pointer group font-geist"
              title="Pre-fill Mega Prompt and open Perplexity in a new tab"
            >
              <Image
                src="/icons/perplexity.png"
                alt="Perplexity"
                width={14}
                height={14}
                className="w-3.5 h-3.5 object-contain shrink-0"
                unoptimized
              />
              <span>Perplexity</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopyMegaPrompt}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-[#f4f4f5] text-[#09090b] border border-[#e4e4e7] font-medium text-[12px] shadow-2xs transition-colors cursor-pointer font-geist"
          >
            <Copy01Icon size={13} />
            <span>{copiedPrompt ? '✓ Copied' : 'Copy Mega Prompt'}</span>
          </button>
        </div>

        {/* Clean JSON Input — Dark Code Block Style with Robust Auto-Formatting */}
        <div className="mt-4 pt-3.5 border-t border-[#e4e4e7]">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[12.5px] font-medium text-[#09090b] font-geist">
              Paste the JSON data from ChatGPT / Claude to Auto-Fill:
            </label>
            <div className="flex items-center gap-2.5">
              {jsonInput.trim() && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setJsonInput('');
                      setError(null);
                    }}
                    className="text-[11.5px] text-[#a1a1aa] hover:text-[#ef4444] hover:underline cursor-pointer font-geist font-medium transition-colors"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const res = extractAndParseJson(jsonInput);
                      if (res.success && res.prettyJson) {
                        setJsonInput(res.prettyJson);
                        setError(null);
                      } else {
                        setError(res.error || 'Invalid JSON format');
                      }
                    }}
                    className="text-[11.5px] text-[#02ccc1] hover:underline cursor-pointer font-geist font-medium"
                  >
                    Format JSON
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="space-y-2.5">
            <div className="relative rounded-xl overflow-hidden border border-[#e4e4e7] bg-white shadow-2xs">
              {/* Code block header bar — White Editor View with 1-Click Paste & Copy */}
              <div className="flex items-center justify-between px-3.5 py-2 bg-[#f4f4f5] border-b border-[#e4e4e7]">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#eab308]"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]"></span>
                  </div>
                  <span className="text-[11px] text-[#71717a] font-mono ml-2 font-medium">JSON Output</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        let pasted = '';
                        if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.readText) {
                          pasted = await navigator.clipboard.readText();
                        }
                        if (pasted && pasted.trim()) {
                          const res = extractAndParseJson(pasted);
                          if (res.success && res.prettyJson) {
                            setJsonInput(res.prettyJson);
                            setError(null);
                          } else {
                            setJsonInput(pasted.trim());
                            setError(null);
                          }
                        } else {
                          const ta = document.getElementById('ai-json-textarea') as HTMLTextAreaElement;
                          ta?.focus();
                        }
                      } catch {
                        const ta = document.getElementById('ai-json-textarea') as HTMLTextAreaElement;
                        ta?.focus();
                      }
                    }}
                    className="text-[11.5px] text-[#09090b] hover:text-black font-mono cursor-pointer transition-all flex items-center gap-1.5 font-semibold bg-white hover:bg-[#f4f4f5] border border-[#d4d4d8] px-2.5 py-1 rounded-md shadow-2xs active:scale-95"
                    title="Paste directly from clipboard"
                  >
                    <ClipboardPaste size={12} className="text-[#09090b]" />
                    <span>Paste</span>
                  </button>
                  {jsonInput.trim() && (
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(jsonInput);
                        } catch {
                          const textArea = document.createElement('textarea');
                          textArea.value = jsonInput;
                          document.body.appendChild(textArea);
                          textArea.select();
                          document.execCommand('copy');
                          document.body.removeChild(textArea);
                        }
                      }}
                      className="text-[11.5px] text-[#71717a] hover:text-[#09090b] font-mono cursor-pointer transition-colors flex items-center gap-1 font-medium px-2 py-1"
                    >
                      <Copy01Icon size={12} />
                      <span>Copy</span>
                    </button>
                  )}
                </div>
              </div>
              <textarea
                id="ai-json-textarea"
                rows={10}
                placeholder={'{\n  "softwareName": "Tresorit",\n  "tagline": "End-to-End Encrypted Cloud Storage & File Sharing",\n  "description": "Tresorit provides zero-knowledge, client-side AES-256 encrypted file sync and sharing for security-conscious teams, complete with granular permissions, audit trails, and SOC 2 compliance.",\n  ...\n}'}
                value={jsonInput}
                onChange={(e) => {
                  const val = e.target.value;
                  setJsonInput(val);
                  if (val.trim()) {
                    setError(null);
                  }
                }}
                onPaste={(e) => {
                  // Do NOT prevent default so native browser paste (Cmd+V, Right click -> Paste) works 100% reliably!
                  const text = e.clipboardData?.getData('text/plain') || e.clipboardData?.getData('text') || '';
                  if (text && text.trim()) {
                    setTimeout(() => {
                      const res = extractAndParseJson(text);
                      if (res.success && res.prettyJson) {
                        setJsonInput(res.prettyJson);
                        setError(null);
                      }
                    }, 30);
                  }
                }}
                className="w-full h-[240px] p-3.5 bg-white font-mono text-[12px] text-[#09090b] focus:outline-none resize-y leading-relaxed placeholder:text-[#a1a1aa] border-0"
                style={{ caretColor: '#09090b' }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11.5px] text-[#71717a] font-geist font-normal">
                {jsonInput.trim() ? '✓ JSON pasted — click Apply to auto-fill the form' : 'Paste the ChatGPT / Claude output here'}
              </span>
              <button
                type="button"
                onClick={handleApplyAiJson}
                disabled={!jsonInput.trim()}
                className={`h-9 px-4 rounded-xl font-medium text-[12.5px] tracking-tight transition-colors shadow-xs shrink-0 cursor-pointer flex items-center justify-center font-geist ${
                  jsonInput.trim() 
                    ? 'bg-[#09090b] hover:bg-[#27272a] text-white' 
                    : 'bg-[#f4f4f5] text-[#a1a1aa] cursor-not-allowed'
                }`}
              >
                <span>Apply & Auto-Fill Form</span>
              </button>
            </div>
          </div>
        </div>

        {/* Status / Success notice */}
        {aiNotice && (
          <div className="mt-3 p-3 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] text-[12.5px] text-[#166534] font-medium flex items-center gap-2 font-geist">
            <CheckmarkCircle02Icon size={16} className="shrink-0 text-[#166534]" />
            <span>{aiNotice}</span>
          </div>
        )}
      </div>


      {/* ── TOP-RIGHT FLOATING NOTIFICATION: CATEGORY MISMATCH & INELIGIBLE PRODUCT ALERT ── */}
      {categoryMismatchError && (
        <div 
          role="alert"
          aria-live="assertive"
          className="fixed top-6 right-6 z-50 max-w-sm sm:max-w-[400px] w-[calc(100vw-2.5rem)] bg-white rounded-2xl border border-[#fecaca] p-4.5 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.18)] font-geist animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#fef2f2] text-[#ef4444] border border-[#fecaca] flex items-center justify-center shrink-0">
              <AlertCircleIcon size={20} strokeWidth={2.2} />
            </div>

            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <h3 className="text-[14.5px] font-bold text-[#09090b] tracking-tight leading-snug">
                  {categoryMismatchError.title}
                </h3>
                <button
                  type="button"
                  onClick={() => setCategoryMismatchError(null)}
                  className="w-6 h-6 rounded-md text-[#71717a] hover:text-[#09090b] hover:bg-[#f4f4f5] transition-colors flex items-center justify-center -mr-1 -mt-0.5 cursor-pointer"
                  aria-label="Close notification"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Tag Badges */}
              <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10.5px] font-semibold bg-[#f4f4f5] text-[#18181b] border border-[#e4e4e7]">
                  Type: {categoryMismatchError.typeLabel}
                </span>
                {categoryMismatchError.isNonProduct ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10.5px] font-semibold bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]">
                    Blog / Content Site
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10.5px] font-semibold bg-[#fff7ed] text-[#c2410c] border border-[#fed7aa]">
                    Out-of-Scope Category
                  </span>
                )}
              </div>

              {/* Message */}
              <p className="text-[12.5px] text-[#3f3f46] leading-relaxed mb-3">
                {categoryMismatchError.message}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#f4f4f5]">
                {!categoryMismatchError.isNonProduct ? (
                  <Link
                    href="/categories"
                    target="_blank"
                    className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-[#09090b] hover:underline"
                  >
                    <span>Browse 24 Categories</span>
                    <ArrowUpRight01Icon size={13} />
                  </Link>
                ) : (
                  <span className="text-[11px] text-[#a1a1aa]">Non-software submissions blocked</span>
                )}
                <button
                  type="button"
                  onClick={() => setCategoryMismatchError(null)}
                  className="px-3 py-1 rounded-lg bg-[#09090b] text-white hover:bg-[#27272a] text-[11.5px] font-semibold transition-colors shadow-xs cursor-pointer ml-auto"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── FLOATING SUBMISSION ERROR NOTIFICATION (VISIBLE ACROSS THE WHOLE PAGE) ── */}
      {error && (
        <div 
          role="alert"
          aria-live="assertive"
          className="fixed top-6 right-6 z-50 max-w-sm sm:max-w-[420px] w-[calc(100vw-2.5rem)] bg-[#09090b] text-white rounded-2xl border border-red-500/40 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] font-geist animate-in fade-in slide-in-from-top-4 duration-200 backdrop-blur-md"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center shrink-0 mt-0.5">
              <AlertCircleIcon size={18} strokeWidth={2.2} />
            </div>
            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-[13.5px] font-bold text-white tracking-tight">Submission Alert</h4>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="w-5 h-5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex items-center justify-center -mr-1 -mt-0.5 cursor-pointer"
                  aria-label="Dismiss error notification"
                >
                  <X size={14} />
                </button>
              </div>
              <p className="text-[12px] text-zinc-300 mt-1 leading-relaxed">
                {error}
              </p>
              <div className="mt-2.5 pt-2 border-t border-zinc-800 flex justify-end">
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] font-medium transition-colors cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── BOTTOM-RIGHT TOAST: ACTIVE SUBMISSION LIMIT (MINIMALIST VERCEL GEIST THEME) ── */}
      {limitNotification && (
        <div 
          role="alert"
          aria-live="assertive"
          className="fixed bottom-6 right-6 z-50 max-w-[380px] w-[calc(100vw-2rem)] bg-white rounded-xl border border-[#e4e4e7] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.08)] font-geist animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <div className="flex items-start gap-2.5">
            {/* Professional Stroke Icon (No solid black box) */}
            <AlertCircleIcon size={18} strokeWidth={1.8} className="text-[#09090b] shrink-0 mt-0.5" />

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-[13px] font-semibold text-[#09090b] tracking-tight">
                  Submission Limit
                </h4>
                <button
                  type="button"
                  onClick={() => setLimitNotification(null)}
                  className="text-[#a1a1aa] hover:text-[#09090b] transition-colors p-0.5 cursor-pointer"
                  aria-label="Close notification"
                >
                  <X size={14} />
                </button>
              </div>

              <p className="text-[12px] text-[#71717a] leading-relaxed mt-1">
                Free accounts are limited to 1 active submission at a time. Your tool <strong className="text-[#09090b] font-medium">"{limitNotification.toolName}"</strong> is currently under review.
              </p>

              <div className="mt-3 pt-2.5 border-t border-[#f4f4f5] flex items-center justify-between text-[11.5px]">
                <Link
                  href="/dashboard"
                  className="font-medium text-[#09090b] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Track in Dashboard</span>
                  <ArrowUpRight01Icon size={12} />
                </Link>
                <button
                  type="button"
                  onClick={() => setLimitNotification(null)}
                  className="text-[#71717a] hover:text-[#09090b] transition-colors cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SUCCESS POPUP MODAL (Centered dialog with backdrop-blur, Geist font, brand styling) ── */}
      {submitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-[#e4e4e7] p-7 sm:p-8 shadow-2xl max-w-[460px] w-full font-geist relative">
            <h2 className="text-[21px] font-bold text-[#09090b] tracking-tight mb-2">
              Submission Received!
            </h2>
            <p className="text-[13px] text-[#71717a] leading-relaxed mb-5 font-normal">
              Your software <strong className="text-[#09090b] font-semibold">{formData.softwareName}</strong> ({itemType.toUpperCase()}) has been submitted successfully and is now queued for editorial verification.
            </p>

            {/* Structured Table */}
            <div className="p-4 bg-[#fafafa] rounded-xl border border-[#e4e4e7] text-[12px] mb-5 space-y-2.5">
              <div className="flex justify-between items-center border-b border-[#e4e4e7]/70 pb-2">
                <span className="text-[#71717a]">Reference ID</span>
                <span className="font-mono font-bold text-[#09090b] bg-white px-2 py-0.5 rounded border border-[#e4e4e7]">
                  {submissionResult?.id}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-[#e4e4e7]/70 pb-2">
                <span className="text-[#71717a]">Listing Category</span>
                <span className="text-[#09090b] font-semibold">{formData.primaryCategory}</span>
              </div>
              <div className="flex justify-between items-center border-b border-[#e4e4e7]/70 pb-2">
                <span className="text-[#71717a]">Submission Plan</span>
                <span className="text-[#09090b] font-semibold">Free (1 Active Tool Limit)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#71717a]">Review Window</span>
                <span className="text-[#09090b] font-semibold">Typically 2–4 weeks, subject to approval</span>
              </div>
            </div>

            <p className="text-[11.5px] text-[#71717a] leading-relaxed mb-6">
              Free accounts are limited to 1 active tool under review. Track live review progress and analytics in your dashboard.
            </p>

            {/* Action Buttons: 2 buttons only! NO "Submit another" */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <Link
                href="/dashboard"
                className="w-full sm:flex-1 inline-flex items-center justify-center h-10 px-4 rounded-xl bg-[#09090b] hover:bg-black/85 text-white font-semibold text-[13px] tracking-tight shadow-xs transition-colors cursor-pointer"
              >
                View in Dashboard
              </Link>
              <Link
                href="/"
                className="w-full sm:flex-1 inline-flex items-center justify-center h-10 px-4 rounded-xl bg-white hover:bg-[#f4f4f5] text-[#09090b] border border-[#e4e4e7] font-semibold text-[13px] tracking-tight transition-colors cursor-pointer"
              >
                Return to Directory
              </Link>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 font-geist">
          {error && (
            <div className="p-4 rounded-xl bg-[#fef2f2] border border-[#fecaca] text-[13px] text-[#991b1b] flex items-start gap-2.5 font-geist">
              <AlertCircleIcon size={18} className="shrink-0 mt-0.5 text-[#ef4444]" />
              <span>{error}</span>
            </div>
          )}

          {/* 3. THE ESSENTIALS (Card with dashed border, 40-char Product Name, 2-column URL & Custom Category Dropdown) */}
          <div className="rounded-2xl border border-dashed border-[#cbd5e1] p-5 sm:p-6 bg-white shadow-2xs space-y-4 font-geist">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#09090b] font-geist">
                3. THE ESSENTIALS
              </div>
              <p className="text-[12px] text-[#71717a] mt-0.5 font-normal font-geist">
                Core identity details needed for directory placement.
              </p>
            </div>

            <hr className="border-[#e4e4e7]" />

            {/* Product Name (40 char limit with counter) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[13px] font-medium text-[#09090b] font-geist">
                  Product Name <span className="text-[#ef4444]">*</span>
                </label>
                <span className="font-geist text-[11px] text-[#a1a1aa] font-normal">
                  {formData.softwareName.length}/40
                </span>
              </div>
              <input
                type="text"
                required
                maxLength={40}
                placeholder="e.g. ScrollLaunch"
                value={formData.softwareName}
                onChange={(e) => setFormData({ ...formData, softwareName: e.target.value.slice(0, 40) })}
                className="w-full h-11 px-3.5 rounded-xl border border-[#e4e4e7] bg-white text-[13.5px] text-[#09090b] placeholder:text-[#a1a1aa] focus:outline-none focus:border-[#09090b] focus:ring-1 focus:ring-[#09090b] transition-all shadow-2xs font-geist font-normal"
              />
            </div>

            {/* Tagline / SEO Title (50-60 characters) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[13px] font-medium text-[#09090b] font-geist">
                  Tagline / SEO Title <span className="text-[#ef4444]">*</span>
                </label>
                <div className="flex items-center gap-1.5 font-geist text-[11px]">
                  <span className={
                    formData.tagline.length >= 50 && formData.tagline.length <= 60
                      ? 'text-[#16a34a] font-medium'
                      : formData.tagline.length > 60
                        ? 'text-[#ea580c] font-medium'
                        : 'text-[#a1a1aa] font-normal'
                  }>
                    {formData.tagline.length}/60
                  </span>
                  <span className="text-[#a1a1aa] font-normal">
                    (50–60 optimal for SEO)
                  </span>
                </div>
              </div>
              <input
                type="text"
                maxLength={80}
                placeholder="SEO title / tagline (50–60 characters with core keywords)"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full h-11 px-3.5 rounded-xl border border-[#e4e4e7] bg-white text-[13.5px] text-[#09090b] placeholder:text-[#a1a1aa] focus:outline-none focus:border-[#09090b] focus:ring-1 focus:ring-[#09090b] transition-all shadow-2xs font-geist font-normal"
              />
            </div>

            {/* SEO Meta Description (150-300 characters) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[13px] font-medium text-[#09090b] font-geist">
                  SEO Meta Description <span className="text-[#ef4444]">*</span>
                </label>
                <div className="flex items-center gap-1.5 font-geist text-[11px]">
                  <span className={
                    formData.description.length >= 150 && formData.description.length <= 300
                      ? 'text-[#16a34a] font-medium'
                      : formData.description.length > 300
                        ? 'text-[#ea580c] font-medium'
                        : 'text-[#a1a1aa] font-normal'
                  }>
                    {formData.description.length}/300
                  </span>
                  <span className="text-[#a1a1aa] font-normal">
                    (150–300 optimal for SEO)
                  </span>
                </div>
              </div>
              <textarea
                required
                rows={4}
                maxLength={500}
                placeholder="Concise SEO description (150–300 characters). Explain key capabilities, target users, and security standards."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3.5 rounded-xl border border-[#e4e4e7] bg-white text-[13.5px] text-[#09090b] placeholder:text-[#a1a1aa] focus:outline-none focus:border-[#09090b] focus:ring-1 focus:ring-[#09090b] transition-all shadow-2xs resize-y font-geist font-normal leading-relaxed"
              />
            </div>

            {/* 2-Column: Website URL (with live dynamic favicon) & Primary Category (Custom Directory Dropdown) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Website URL */}
              <div>
                <label className="text-[13px] font-medium text-[#09090b] block mb-1.5 font-geist">
                  Website URL <span className="text-[#ef4444]">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 pointer-events-none text-[#a1a1aa] flex items-center justify-center w-4 h-4">
                    {formData.websiteUrl && formData.websiteUrl.includes('.') ? (
                      <img
                        src={getGoogleFavicon(formData.websiteUrl)}
                        alt="Favicon"
                        className="w-4 h-4 rounded-xs object-contain"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <Globe className="w-4 h-4 text-[#a1a1aa]" strokeWidth={1.8} />
                    )}
                  </div>
                  <input
                    type="url"
                    required
                    placeholder="https://yourproduct.com"
                    value={formData.websiteUrl}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData(prev => ({ ...prev, websiteUrl: val }));
                      if (!targetUrl) setTargetUrl(val);
                      checkUrlDuplicate(val, setDuplicateWebsiteMatch);
                    }}
                    onBlur={(e) => {
                      checkUrlDuplicate(e.target.value, setDuplicateWebsiteMatch);
                    }}
                    className={`w-full h-11 pl-10 pr-3.5 rounded-xl border bg-white text-[13.5px] text-[#09090b] placeholder:text-[#a1a1aa] focus:outline-none transition-all shadow-2xs font-geist font-normal ${
                      duplicateWebsiteMatch
                        ? 'border-[#ef4444] focus:border-[#ef4444] focus:ring-1 focus:ring-[#ef4444]'
                        : 'border-[#e4e4e7] focus:border-[#09090b] focus:ring-1 focus:ring-[#09090b]'
                    }`}
                  />
                </div>
                {duplicateWebsiteMatch && (
                  <div className="mt-1.5 text-[11.5px] text-[#ef4444] flex items-center gap-1.5 font-medium">
                    <AlertCircleIcon size={14} className="shrink-0" />
                    <span>Already listed as &ldquo;{duplicateWebsiteMatch.name}&rdquo; ({duplicateWebsiteMatch.itemType}).</span>
                    <Link href={duplicateWebsiteMatch.listingPath} target="_blank" className="underline font-semibold ml-0.5">
                      View →
                    </Link>
                  </div>
                )}
              </div>

              {/* Primary Category (Custom Directory Dropdown) */}
              <div>
                <label className="text-[13px] font-medium text-[#09090b] block mb-1.5 font-geist">
                  Primary Category <span className="text-[#ef4444]">*</span>
                </label>
                <div className="relative" ref={categoryDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsCategoryOpen(prev => !prev)}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#e4e4e7] bg-white text-[13.5px] font-medium text-[#09090b] hover:border-[#d4d4d8] transition-all shadow-2xs cursor-pointer flex items-center justify-between"
                    aria-haspopup="listbox"
                    aria-expanded={isCategoryOpen}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      {(() => {
                        const CatIcon = getCategoryIcon(formData.primaryCategory);
                        return <CatIcon size={16} strokeWidth={1.8} className="text-[#09090b] shrink-0" />;
                      })()}
                      <span className="truncate">{categories.find(c => c.slug === formData.primaryCategory)?.name || 'Select Category'}</span>
                      {categories.find(c => c.slug === formData.primaryCategory)?.pillar && (
                        <span className="text-[11px] text-[#71717a] font-normal truncate">({categories.find(c => c.slug === formData.primaryCategory)?.pillar})</span>
                      )}
                    </div>
                    <ChevronDown className={`w-4 h-4 text-[#71717a] transition-transform duration-150 shrink-0 ${isCategoryOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isCategoryOpen && (
                    <div className="absolute left-0 right-0 top-full mt-2 max-h-72 overflow-y-auto rounded-2xl border border-[#e4e4e7] bg-white/95 backdrop-blur-xl p-2 shadow-[0_12px_40px_rgba(0,0,0,0.14)] z-50 space-y-0.5">
                      <div className="p-1 mb-1 border-b border-[#f4f4f5]">
                        <input
                          type="text"
                          placeholder="Filter categories..."
                          value={categorySearchQuery}
                          onChange={(e) => setCategorySearchQuery(e.target.value)}
                          className="w-full h-8 px-2.5 text-[12px] bg-[#fafafa] rounded-lg border border-[#e4e4e7] text-[#09090b] placeholder:text-[#a1a1aa] focus:outline-none focus:border-[#09090b]"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      {categories
                        .filter(c => !categorySearchQuery.trim() || c.name.toLowerCase().includes(categorySearchQuery.toLowerCase()) || c.pillar.toLowerCase().includes(categorySearchQuery.toLowerCase()))
                        .map((c) => {
                          const isSelected = formData.primaryCategory === c.slug;
                          const CatIcon = getCategoryIcon(c.slug);
                          return (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({ ...prev, primaryCategory: c.slug }));
                                setIsCategoryOpen(false);
                                setCategorySearchQuery('');
                              }}
                              className={`w-full text-left px-3 py-2 text-[13px] transition-all flex items-center justify-between cursor-pointer rounded-xl ${
                                isSelected
                                  ? 'bg-[#09090b] text-white font-semibold shadow-xs'
                                  : 'text-[#09090b] hover:bg-black/5 font-medium'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <CatIcon
                                  size={16}
                                  strokeWidth={isSelected ? 2 : 1.7}
                                  className={`shrink-0 ${isSelected ? 'text-white' : 'text-[#71717a]'}`}
                                />
                                <span className="truncate">{c.name}</span>
                                <span className={`text-[10.5px] truncate ${isSelected ? 'text-white/80' : 'text-[#a1a1aa]'}`}>
                                  ({c.pillar})
                                </span>
                              </div>
                              {isSelected && <Check className="w-4 h-4 text-white stroke-[2.5] shrink-0" />}
                            </button>
                          );
                        })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 3. MEDIA ASSETS (Card with dashed border, perfectly even twin upload cards, single upload icons, horizontal lines) */}
          <div className="rounded-2xl border border-dashed border-[#cbd5e1] p-5 sm:p-6 bg-white shadow-2xs space-y-4 font-geist">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#09090b] font-geist">
                4. MEDIA ASSETS
              </div>
              <p className="text-[12.5px] text-[#71717a] mt-0.5 font-normal font-geist">
                Product logo and image screenshots.
              </p>
            </div>

            <hr className="border-[#e4e4e7]" />

            {/* Side-by-Side 2-Column Grid: Left Logo, Right Screenshots (Identical Twin Styling) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Left Column: Product Logo */}
              <div className="flex flex-col justify-between">
                <label className="text-[13px] font-medium text-[#09090b] block mb-2 font-geist">
                  Product Logo <span className="text-[#ef4444] font-bold">*</span> <span className="text-[#71717a] text-[11.5px] font-normal font-geist">(PNG, JPEG, SVG or WebP)</span>
                </label>

                <input
                  type="file"
                  ref={logoFileInputRef}
                  accept="image/png, image/jpeg, image/jpg, image/svg+xml, image/webp"
                  onChange={handleLogoFileChange}
                  className="hidden"
                />

                {formData.logoUrl ? (
                  <div className="p-5 rounded-xl border border-dashed border-[#cbd5e1] bg-white shadow-2xs flex items-center gap-3.5 min-h-[165px]">
                    <div className="w-16 h-16 rounded-xl border border-[#e4e4e7] bg-[#fafafa] flex items-center justify-center shrink-0 overflow-hidden relative">
                      <img src={formData.logoUrl} alt="Logo Preview" className="w-full h-full object-contain p-1" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="text-[13px] font-semibold text-[#09090b] truncate font-geist">Logo Uploaded</div>
                      <div className="text-[11.5px] text-[#71717a] font-geist mt-0.5">Ready for directory placement</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, logoUrl: '' }))}
                      className="p-2 rounded-lg text-[#a1a1aa] hover:text-[#ef4444] hover:bg-[#fef2f2] transition-colors cursor-pointer"
                      title="Remove logo"
                    >
                      <Delete02Icon size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="p-5 rounded-xl border border-dashed border-[#cbd5e1] bg-white shadow-2xs text-center flex flex-col items-center justify-center min-h-[165px]">
                    <div className="text-[#71717a] mb-2 flex items-center justify-center">
                      <Upload01Icon size={20} />
                    </div>
                    <button
                      type="button"
                      onClick={() => logoFileInputRef.current?.click()}
                      className="h-9 px-4 rounded-lg bg-white hover:bg-[#f4f4f5] text-[#09090b] border border-[#e4e4e7] font-medium text-[12.5px] shadow-2xs transition-colors cursor-pointer inline-flex items-center justify-center font-geist"
                    >
                      <span>Upload Logo File</span>
                    </button>
                    <p className="text-[11px] text-[#71717a] mt-2 font-geist">
                      Square format recommended · PNG, JPEG, SVG, WebP
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column: Screenshots / Gallery */}
              <div className="flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[13px] font-medium text-[#09090b] font-geist">
                    Screenshots / Gallery <span className="text-[#71717a] text-[11.5px] font-normal font-geist">(PNG or JPEG only)</span>
                  </label>
                  <span className="text-[11px] text-[#71717a] font-geist">
                    {formData.screenshots.length}/5 added
                  </span>
                </div>

                <div className="p-5 rounded-xl border border-dashed border-[#cbd5e1] bg-white shadow-2xs text-center flex flex-col items-center justify-center min-h-[165px]">
                  <input
                    type="file"
                    ref={screenshotFileInputRef}
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    multiple
                    onChange={handleScreenshotFileChange}
                    className="hidden"
                  />
                  <div className="text-[#71717a] mb-2 flex items-center justify-center">
                    <Upload01Icon size={20} />
                  </div>
                  <button
                    type="button"
                    onClick={() => screenshotFileInputRef.current?.click()}
                    disabled={formData.screenshots.length >= 5}
                    className="h-9 px-4 rounded-lg bg-white hover:bg-[#f4f4f5] text-[#09090b] border border-[#e4e4e7] font-medium text-[12.5px] shadow-2xs transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center justify-center font-geist"
                  >
                    <span>Browse Image Files</span>
                  </button>
                  <p className="text-[11px] text-[#71717a] mt-2 font-geist">
                    Upload PNG or JPEG files · Up to 5 screenshots
                  </p>
                </div>
              </div>
            </div>

            {/* Uploaded Screenshots Gallery - Displayed outside the cards in normal size */}
            {formData.screenshots.length > 0 && (
              <div className="mt-4 pt-3.5 border-t border-[#f4f4f5]">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[12px] font-semibold text-[#09090b] font-geist">
                    Uploaded Screenshots ({formData.screenshots.length}/5)
                  </span>
                  <span className="text-[11px] text-[#71717a] font-geist">
                    Hover to delete
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {formData.screenshots.map((shot, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => setPreviewGalleryIndex(idx)}
                      className="relative rounded-xl border border-[#e4e4e7] bg-[#fafafa] overflow-hidden aspect-video group shadow-2xs hover:border-[#09090b] transition-all cursor-pointer"
                    >
                      <img 
                        src={shot} 
                        alt={`Screenshot ${idx + 1}`} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-200" 
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 rounded-md bg-black/70 text-white text-[10.5px] font-medium font-geist">
                          Click to preview
                        </span>
                      </div>
                      <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-medium text-white font-geist z-10">
                        #{idx + 1}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveScreenshot(idx);
                        }}
                        className="absolute top-1.5 right-1.5 p-1.5 rounded-lg bg-black/70 hover:bg-[#ef4444] text-white opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-sm z-10"
                        title="Delete screenshot"
                      >
                        <Delete02Icon size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Screenshot Gallery Lightbox Modal */}
            {previewGalleryIndex !== null && formData.screenshots[previewGalleryIndex] && (
              <div 
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
                onClick={() => setPreviewGalleryIndex(null)}
              >
                <div 
                  className="relative max-w-2xl w-full flex flex-col items-center bg-[#09090b]/95 border border-white/10 rounded-2xl p-4 sm:p-5 pt-8 shadow-2xl font-geist"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Close button - Red color */}
                  <button
                    type="button"
                    onClick={() => setPreviewGalleryIndex(null)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#ef4444]/15 hover:bg-[#ef4444] text-[#ef4444] hover:text-white border border-[#ef4444]/30 flex items-center justify-center transition-all cursor-pointer z-30 shadow-sm"
                    title="Close (Esc)"
                  >
                    <X size={18} className="stroke-[2.5]" />
                  </button>

                  {/* Main Slide / Image with Left & Right Arrows */}
                  <div className="relative w-full flex items-center justify-center min-h-[240px] max-h-[58vh]">
                    {formData.screenshots.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setPreviewGalleryIndex((prev) => (prev! - 1 + formData.screenshots.length) % formData.screenshots.length)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer z-10 border border-white/20"
                        title="Previous screenshot"
                      >
                        <ChevronLeft size={20} />
                      </button>
                    )}

                    <img
                      src={formData.screenshots[previewGalleryIndex]}
                      alt={`Screenshot ${previewGalleryIndex + 1}`}
                      className="max-h-[55vh] max-w-full rounded-xl object-contain shadow-lg"
                    />

                    {formData.screenshots.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setPreviewGalleryIndex((prev) => (prev! + 1) % formData.screenshots.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer z-10 border border-white/20"
                        title="Next screenshot"
                      >
                        <ChevronRight size={20} />
                      </button>
                    )}
                  </div>

                  {/* Slide Counter Badge */}
                  <div className="mt-3 px-3 py-1 rounded-full bg-white text-[#09090b] text-[11px] font-semibold tracking-wider font-geist shadow-xs">
                    {previewGalleryIndex + 1} / {formData.screenshots.length}
                  </div>

                  {/* Bottom Thumbnail Strip */}
                  {formData.screenshots.length > 1 && (
                    <div className="flex items-center gap-2 mt-3.5 max-w-full overflow-x-auto p-1">
                      {formData.screenshots.map((shot, sIdx) => (
                        <button
                          type="button"
                          key={sIdx}
                          onClick={() => setPreviewGalleryIndex(sIdx)}
                          className={`relative rounded-md overflow-hidden aspect-video w-14 h-9 shrink-0 transition-all cursor-pointer border ${
                            sIdx === previewGalleryIndex
                              ? 'border-white scale-105 shadow-md ring-2 ring-white/40'
                              : 'border-white/20 opacity-50 hover:opacity-100'
                          }`}
                        >
                          <img src={shot} alt={`Thumbnail ${sIdx + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <hr className="border-[#e4e4e7] my-3.5" />

            {/* Video Demo URL with Instant Preview */}
            <div>
              <label className="text-[13px] font-medium text-[#09090b] block mb-1.5 font-geist">
                Video Demo URL <span className="text-[#71717a] text-[11.5px] font-normal font-geist">(Optional)</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 pointer-events-none text-[#a1a1aa]">
                  <PlayIcon size={15} />
                </div>
                <input
                  type="url"
                  placeholder="https://youtube.com/watch?v=... or Loom link"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="w-full h-11 pl-9 pr-3.5 rounded-xl border border-[#e4e4e7] bg-white text-[13.5px] text-[#09090b] placeholder:text-[#a1a1aa] focus:outline-none focus:border-[#09090b] shadow-2xs font-geist font-normal"
                />
              </div>

              {/* Video Preview */}
              {videoEmbed && (
                <div className="mt-3 rounded-xl border border-[#e4e4e7] overflow-hidden bg-black/5 shadow-2xs aspect-video max-w-sm">
                  {videoEmbed.type === 'iframe' ? (
                    <iframe
                      src={videoEmbed.src}
                      title="Video Demo Preview"
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={videoEmbed.src}
                      controls
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 5. PRODUCT FEATURES (Card with dashed border, SoftwareAdvice & SoftwareSuggest tick-mark style, Software/Extension/Plugin only) */}
          {itemType !== 'open-source' && (
            <div className="rounded-2xl border border-dashed border-[#cbd5e1] p-5 sm:p-6 bg-white shadow-2xs space-y-4 font-geist">
              <div>
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#09090b] font-geist">
                    5. KEY PRODUCT FEATURES
                  </div>
                  <button
                    type="button"
                    onClick={() => addFeature()}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#f4f4f5] text-[#09090b] border border-[#e4e4e7] text-[11.5px] font-semibold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs font-geist shrink-0"
                  >
                    <span>+ Add Feature</span>
                  </button>
                </div>
                <p className="text-[12px] text-[#71717a] mt-0.5 font-normal font-geist">
                  Key functional, security, and architectural features with verified tick marks (SoftwareAdvice &amp; SoftwareSuggest style). Auto-filled via AI JSON or manage manually.
                </p>
              </div>

              <hr className="border-[#e4e4e7]" />

              {/* Feature Items List (Clean tick marks, no checkboxes) */}
              {productFeatures.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-[#e4e4e7] bg-[#fafafa] text-center">
                  <p className="text-[12px] text-[#71717a] font-geist font-normal">
                    No features added yet. Click &quot;+ Add Feature&quot;, select from suggested features below, or paste AI JSON above to auto-fill.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {productFeatures.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-[#e4e4e7] bg-white hover:border-[#a1a1aa] transition-all shadow-2xs group"
                    >
                      <div className="w-5 h-5 rounded-full bg-[#09090b] text-white flex items-center justify-center shrink-0 shadow-2xs">
                        <Check size={11} className="stroke-[3]" />
                      </div>
                      <input
                        type="text"
                        value={feat}
                        onChange={(e) => updateFeature(idx, e.target.value)}
                        placeholder="Feature name (e.g. Password Protected Links)"
                        className="flex-1 min-w-0 bg-transparent text-[12.5px] font-medium text-[#09090b] placeholder:text-[#a1a1aa] focus:outline-none font-geist"
                      />
                      <button
                        type="button"
                        onClick={() => removeFeature(idx)}
                        className="w-7 h-7 rounded-lg text-[#a1a1aa] hover:text-[#ef4444] hover:bg-[#fef2f2] transition-colors flex items-center justify-center cursor-pointer shrink-0"
                        title="Remove feature"
                      >
                        <Delete02Icon size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Quick Add Suggestions for Active Category / Type */}
              <div className="pt-2 border-t border-[#f4f4f5]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-[#71717a] uppercase tracking-wider font-geist">
                    {itemType === 'extension' 
                      ? 'Popular Extension Features' 
                      : itemType === 'plugin' 
                        ? 'Popular MCP & Plugin Features' 
                        : `Popular Features for ${categories.find(c => c.slug === formData.primaryCategory)?.name || 'Category'}`}
                  </span>
                  <span className="text-[10.5px] text-[#a1a1aa] font-geist">
                    Click to toggle / add
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeSuggestedFeatures.map((sFeat, sIdx) => {
                    const isAdded = productFeatures.some(f => f.trim().toLowerCase() === sFeat.trim().toLowerCase());
                    return (
                      <button
                        key={sIdx}
                        type="button"
                        onClick={() => toggleSuggestedFeature(sFeat)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11.5px] font-geist transition-all cursor-pointer border ${
                          isAdded
                            ? 'bg-[#09090b] text-white border-[#09090b] font-medium shadow-2xs'
                            : 'bg-[#fafafa] text-[#52525b] border-[#e4e4e7] hover:border-[#a1a1aa] hover:text-[#09090b]'
                        }`}
                      >
                        {isAdded ? (
                          <Check size={11} className="stroke-[3] text-white" />
                        ) : (
                          <span className="text-[#a1a1aa] text-[12px] font-bold">+</span>
                        )}
                        <span>{sFeat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 6. PRICING & LICENSING (Card with dashed border) */}
          <div className="rounded-2xl border border-dashed border-[#cbd5e1] p-5 sm:p-6 bg-white shadow-2xs space-y-4 font-geist">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#09090b] font-geist">
                {itemType !== 'open-source' ? '6. PRICING & LICENSING' : '5. PRICING & LICENSING'}
              </div>
              <p className="text-[12px] text-[#71717a] mt-0.5 font-normal font-geist">
                Pricing model, monthly/yearly plans, and licensing details.
              </p>
            </div>

            <hr className="border-[#e4e4e7]" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-[13px] font-medium text-[#09090b] block mb-1.5 font-geist">
                  Pricing Model <span className="text-[#71717a] text-[11.5px] font-normal font-geist">(Optional)</span>
                </label>
                <select
                  value={formData.pricingModel}
                  onChange={(e) => {
                    const newModel = e.target.value;
                    const isFree = newModel === 'Free' || newModel === 'Open Source';
                    setFormData(prev => ({
                      ...prev,
                      pricingModel: newModel,
                      startingPrice: isFree ? 'Free ($0)' : (prev.startingPrice === 'Free ($0)' ? '$10/mo' : prev.startingPrice),
                      freeTierAvailable: isFree ? true : prev.freeTierAvailable,
                      pricingPlans: isFree ? '' : prev.pricingPlans
                    }));
                    if (isFree) {
                      setPricingTiers([]);
                    }
                  }}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#e4e4e7] bg-white text-[13.5px] text-[#09090b] shadow-2xs cursor-pointer focus:outline-none focus:border-[#09090b] font-geist font-normal"
                >
                  <option value="Free">Free</option>
                  <option value="Freemium">Freemium</option>
                  <option value="Paid">Paid</option>
                  <option value="Open Source">Open Source</option>
                  <option value="Enterprise Quote">Enterprise Quote</option>
                </select>
              </div>

              <div>
                <label className="text-[13px] font-medium text-[#09090b] block mb-1.5 font-geist">
                  Starting Price <span className="text-[#71717a] text-[11.5px] font-normal font-geist">(Optional - e.g. Free, $10/mo)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Free ($0), $10/mo, $14.50 / user / month (optional)"
                  value={formData.startingPrice}
                  onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#e4e4e7] bg-white text-[13.5px] text-[#09090b] shadow-2xs focus:outline-none focus:border-[#09090b] font-geist font-normal"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="flex items-center gap-3 p-3 rounded-xl border border-[#e4e4e7] bg-[#fafafa]">
                <input
                  type="checkbox"
                  id="freeTierAvailable"
                  checked={formData.freeTierAvailable}
                  onChange={(e) => setFormData({ ...formData, freeTierAvailable: e.target.checked })}
                  className="w-4 h-4 rounded text-[#09090b] focus:ring-[#09090b] cursor-pointer"
                />
                <label htmlFor="freeTierAvailable" className="text-[12.5px] text-[#09090b] font-medium cursor-pointer font-geist">
                  Permanent Free Tier Available
                </label>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Free Trial (e.g. 14 Days Free Trial, No CC)"
                  value={formData.freeTrialDays}
                  onChange={(e) => setFormData({ ...formData, freeTrialDays: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#e4e4e7] bg-white text-[13px] text-[#09090b] shadow-2xs focus:outline-none focus:border-[#09090b] font-geist font-normal"
                />
              </div>
            </div>

            <div>
              <label className="text-[13px] font-medium text-[#09090b] block mb-1.5 font-geist">
                Official Pricing Page URL <span className="text-[#71717a] text-[11.5px] font-normal font-geist">(e.g. https://domain.com/pricing)</span>
              </label>
              <input
                type="url"
                placeholder="https://example.com/pricing"
                value={formData.pricingUrl}
                onChange={(e) => setFormData({ ...formData, pricingUrl: e.target.value })}
                className="w-full h-11 px-3.5 rounded-xl border border-[#e4e4e7] bg-white text-[13.5px] text-[#09090b] shadow-2xs focus:outline-none focus:border-[#09090b] font-geist font-normal"
              />
            </div>

            {/* Structured Pricing Plans Tiers (High Readability) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-[13px] font-medium text-[#09090b] block font-geist">
                    Detailed Pricing Plans Breakdown <span className="text-[#71717a] text-[11.5px] font-normal font-geist">(Structured Tiers)</span>
                  </label>
                  <p className="text-[11.5px] text-[#71717a] font-normal mt-0.5 font-geist">
                    Clear breakdown of each tier with price and feature inclusions.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {pricingTiers.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setPricingTiers([]);
                        setFormData(f => ({ ...f, pricingPlans: '' }));
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#fef2f2] text-[#71717a] hover:text-[#ef4444] border border-[#e4e4e7] hover:border-[#fecaca] text-[11.5px] font-medium transition-colors cursor-pointer shadow-2xs font-geist"
                    >
                      Clear Tiers
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={addTier}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#f4f4f5] text-[#09090b] border border-[#e4e4e7] text-[11.5px] font-semibold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs font-geist shrink-0"
                  >
                    <span>+ Add Tier</span>
                  </button>
                </div>
              </div>

              {(formData.pricingModel === 'Free' || formData.pricingModel === 'Open Source') && pricingTiers.length > 0 && (
                <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#fafafa] border border-[#e4e4e7] text-[12px] font-geist">
                  <span className="text-[#71717a]">
                    This product is marked as <strong className="text-[#09090b] font-medium">{formData.pricingModel}</strong>. If it has no paid tiers, you can clear them.
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setPricingTiers([]);
                      setFormData(f => ({ ...f, pricingPlans: '' }));
                    }}
                    className="text-[#09090b] underline font-medium hover:text-black ml-2 cursor-pointer shrink-0"
                  >
                    Clear All
                  </button>
                </div>
              )}

              <div className="space-y-2.5">
                {pricingTiers.length === 0 ? (
                  <div className="p-4 rounded-xl border border-dashed border-[#e4e4e7] bg-[#fafafa] text-center">
                    {formData.pricingModel === 'Free' || formData.pricingModel === 'Open Source' || itemType === 'extension' || itemType === 'open-source' ? (
                      <div className="space-y-1">
                        <p className="text-[12.5px] text-[#09090b] font-geist font-medium">
                          ✓ Marked as Free / Open Source — No pricing tiers required.
                        </p>
                        <p className="text-[11.5px] text-[#71717a] font-geist font-normal">
                          If this tool offers optional commercial tiers or Pro add-ons, click &quot;+ Add Tier&quot; to define them.
                        </p>
                      </div>
                    ) : (
                      <p className="text-[12px] text-[#71717a] font-geist font-normal">
                        No pricing tiers added yet. Click &quot;+ Add Tier&quot; or paste your AI JSON above to auto-fill.
                      </p>
                    )}
                  </div>
                ) : (
                  pricingTiers.map((tier, idx) => (
                    <div key={idx} className="p-3 rounded-xl border border-[#e4e4e7] bg-white shadow-2xs flex flex-col sm:flex-row items-start sm:items-center gap-2.5">
                      <div className="flex items-center gap-2 w-full sm:w-[150px] shrink-0">
                        <span className="w-5 h-5 rounded-full bg-[#09090b] text-white text-[10px] font-geist font-bold flex items-center justify-center shrink-0 shadow-2xs">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          placeholder="Plan (e.g. Pro)"
                          value={tier.name}
                          onChange={(e) => updateTier(idx, 'name', e.target.value)}
                          className="w-full h-8 px-2.5 rounded-lg border border-[#e4e4e7] text-[12.5px] text-[#09090b] font-semibold focus:outline-none focus:border-[#09090b] font-geist"
                        />
                      </div>

                      <div className="w-full sm:w-[130px] shrink-0">
                        <input
                          type="text"
                          placeholder="Price (e.g. $12/mo)"
                          value={tier.price}
                          onChange={(e) => updateTier(idx, 'price', e.target.value)}
                          className="w-full h-8 px-2.5 rounded-lg border border-[#e4e4e7] text-[12px] text-[#09090b] font-geist focus:outline-none focus:border-[#09090b]"
                        />
                      </div>

                      <div className="flex-1 w-full flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Features, storage limits, seats..."
                          value={tier.features}
                          onChange={(e) => updateTier(idx, 'features', e.target.value)}
                          className="w-full h-8 px-2.5 rounded-lg border border-[#e4e4e7] text-[12px] text-[#09090b] focus:outline-none focus:border-[#09090b] font-geist"
                        />

                        <button
                          type="button"
                          onClick={() => removeTier(idx)}
                          className="w-8 h-8 rounded-lg text-[#a1a1aa] hover:text-[#ef4444] hover:bg-[#fef2f2] transition-colors flex items-center justify-center shrink-0 cursor-pointer"
                          title="Remove tier"
                        >
                          <Delete02Icon size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Collapsible raw text area */}
              <div className="pt-1">
                <details className="text-[11.5px] text-[#71717a] group">
                  <summary className="cursor-pointer hover:text-[#09090b] font-medium transition-colors select-none font-geist">
                    ▸ View / Edit as raw text
                  </summary>
                  <textarea
                    rows={3}
                    value={formData.pricingPlans}
                    onChange={(e) => {
                      setFormData({ ...formData, pricingPlans: e.target.value });
                    }}
                    className="w-full mt-2 p-2.5 rounded-xl border border-[#e4e4e7] bg-[#fafafa] font-geist text-[11.5px] text-[#09090b] focus:outline-none focus:border-[#09090b] shadow-2xs resize-y"
                  />
                </details>
              </div>
            </div>
          </div>

          {/* ALTERNATIVES & INTEGRATIONS (Card with dashed border, 2-Column Grid: Left Alternatives, Right Integrations) */}
          <div className="rounded-2xl border border-dashed border-[#cbd5e1] p-5 sm:p-6 bg-white shadow-2xs space-y-4 font-geist">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#09090b] font-geist">
                {itemType !== 'open-source' ? '7. ALTERNATIVES & INTEGRATIONS' : '6. ALTERNATIVES & INTEGRATIONS'}
              </div>
              <p className="text-[12px] text-[#71717a] mt-0.5 font-normal font-geist">
                Search our verified software database and ecosystem integrations with live brand favicons.
              </p>
            </div>

            <hr className="border-[#e4e4e7]" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Left Column: Alternatives Auto-Suggest */}
              <div className="relative">
                <label className="text-[13px] font-medium text-[#09090b] block mb-1.5 font-geist">
                  Alternatives (Competitors or Similar Tools)
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 pointer-events-none text-[#a1a1aa]">
                    <Search01Icon size={15} />
                  </div>
                  <input
                    type="text"
                    placeholder="Search competitors (e.g. DocSend, Box, Tresorit)..."
                    value={altSearchQuery}
                    onFocus={() => setAltDropdownOpen(true)}
                    onChange={(e) => {
                      setAltSearchQuery(e.target.value);
                      setAltDropdownOpen(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (altParsedTool) {
                          addAlternative({ name: altParsedTool.name, domain: altParsedTool.domain });
                        }
                      }
                    }}
                    className="w-full h-11 pl-9 pr-3.5 rounded-xl border border-[#e4e4e7] bg-white text-[13.5px] text-[#09090b] placeholder:text-[#a1a1aa] focus:outline-none focus:border-[#09090b] shadow-2xs font-geist font-normal"
                  />
                </div>

                {/* Floating Dropdown for Alternatives */}
                {altDropdownOpen && altSearchQuery.trim() && (
                  <div className="absolute z-30 mt-1 w-full bg-white rounded-xl border border-[#e4e4e7] shadow-lg max-h-60 overflow-y-auto py-1.5 font-geist">
                    {filteredAlternatives.length > 0 ? (
                      filteredAlternatives.map(tool => (
                        <button
                          type="button"
                          key={tool.id}
                          onClick={() => addAlternative({ name: tool.name, domain: tool.websiteUrl })}
                          className="w-full px-3.5 py-2 flex items-center gap-2.5 hover:bg-[#f4f4f5] text-left transition-colors cursor-pointer"
                        >
                          <ToolItemIcon name={tool.name} domain={tool.websiteUrl} className="w-4 h-4" />
                          <div className="flex-1 min-w-0">
                            <div className="text-[13px] font-semibold text-[#09090b] leading-none font-geist">{tool.name}</div>
                            <div className="text-[10.5px] text-[#71717a] mt-0.5 capitalize font-geist font-normal">{tool.primaryCategory.replace(/-/g, ' ')}</div>
                          </div>
                        </button>
                      ))
                    ) : null}

                    {altParsedTool && (
                      <button
                        type="button"
                        onClick={() => addAlternative({ name: altParsedTool.name, domain: altParsedTool.domain })}
                        className="w-full px-3.5 py-2.5 flex items-center gap-2.5 hover:bg-[#fafafa] text-left transition-colors cursor-pointer border-t border-[#f4f4f5]"
                      >
                        <ToolItemIcon name={altParsedTool.name} domain={altParsedTool.domain} className="w-4 h-4" />
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] font-semibold text-[#09090b] leading-none font-geist">
                            {altParsedTool.name}
                          </div>
                          <div className="text-[10.5px] text-[#71717a] mt-0.5 font-geist font-normal">
                            {altParsedTool.domain} · Add as alternative tool
                          </div>
                        </div>
                        <span className="text-[11px] font-semibold text-[#09090b] bg-[#f4f4f5] px-2 py-0.5 rounded-md shrink-0">
                          + Add
                        </span>
                      </button>
                    )}
                  </div>
                )}

                {/* Selected Alternatives Pills */}
                {formData.alternatives.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2.5">
                    {formData.alternatives.map(alt => (
                      <span 
                        key={alt.name} 
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#e4e4e7] shadow-2xs text-[12px] text-[#09090b] font-geist"
                      >
                        <ToolItemIcon name={alt.name} domain={alt.domain} />
                        <span className="font-medium font-geist">{alt.name}</span>
                        <button
                          type="button"
                          onClick={() => removeAlternative(alt.name)}
                          className="text-[#a1a1aa] hover:text-[#ef4444] transition-colors cursor-pointer ml-0.5"
                        >
                          <Delete02Icon size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Integrations Auto-Suggest */}
              <div className="relative">
                <label className="text-[13px] font-medium text-[#09090b] block mb-1.5 font-geist">
                  Integrations (Compatible Tools & Platforms)
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 pointer-events-none text-[#a1a1aa]">
                    <Search01Icon size={15} />
                  </div>
                  <input
                    type="text"
                    placeholder="Search integrations (e.g. Slack, Google Drive, AWS)..."
                    value={integrationSearchQuery}
                    onFocus={() => setIntegrationDropdownOpen(true)}
                    onChange={(e) => {
                      setIntegrationSearchQuery(e.target.value);
                      setIntegrationDropdownOpen(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (integrationParsedTool) {
                          addIntegration({ name: integrationParsedTool.name, domain: integrationParsedTool.domain });
                        }
                      }
                    }}
                    className="w-full h-11 pl-9 pr-3.5 rounded-xl border border-[#e4e4e7] bg-white text-[13.5px] text-[#09090b] placeholder:text-[#a1a1aa] focus:outline-none focus:border-[#09090b] shadow-2xs font-geist font-normal"
                  />
                </div>

                {/* Floating Dropdown for Integrations */}
                {integrationDropdownOpen && integrationSearchQuery.trim() && (
                  <div className="absolute z-30 mt-1 w-full bg-white rounded-xl border border-[#e4e4e7] shadow-lg max-h-60 overflow-y-auto py-1.5 font-geist">
                    {filteredIntegrations.length > 0 ? (
                      filteredIntegrations.map(integ => (
                        <button
                          type="button"
                          key={integ.name}
                          onClick={() => addIntegration(integ)}
                          className="w-full px-3.5 py-2 flex items-center gap-2.5 hover:bg-[#f4f4f5] text-left transition-colors cursor-pointer"
                        >
                          <ToolItemIcon name={integ.name} domain={integ.domain} className="w-4 h-4" />
                          <span className="text-[13px] font-medium text-[#09090b] font-geist">{integ.name}</span>
                        </button>
                      ))
                    ) : null}

                    {integrationParsedTool && (
                      <button
                        type="button"
                        onClick={() => addIntegration({ name: integrationParsedTool.name, domain: integrationParsedTool.domain })}
                        className="w-full px-3.5 py-2.5 flex items-center gap-2.5 hover:bg-[#fafafa] text-left transition-colors cursor-pointer border-t border-[#f4f4f5]"
                      >
                        <ToolItemIcon name={integrationParsedTool.name} domain={integrationParsedTool.domain} className="w-4 h-4" />
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] font-semibold text-[#09090b] leading-none font-geist">
                            {integrationParsedTool.name}
                          </div>
                          <div className="text-[10.5px] text-[#71717a] mt-0.5 font-geist font-normal">
                            {integrationParsedTool.domain} · Add integration
                          </div>
                        </div>
                        <span className="text-[11px] font-semibold text-[#09090b] bg-[#f4f4f5] px-2 py-0.5 rounded-md shrink-0">
                          + Add
                        </span>
                      </button>
                    )}
                  </div>
                )}

                {/* Selected Integrations Pills */}
                {formData.integrations.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2.5">
                    {formData.integrations.map(integ => (
                      <span 
                        key={integ.name} 
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#e4e4e7] shadow-2xs text-[12px] text-[#09090b] font-geist"
                      >
                        <ToolItemIcon name={integ.name} domain={integ.domain} />
                        <span className="font-medium font-geist">{integ.name}</span>
                        <button
                          type="button"
                          onClick={() => removeIntegration(integ.name)}
                          className="text-[#a1a1aa] hover:text-[#ef4444] transition-colors cursor-pointer ml-0.5"
                        >
                          <Delete02Icon size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 6. TYPE-SPECIFIC FIELDS (Card with dashed border) */}
          {itemType === 'open-source' && (
            <div className="rounded-2xl border border-dashed border-[#cbd5e1] p-5 sm:p-6 bg-white shadow-2xs space-y-4 font-geist">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#09090b] font-geist">
                  7. OPEN SOURCE REPOSITORY & LICENSE
                </div>
                <p className="text-[12px] text-[#71717a] mt-0.5 font-normal font-geist">
                  Repository access and open source license declaration.
                </p>
              </div>

              <hr className="border-[#e4e4e7]" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[13px] font-medium text-[#09090b] block mb-1.5 font-geist">
                    Repository URL <span className="text-[#ef4444]">*</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/org/repo"
                    value={formData.repositoryUrl}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({ ...formData, repositoryUrl: val });
                      checkUrlDuplicate(val, setDuplicateRepoMatch);
                    }}
                    onBlur={(e) => checkUrlDuplicate(e.target.value, setDuplicateRepoMatch)}
                    className={`w-full h-11 px-3.5 rounded-xl border bg-white text-[13.5px] text-[#09090b] shadow-2xs font-geist font-normal focus:outline-none ${
                      duplicateRepoMatch
                        ? 'border-[#ef4444] focus:border-[#ef4444]'
                        : 'border-[#e4e4e7] focus:border-[#09090b]'
                    }`}
                  />
                  {duplicateRepoMatch && (
                    <div className="mt-1.5 text-[11.5px] text-[#ef4444] flex items-center gap-1.5 font-medium">
                      <AlertCircleIcon size={14} className="shrink-0" />
                      <span>Already listed under &ldquo;{duplicateRepoMatch.name}&rdquo; ({duplicateRepoMatch.itemType}).</span>
                      <Link href={duplicateRepoMatch.listingPath} target="_blank" className="underline font-semibold ml-0.5">
                        View →
                      </Link>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-[13px] font-medium text-[#09090b] block mb-1.5 font-geist">
                    Source Code License <span className="text-[#ef4444]">*</span>
                  </label>
                  <select
                    value={formData.sourceCodeLicense}
                    onChange={(e) => setFormData({ ...formData, sourceCodeLicense: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#e4e4e7] bg-white text-[13.5px] text-[#09090b] shadow-2xs cursor-pointer font-geist font-normal focus:outline-none focus:border-[#09090b]"
                  >
                    {COMMON_LICENSES.map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {itemType === 'extension' && (
            <div className="rounded-2xl border border-dashed border-[#cbd5e1] p-5 sm:p-6 bg-white shadow-2xs space-y-4 font-geist">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#09090b] font-geist">
                  8. BROWSER EXTENSION SPECIFICATIONS
                </div>
                <p className="text-[12px] text-[#71717a] mt-0.5 font-normal font-geist">
                  Store listing link and supported browser engines.
                </p>
              </div>

              <hr className="border-[#e4e4e7]" />

              <div>
                <label className="text-[13px] font-medium text-[#09090b] block mb-1.5 font-geist">
                  Extension Store URL <span className="text-[#ef4444]">*</span>
                </label>
                <input
                  type="url"
                  placeholder="https://chromewebstore.google.com/detail/..."
                  value={formData.extensionStoreUrl}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({ ...formData, extensionStoreUrl: val });
                    checkUrlDuplicate(val, setDuplicateExtMatch);
                  }}
                  onBlur={(e) => checkUrlDuplicate(e.target.value, setDuplicateExtMatch)}
                  className={`w-full h-11 px-3.5 rounded-xl border bg-white text-[13.5px] text-[#09090b] shadow-2xs font-geist font-normal focus:outline-none ${
                    duplicateExtMatch
                      ? 'border-[#ef4444] focus:border-[#ef4444]'
                      : 'border-[#e4e4e7] focus:border-[#09090b]'
                  }`}
                />
                {duplicateExtMatch && (
                  <div className="mt-1.5 text-[11.5px] text-[#ef4444] flex items-center gap-1.5 font-medium">
                    <AlertCircleIcon size={14} className="shrink-0" />
                    <span>Already listed under &ldquo;{duplicateExtMatch.name}&rdquo; ({duplicateExtMatch.itemType}).</span>
                    <Link href={duplicateExtMatch.listingPath} target="_blank" className="underline font-semibold ml-0.5">
                      View →
                    </Link>
                  </div>
                )}
              </div>

              <div>
                <label className="text-[13px] font-medium text-[#09090b] block mb-1.5 font-geist">
                  Browser Compatibility <span className="text-[#ef4444]">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_BROWSERS.map(b => {
                    const active = formData.browserCompatibility.includes(b);
                    const domain = BROWSER_FAVICON_DOMAINS[b] || `${b.toLowerCase()}.com`;
                    return (
                      <button
                        type="button"
                        key={b}
                        onClick={() => toggleBrowser(b)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-all cursor-pointer font-geist ${
                          active
                            ? 'bg-white text-[#09090b] border border-[#e4e4e7] shadow-xs'
                            : 'bg-white text-[#71717a] border border-[#e4e4e7] hover:border-[#a1a1aa]'
                        }`}
                      >
                        <img
                          src={`/icons/browsers/${b.toLowerCase()}.png`}
                          alt={b}
                          className="w-3.5 h-3.5 rounded-full object-contain shrink-0"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=32`;
                          }}
                        />
                        <span>{b}</span>
                        {active && <Check className="w-3 h-3 text-[#09090b] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {itemType === 'plugin' && (
            <div className="rounded-2xl border border-dashed border-[#cbd5e1] p-5 sm:p-6 bg-white shadow-2xs space-y-4 font-geist">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#09090b] font-geist">
                  8. MODEL CONTEXT PROTOCOL (MCP) RUNTIME
                </div>
                <p className="text-[12px] text-[#71717a] mt-0.5 font-normal font-geist">
                  Package distribution and supported client runtimes.
                </p>
              </div>

              <hr className="border-[#e4e4e7]" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[13px] font-medium text-[#09090b] block mb-1.5 font-geist">
                    Package / Repository URL <span className="text-[#ef4444]">*</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/modelcontextprotocol/servers"
                    value={formData.packageUrl}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({ ...formData, packageUrl: val });
                      checkUrlDuplicate(val, setDuplicatePkgMatch);
                    }}
                    onBlur={(e) => checkUrlDuplicate(e.target.value, setDuplicatePkgMatch)}
                    className={`w-full h-11 px-3.5 rounded-xl border bg-white text-[13.5px] text-[#09090b] shadow-2xs font-geist font-normal focus:outline-none ${
                      duplicatePkgMatch
                        ? 'border-[#ef4444] focus:border-[#ef4444]'
                        : 'border-[#e4e4e7] focus:border-[#09090b]'
                    }`}
                  />
                  {duplicatePkgMatch && (
                    <div className="mt-1.5 text-[11.5px] text-[#ef4444] flex items-center gap-1.5 font-medium">
                      <AlertCircleIcon size={14} className="shrink-0" />
                      <span>Already listed under &ldquo;{duplicatePkgMatch.name}&rdquo; ({duplicatePkgMatch.itemType}).</span>
                      <Link href={duplicatePkgMatch.listingPath} target="_blank" className="underline font-semibold ml-0.5">
                        View →
                      </Link>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-[13px] font-medium text-[#09090b] block mb-1.5 font-geist">
                    Transport Protocol <span className="text-[#ef4444]">*</span>
                  </label>
                  <select
                    value={formData.mcpProtocol}
                    onChange={(e) => setFormData({ ...formData, mcpProtocol: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#e4e4e7] bg-white text-[13.5px] text-[#09090b] shadow-2xs cursor-pointer font-geist font-normal focus:outline-none focus:border-[#09090b]"
                  >
                    {MCP_PROTOCOLS.map(p => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[13px] font-medium text-[#09090b] block mb-1.5 font-geist">
                  Supported AI Platforms
                </label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_AI_PLATFORMS.map(p => {
                    const active = formData.mcpPlatforms.includes(p);
                    const domain = AI_PLATFORM_FAVICON_DOMAINS[p] || `${p.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
                    return (
                      <button
                        type="button"
                        key={p}
                        onClick={() => togglePlatform(p)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-all cursor-pointer font-geist ${
                          active
                            ? 'bg-white text-[#09090b] border border-[#e4e4e7] shadow-xs'
                            : 'bg-white text-[#71717a] border border-[#e4e4e7] hover:border-[#a1a1aa]'
                        }`}
                      >
                        <img
                          src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=32`}
                          alt={p}
                          className="w-3.5 h-3.5 rounded-full object-contain shrink-0"
                          onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                        />
                        <span>{p}</span>
                        {active && <Check className="w-3 h-3 text-[#09090b] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-[13px] font-medium text-[#09090b] block mb-1.5 font-geist">
                  Sample Configuration Snippet (JSON)
                </label>
                <textarea
                  rows={4}
                  value={formData.mcpConfigSnippet}
                  onChange={(e) => setFormData({ ...formData, mcpConfigSnippet: e.target.value })}
                  className="w-full p-3 rounded-xl border border-[#e4e4e7] bg-[#fafafa] font-mono text-[11.5px] text-[#09090b] shadow-2xs focus:outline-none focus:border-[#09090b]"
                />
              </div>
            </div>
          )}

          {/* VERIFICATION & CONTACT (Card with dashed border) */}
          <div className="rounded-2xl border border-dashed border-[#cbd5e1] p-5 sm:p-6 bg-white shadow-2xs space-y-4 font-geist">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#09090b] font-geist">
                {itemType === 'software' || itemType === 'open-source' ? '8. VERIFICATION & CONTACT' : '9. VERIFICATION & CONTACT'}
              </div>
              <p className="text-[12px] text-[#71717a] mt-0.5 font-normal font-geist">
                Official contact for editorial verification and listing confirmation.
              </p>
            </div>

            <hr className="border-[#e4e4e7]" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-[13px] font-medium text-[#09090b] block mb-1.5 font-geist">
                  Official Contact Email <span className="text-[#ef4444]">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="contact@company.com"
                  value={formData.submitterEmail}
                  onChange={(e) => setFormData({ ...formData, submitterEmail: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#e4e4e7] bg-white text-[13.5px] text-[#09090b] shadow-2xs font-geist font-normal focus:outline-none focus:border-[#09090b]"
                />
              </div>

              <div>
                <label className="text-[13px] font-medium text-[#09090b] block mb-1.5 font-geist">
                  Phone / Mobile Number (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#e4e4e7] bg-white text-[13.5px] text-[#09090b] shadow-2xs font-geist font-normal focus:outline-none focus:border-[#09090b]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-[13px] font-medium text-[#09090b] block mb-1.5 font-geist">
                  Submitter Name
                </label>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.submitterName}
                  onChange={(e) => setFormData({ ...formData, submitterName: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#e4e4e7] bg-white text-[13.5px] text-[#09090b] shadow-2xs font-geist font-normal focus:outline-none focus:border-[#09090b]"
                />
              </div>

              <div>
                <label className="text-[13px] font-medium text-[#09090b] block mb-1.5 font-geist">
                  Your Relationship
                </label>
                <select
                  value={formData.relationship}
                  onChange={(e) => setFormData({ ...formData, relationship: e.target.value as any })}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#e4e4e7] bg-white text-[13.5px] text-[#09090b] shadow-2xs cursor-pointer font-geist font-normal focus:outline-none focus:border-[#09090b]"
                >
                  <option value="Founder / Co-Founder">Founder / Co-Founder</option>
                  <option value="CEO / Executive Leadership">CEO / Executive Leadership</option>
                  <option value="Lead Developer / Engineer">Lead Developer / Software Engineer</option>
                  <option value="Product Manager / Head of Product">Product Manager / Head of Product</option>
                  <option value="Marketing / Growth / DevRel">Marketing / Growth / DevRel</option>
                  <option value="Core Team Member">Core Team Member</option>
                  <option value="Authorized Agency / PR">Authorized Agency / PR Representative</option>
                  <option value="Open Source Maintainer">Open Source Maintainer / Core Contributor</option>
                  <option value="Independent User / Reviewer">Independent User / Community Reviewer</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2.5 text-[12.5px] text-[#71717a] cursor-pointer font-geist font-normal">
                <input
                  type="checkbox"
                  required
                  checked={formData.agreement}
                  onChange={(e) => setFormData({ ...formData, agreement: e.target.checked })}
                  className="w-4 h-4 mt-0.5 rounded border-[#e4e4e7] text-[#09090b] focus:ring-[#09090b]"
                />
                <span className="leading-relaxed">
                  I certify that the information provided is factual and accurate. I understand that SecureTools conducts independent editorial verification before publication.
                </span>
              </label>
            </div>
          </div>

          {/* Submit Action Button & Inline Error Alert */}
          {error && (
            <div className="p-4 rounded-xl bg-[#fef2f2] border border-[#fecaca] text-[13px] text-[#991b1b] flex items-start gap-2.5 font-geist animate-in fade-in slide-in-from-top-1 duration-200">
              <AlertCircleIcon size={18} className="shrink-0 mt-0.5 text-[#ef4444]" />
              <div className="flex-1 min-w-0">
                <strong className="font-semibold block text-[13px] mb-0.5 text-[#991b1b]">Submission Error:</strong>
                <span className="leading-relaxed">{error}</span>
              </div>
            </div>
          )}

          <div className="pt-2 font-geist">
            <button
              type="submit"
              disabled={submitting}
              className="w-full h-12 rounded-xl bg-[#09090b] hover:bg-[#27272a] text-white font-semibold text-[14px] tracking-tight shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 font-geist"
            >
              <span>{submitting ? 'Submitting for Review...' : 'Submit Listing for Review'}</span>
              <ArrowRight01Icon size={16} />
            </button>
          </div>
        </form>

      {/* Floating Pill Progress Bar (Floating 30px above bottom, centered, rounded pill, matching Screenshot 2) */}
      {!submitted && (
        <div className="fixed bottom-[30px] left-1/2 -translate-x-1/2 z-40 w-auto min-w-[280px] max-w-[340px] h-[40px] px-3.5 sm:px-4 rounded-full bg-[#18181b] text-white shadow-[0_12px_30px_rgba(0,0,0,0.35)] border border-white/10 flex items-center justify-between gap-3 backdrop-blur-md select-none font-geist">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={`w-2 h-2 rounded-full shrink-0 transition-colors ${
                completionPercentage > 0 ? 'bg-[#22c55e] animate-pulse' : 'bg-[#71717a]'
              }`}
            />
            <span className="text-[12px] font-semibold text-white/95 whitespace-nowrap">
              {completionPercentage}% Completed
            </span>
          </div>

          <div className="w-14 sm:w-16 h-1.5 bg-white/20 rounded-full overflow-hidden shrink-0">
            <div 
              className="h-full bg-white rounded-full transition-all duration-300 ease-out"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>

          <button
            type="button"
            onClick={() => {
              const formEl = document.querySelector('form');
              if (formEl) {
                if (typeof formEl.requestSubmit === 'function') {
                  formEl.requestSubmit();
                } else {
                  formEl.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                }
              }
            }}
            disabled={submitting}
            className="h-7 px-3 rounded-full bg-white hover:bg-[#f4f4f5] text-[#09090b] text-[11.5px] font-semibold transition-colors flex items-center gap-1 shadow-xs cursor-pointer shrink-0 disabled:opacity-40"
          >
            <span>{completionPercentage === 100 ? 'Submit ✓' : 'Submit →'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
