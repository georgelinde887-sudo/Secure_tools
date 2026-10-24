'use client';

import React, { useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Check, Mail, Plus, X } from 'lucide-react';
import {
  FileEditIcon,
  UserGroupIcon,
  WorkflowCircle01Icon,
  Briefcase01Icon,
} from 'hugeicons-react';

const acceptedTypes = [
  {
    icon: FileEditIcon,
    title: 'Guest Posts',
    desc: 'Original, informative articles about software tools, cybersecurity, or document security relevant to our directory.',
  },
  {
    icon: UserGroupIcon,
    title: 'Mutual Collaborations',
    desc: 'Exchange guest articles with relevant technology or software websites. We write for you, you write for us.',
  },
  {
    icon: WorkflowCircle01Icon,
    title: 'Link Partnerships',
    desc: 'Contextual, editorially relevant link placements within existing or new content. Subject to editorial review.',
  },
  {
    icon: Briefcase01Icon,
    title: 'Content Partnerships',
    desc: 'Tool comparisons, security tutorials, expert reviews, and educational resources that add genuine value to our readers.',
  },
];


const notAccepted = [
  'Gambling, betting, or casino-related content',
  'Adult or explicit content of any kind',
  'Malware, hacking tools, or illegal software promotion',
  'Cryptocurrency scams, MLM schemes, or get-rich-quick content',
  'Content unrelated to software, technology, or cybersecurity',
];

const guidelines = [
  { label: 'Word Count', value: 'Minimum 800 words. We prefer 1,200–2,000 words for depth.' },
  { label: 'Originality', value: 'Content must be 100% original and not published elsewhere.' },
  { label: 'Tone', value: 'Practical and informative. Avoid excessive promotional language.' },
  { label: 'Links', value: 'Up to 2 contextual do-follow links to your website or product.' },
  { label: 'Format', value: 'Submit in Google Docs or plain Markdown. Include a short bio.' },
  { label: 'Images', value: 'Include relevant screenshots or diagrams where applicable.' },
  { label: 'Ownership', value: 'You must own or have rights to any images submitted.' },
  { label: 'Review', value: 'All submissions are reviewed by our editorial team before publication.' },
];

const faqs = [
  {
    q: 'How do I submit a guest post or collaboration proposal?',
    a: 'Email us at contact@securetools.live with your pitch, a brief outline, and 2–3 links to previous writing samples. We will get back to you within 5–7 business days.',
  },
  {
    q: 'What kind of tools or topics are most relevant to SecureTools?',
    a: 'We focus on document security, file sharing, encrypted storage, VDRs, electronic signatures, PDF tools, browser extensions, and MCP integrations. If your content fits our category taxonomy, it is a strong candidate.',
  },
  {
    q: 'Can I include links to my product or website in my article?',
    a: 'Yes. Accepted posts can include up to 2 relevant, contextual do-follow links to your website or product page.',
  },
  {
    q: 'Do you accept AI-generated content?',
    a: 'We accept human-written content only. AI-assisted drafting is fine as long as the article is substantially written and edited by a human expert.',
  },
  {
    q: 'Can I republish my article elsewhere after it is published here?',
    a: 'We require first-publish rights. After publication you may share a canonical link back to us, but full republication elsewhere is not permitted.',
  },
  {
    q: 'How do link exchange and mutual collaborations work?',
    a: 'For mutual collaborations, we exchange guest articles — you publish a relevant article on our site and we contribute one to yours. For link partnerships, reach out with the proposed placement context and URL for editorial review.',
  },
];

export default function WriteForUsClient() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 font-geist">
      <div className="mb-4">
        <Breadcrumbs items={[{ label: 'Write for Us' }]} />
      </div>

      {/* Hero */}
      <div className="mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#09090b] tracking-tight mb-2">
          Write for Us
        </h1>
        <p className="text-[14px] text-[#52525b] leading-relaxed">
          Share your knowledge. Grow together.
        </p>
        <p className="text-[13.5px] text-[#71717a] leading-relaxed mt-2 max-w-2xl">
          Have insights about document security, file sharing tools, browser extensions, or MCP integrations?
          We welcome guest posts, mutual collaborations, and relevant link partnerships from developers,
          founders, and security professionals whose content aligns with our directory.
        </p>
      </div>

      {/* What We Accept */}
      <section className="mb-10">
        <h2 className="text-[15px] font-semibold text-[#09090b] mb-4 tracking-tight">
          What We Accept
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {acceptedTypes.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group bg-white p-4.5 rounded-2xl border border-[#e4e4e7] hover:border-[#d4d4d8] hover:-translate-y-0.5 hover:shadow-xs transition-all duration-150 flex flex-col"
            >
              <div className="flex items-center gap-3 mb-2.5">
                <div className="w-9 h-9 rounded-xl border border-[#e4e4e7] bg-white text-[#71717a] flex items-center justify-center group-hover:border-[#09090b] group-hover:text-[#09090b] transition-all shrink-0">
                  <Icon size={18} strokeWidth={1.8} />
                </div>
                <p className="text-[13.5px] font-bold text-[#09090b]">{title}</p>
              </div>
              <p className="text-[12px] text-[#71717a] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Topics — clean table */}
      <section className="mb-10">
        <h2 className="text-[15px] font-semibold text-[#09090b] mb-1 tracking-tight">
          Topics You Can Write About
        </h2>
        <p className="text-[12.5px] text-[#71717a] mb-4 leading-relaxed">
          Content must be relevant to our directory categories. We cover the following areas:
        </p>
        <div className="rounded-xl border border-[#e4e4e7] overflow-hidden">
          <table className="w-full text-[12.5px]">
            <thead>
              <tr className="bg-[#fafafa] border-b border-[#e4e4e7]">
                <th className="text-left px-4 py-2.5 font-semibold text-[#09090b] text-[11px] uppercase tracking-wider w-1/2">Topic</th>
                <th className="text-left px-4 py-2.5 font-semibold text-[#09090b] text-[11px] uppercase tracking-wider w-1/2">Topic</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f4f5]">
              {[
                ['Secure File Sharing & Transfer',      'Business File Sharing'],
                ['Large File Transfer',                 'Managed File Transfer & SFTP'],
                ['Encrypted Cloud Storage',             'Business Cloud Storage & Backup'],
                ['Document Management Systems',         'Document Collaboration & Workflow'],
                ['Virtual Data Rooms (VDR)',            'Due Diligence Software'],
                ['PDF Security & Redaction Tools',      'File Compression Tools'],
                ['Electronic Signatures & Contracts',   'File Encryption Software'],
                ['Digital Rights Management (DRM)',     'Document Audit Trails'],
                ['Intelligent Document Processing',     'Document Scanning & OCR'],
                ['Browser Extensions for Privacy',      'MCP Servers, Plugins & AI Integrations'],
                ['Open-Source Security Tools',          'Software Reviews & Comparisons'],
              ].map(([left, right], i) => (
                <tr key={i} className="bg-white hover:bg-[#fafafa] transition-colors">
                  <td className="px-4 py-3 text-[#3f3f46] border-r border-[#f4f4f5]">
                    <span className="inline-flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#09090b] shrink-0" />
                      {left}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#3f3f46]">
                    {right ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#09090b] shrink-0" />
                        {right}
                      </span>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* We Do NOT Accept */}
      <section className="mb-10">
        <h2 className="text-[15px] font-semibold text-[#09090b] mb-4 tracking-tight">
          We Do Not Accept
        </h2>
        <div className="rounded-xl border border-[#fca5a5] bg-[#fff7f7] overflow-hidden divide-y divide-[#fee2e2]">
          {notAccepted.map((item) => (
            <div key={item} className="flex items-start gap-3 px-4 py-3">
              <X className="w-3.5 h-3.5 text-[#ef4444] shrink-0 mt-0.5" />
              <span className="text-[12.5px] text-[#7f1d1d]">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Guidelines */}
      <section className="mb-10">
        <h2 className="text-[15px] font-semibold text-[#09090b] mb-4 tracking-tight">
          Guest Post Guidelines
        </h2>
        <div className="rounded-xl border border-[#e4e4e7] overflow-hidden divide-y divide-[#f4f4f5]">
          {guidelines.map(({ label, value }) => (
            <div key={label} className="flex items-start gap-3 px-4 py-3 bg-white">
              <div className="w-4 h-4 rounded-full bg-[#09090b] text-white flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <div className="text-[12.5px]">
                <span className="font-semibold text-[#09090b]">{label}: </span>
                <span className="text-[#52525b]">{value}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ — accordion */}
      <section className="mb-10">
        <h2 className="text-xl sm:text-2xl font-bold text-[#09090b] tracking-tight mb-0">
          Frequently Asked Questions
        </h2>
        <div className="border-t border-[#e4e4e7] mt-4" />

        {faqs.map(({ q, a }, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={q}>
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between gap-4 py-4 text-left group cursor-pointer"
                aria-expanded={isOpen}
              >
                <span className="text-[14px] font-medium text-[#09090b] leading-snug">{q}</span>
                <span className="shrink-0 text-[#a1a1aa] group-hover:text-[#09090b] transition-colors">
                  {isOpen ? <X className="w-[15px] h-[15px]" /> : <Plus className="w-[15px] h-[15px]" />}
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-200 ease-in-out ${
                  isOpen ? 'max-h-48 opacity-100 pb-4' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-[13px] text-[#52525b] leading-relaxed pr-8">{a}</p>
              </div>
              <div className="border-t border-[#e4e4e7]" />
            </div>
          );
        })}
      </section>

      {/* CTA */}
      <section className="rounded-2xl border border-[#e4e4e7] bg-[#09090b] px-6 py-7 text-center">
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3">
          <Mail className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-[16px] font-bold text-white mb-1 tracking-tight">
          Ready to contribute?
        </h2>
        <p className="text-[12.5px] text-[#a1a1aa] mb-5 max-w-md mx-auto leading-relaxed">
          Send your pitch, outline, or full draft to our editorial team. Include a short bio and
          2–3 links to previous writing samples.
        </p>
        <a
          href="mailto:contact@securetools.live?subject=Collaboration%20Enquiry%20%E2%80%94%20SecureTools"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#09090b] text-[13px] font-semibold hover:bg-[#f4f4f5] transition-colors shadow-sm"
        >
          <Mail className="w-3.5 h-3.5" />
          contact@securetools.live
        </a>
      </section>
    </div>
  );
}
