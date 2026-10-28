import os, sys, re, json, glob

source_folder = "/Users/mohsmedsirajibrahim/Downloads/Secure_Tools_7_Final_Implementation_2026"
articles_dir = os.path.join(source_folder, "articles")
output_dir = "/Users/mohsmedsirajibrahim/Documents/Secure_tools/src/components/blog"

with open(os.path.join(source_folder, "article_manifest.json"), "r") as f:
    manifest = json.load(f)

category_map = {
    'share-financial-model-investors-securely': ('Due Diligence Software', 'due-diligence-software', 'Investor Diligence Guide'),
    'check-whether-your-pdf-is-encrypted': ('PDF Security & Editors', 'pdf-editors', 'Technical Security Guide'),
    'zero-knowledge-encryption-guide': ('Encrypted Cloud Storage', 'encrypted-cloud-storage', 'Cryptographic Explainer'),
    'share-protected-pdfs-with-screen-reader-users': ('Secure File Sharing', 'secure-file-sharing', 'Accessibility & Security Guide'),
    'anonymize-customer-data-before-sharing': ('Document Workflow & Automation', 'document-workflow-automation', 'Data Privacy Guide'),
    'e2ee-vs-encryption-at-rest-ma-teams': ('Virtual Data Rooms (VDR)', 'virtual-data-rooms', 'M&A Deal Architecture'),
    'preventing-leaks-in-sales-proposals-watermarking': ('Secure File Sharing', 'secure-file-sharing', 'Commercial Security Guide')
}

component_names = {
    'share-financial-model-investors-securely': 'ShareFinancialModelInvestorsSecurelyArticle',
    'check-whether-your-pdf-is-encrypted': 'CheckWhetherYourPdfIsEncryptedArticle',
    'zero-knowledge-encryption-guide': 'ZeroKnowledgeEncryptionGuideArticle',
    'share-protected-pdfs-with-screen-reader-users': 'ShareProtectedPdfsWithScreenReaderUsersArticle',
    'anonymize-customer-data-before-sharing': 'AnonymizeCustomerDataBeforeSharingArticle',
    'e2ee-vs-encryption-at-rest-ma-teams': 'E2eeVsEncryptionAtRestMaTeamsArticle',
    'preventing-leaks-in-sales-proposals-watermarking': 'PreventingLeaksInSalesProposalsWatermarkingArticle'
}

authoritative_sources = {
    'share-financial-model-investors-securely': [
        {
            'organization': 'National Institute of Standards and Technology (NIST)',
            'title': 'NIST Privacy Framework: Enterprise Risk Management for Data Protection',
            'url': 'https://www.nist.gov/privacy-framework',
            'description': 'Framework guidelines for data processing, confidentiality safeguards, and risk minimization when sharing business-critical financial assets.'
        },
        {
            'organization': 'NIST Computer Security Resource Center',
            'title': 'NIST SP 800-53 Rev. 5: Security and Privacy Controls for Information Systems',
            'url': 'https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final',
            'description': 'Information flow enforcement and access limitation controls designed to prevent unauthorized financial disclosure and model tampering.'
        }
    ],
    'check-whether-your-pdf-is-encrypted': [
        {
            'organization': 'QPDF Open Source Project',
            'title': 'QPDF: Document Encryption and Cryptographic Transformation Architecture',
            'url': 'https://www.qpdf.org/',
            'description': 'Standard CLI tool documentation for inspecting PDF encryption dictionaries, encryption keys, and permission bitmasks.'
        },
        {
            'organization': 'Adobe Help Center',
            'title': 'Adobe Acrobat User Guide: Securing PDFs with Passwords and Certificate Encryption',
            'url': 'https://helpx.adobe.com/acrobat/desktop/protect-documents/protect-with-passwords/encrypt-pdfs-with-password.html',
            'description': 'Official security documentation on Document Open passwords, permissions encryption, and AES-256 standard handlers.'
        }
    ],
    'zero-knowledge-encryption-guide': [
        {
            'organization': 'NIST Computer Security Resource Center',
            'title': 'NIST SP 800-57 Part 1 Rev. 5: Recommendation for Cryptographic Key Management',
            'url': 'https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final',
            'description': 'Cryptographic standards for key generation, user escrow separation, and client-controlled cryptographic lifecycles.'
        },
        {
            'organization': 'National Institute of Standards and Technology',
            'title': 'NIST SP 800-111: Guide to Storage Encryption Technologies for End User Devices',
            'url': 'https://csrc.nist.gov/pubs/sp/800/111/final',
            'description': 'Technical guidance on data storage encryption, endpoint key derivation, and threat boundary modeling.'
        }
    ],
    'share-protected-pdfs-with-screen-reader-users': [
        {
            'organization': 'World Wide Web Consortium (W3C)',
            'title': 'W3C Web Content Accessibility Guidelines (WCAG) 2.2 Quick Reference',
            'url': 'https://www.w3.org/WAI/WCAG22/quickref/',
            'description': 'International standard for digital accessibility, tag structure, navigation headings, and assistive technology compatibility.'
        },
        {
            'organization': 'PDF Association',
            'title': 'PDF/UA in a Nutshell: Universal Accessibility (ISO 14289 Standard)',
            'url': 'https://www.pdfa.org/resource/pdfua-in-a-nutshell/',
            'description': 'Definitive guide for authoring universally accessible PDF documents conforming to ISO 14289-1 standards.'
        }
    ],
    'anonymize-customer-data-before-sharing': [
        {
            'organization': 'Information Commissioner\'s Office (UK ICO)',
            'title': 'ICO Guidance on Data Sharing & Anonymisation Code of Practice',
            'url': 'https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/data-sharing/anonymisation/',
            'description': 'Regulatory guidance on differential privacy, pseudonymisation, k-anonymity, and the motivated intruder re-identification test.'
        },
        {
            'organization': 'National Institute of Standards and Technology (NIST)',
            'title': 'NIST Privacy Framework: Data Processing and De-Identification Principles',
            'url': 'https://www.nist.gov/privacy-framework',
            'description': 'Standards for managing re-identification risks and managing data processing lifecycles across external parties.'
        }
    ],
    'e2ee-vs-encryption-at-rest-ma-teams': [
        {
            'organization': 'National Institute of Standards and Technology',
            'title': 'NIST SP 800-111: Guide to Storage Encryption Technologies for End User Devices',
            'url': 'https://csrc.nist.gov/pubs/sp/800/111/final',
            'description': 'Comprehensive framework distinguishing server-side disk encryption from authenticated application-level encryption.'
        },
        {
            'organization': 'NIST Computer Security Resource Center',
            'title': 'NIST SP 800-57 Part 1 Rev. 5: Recommendation for Key Management',
            'url': 'https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final',
            'description': 'Key generation and custodian boundaries defining who holds decryption capability in deal rooms and enterprise clouds.'
        }
    ],
    'preventing-leaks-in-sales-proposals-watermarking': [
        {
            'organization': 'NIST Computer Security Resource Center',
            'title': 'NIST SP 800-53 Rev. 5: Information Flow Enforcement & Data Leakage Prevention',
            'url': 'https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final',
            'description': 'System and communications protection controls governing document dissemination, tracking, and export restriction.'
        },
        {
            'organization': 'Open Worldwide Application Security Project (OWASP)',
            'title': 'OWASP Top 10: Broken Access Control & Sensitive Data Exposure Guidance',
            'url': 'https://owasp.org/www-project-top-ten/',
            'description': 'Web security standards highlighting direct object reference vulnerabilities and commercial proposal interception vectors.'
        }
    ]
}

stock_images = {
    'share-financial-model-investors-securely': {
        'cover': '/blog-images/share-financial-model-investors-securely-cover.jpg',
        'cover_alt': 'Financial modeling and investment diligence analysis',
        'inbody': [
            {
                'src': '/blog-images/share-financial-model-investors-securely-img1.jpg',
                'alt': 'Auditing workbook formulas and sensitive financial assumptions'
            },
            {
                'src': '/blog-images/share-financial-model-investors-securely-img2.jpg',
                'alt': 'Founders reviewing stage-by-stage investor disclosures in diligence'
            },
            {
                'src': '/blog-images/share-financial-model-investors-securely-img3.jpg',
                'alt': 'Securing confidential valuation models and cap table forecasts'
            }
        ]
    },
    'check-whether-your-pdf-is-encrypted': {
        'cover': '/blog-images/check-whether-your-pdf-is-encrypted-cover.jpg',
        'cover_alt': 'Digital security padlock and cryptographic file inspection',
        'inbody': [
            {
                'src': '/blog-images/check-whether-your-pdf-is-encrypted-img1.jpg',
                'alt': 'Inspecting document properties and encryption standard flags'
            },
            {
                'src': '/blog-images/check-whether-your-pdf-is-encrypted-img2.jpg',
                'alt': 'Testing permitted operations and document-open passphrases'
            },
            {
                'src': '/blog-images/check-whether-your-pdf-is-encrypted-img3.jpg',
                'alt': 'Verifying PDF permissions across secure reader environments'
            }
        ]
    },
    'zero-knowledge-encryption-guide': {
        'cover': '/blog-images/zero-knowledge-encryption-guide-cover.jpg',
        'cover_alt': 'Cryptographic cloud infrastructure and zero-knowledge servers',
        'inbody': [
            {
                'src': '/blog-images/zero-knowledge-encryption-guide-img1.jpg',
                'alt': 'Client-side key derivation and cryptographic boundary mapping'
            },
            {
                'src': '/blog-images/zero-knowledge-encryption-guide-img2.jpg',
                'alt': 'Evaluating recovery mechanisms and zero-trust key management'
            },
            {
                'src': '/blog-images/zero-knowledge-encryption-guide-img3.jpg',
                'alt': 'Auditing zero-knowledge claims across enterprise storage architectures'
            }
        ]
    },
    'share-protected-pdfs-with-screen-reader-users': {
        'cover': '/blog-images/share-protected-pdfs-with-screen-reader-users-cover.jpg',
        'cover_alt': 'Accessible document reader with screen reader software',
        'inbody': [
            {
                'src': '/blog-images/share-protected-pdfs-with-screen-reader-users-img1.jpg',
                'alt': 'Validating PDF tag trees and semantic document heading hierarchy'
            },
            {
                'src': '/blog-images/share-protected-pdfs-with-screen-reader-users-img2.jpg',
                'alt': 'Testing keyboard accessibility and screen reader table navigation'
            },
            {
                'src': '/blog-images/share-protected-pdfs-with-screen-reader-users-img3.jpg',
                'alt': 'Conducting user acceptance testing for protected accessible files'
            }
        ]
    },
    'anonymize-customer-data-before-sharing': {
        'cover': '/blog-images/anonymize-customer-data-before-sharing-cover.jpg',
        'cover_alt': 'Data privacy compliance and customer record anonymization',
        'inbody': [
            {
                'src': '/blog-images/anonymize-customer-data-before-sharing-img1.jpg',
                'alt': 'Auditing direct identifiers and quasi-identifiers in enterprise databases'
            },
            {
                'src': '/blog-images/anonymize-customer-data-before-sharing-img2.jpg',
                'alt': 'Applying k-anonymity, suppression, and tokenization to customer datasets'
            },
            {
                'src': '/blog-images/anonymize-customer-data-before-sharing-img3.jpg',
                'alt': 'Drafting data sharing agreements and managing re-identification risk'
            }
        ]
    },
    'e2ee-vs-encryption-at-rest-ma-teams': {
        'cover': '/blog-images/e2ee-vs-encryption-at-rest-ma-teams-cover.jpg',
        'cover_alt': 'M&A deal team conducting confidential transaction negotiations',
        'inbody': [
            {
                'src': '/blog-images/e2ee-vs-encryption-at-rest-ma-teams-img1.jpg',
                'alt': 'Comparing server-side at-rest encryption with client-side end-to-end security'
            },
            {
                'src': '/blog-images/e2ee-vs-encryption-at-rest-ma-teams-img2.jpg',
                'alt': 'Mapping administrator access and third-party advisor roles in diligence'
            },
            {
                'src': '/blog-images/e2ee-vs-encryption-at-rest-ma-teams-img3.jpg',
                'alt': 'Deploying layered transaction data room controls and retention governance'
            }
        ]
    },
    'preventing-leaks-in-sales-proposals-watermarking': {
        'cover': '/blog-images/preventing-leaks-in-sales-proposals-watermarking-cover.jpg',
        'cover_alt': 'Enterprise sales team preparing confidential proposals and contracts',
        'inbody': [
            {
                'src': '/blog-images/preventing-leaks-in-sales-proposals-watermarking-img1.jpg',
                'alt': 'Applying dynamic recipient email watermarks and download restrictions'
            },
            {
                'src': '/blog-images/preventing-leaks-in-sales-proposals-watermarking-img2.jpg',
                'alt': 'Auditing link view duration, access timestamps, and forward attempts'
            },
            {
                'src': '/blog-images/preventing-leaks-in-sales-proposals-watermarking-img3.jpg',
                'alt': 'Executing commercial terms and revoking access upon deal stage progression'
            }
        ]
    }
}

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

def format_inline_markdown(text):
    text = text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
    # 1. Links first
    text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<Link href="\2" className="text-blue-600 hover:underline font-medium">\1</Link>', text)
    # 2. Bold
    text = re.sub(r'\*\*([^*]+)\*\*', r'<strong className="text-zinc-900 font-semibold">\1</strong>', text)
    # 3. Italic
    text = re.sub(r'\*([^*]+)\*', r'<em>\1</em>', text)
    return text

def parse_markdown_table(table_text):
    lines = [l.strip() for l in table_text.strip().split('\n') if l.strip()]
    if len(lines) < 2:
        return None
    headers = [c.strip() for c in lines[0].strip('|').split('|')]
    rows = []
    for line in lines[2:]:
        cols = [c.strip() for c in line.strip('|').split('|')]
        rows.append(cols)
    return headers, rows

for item in manifest:
    slug = item["slug"]
    comp_name = component_names[slug]
    cat_name, cat_slug, badge_text = category_map[slug]
    stock = stock_images[slug]
    sources_data = authoritative_sources[slug]
    
    md_path = os.path.join(articles_dir, f"{slug}.md")
    with open(md_path, "r", encoding="utf-8") as f:
        md_content = f.read()
    
    # 1. H1
    h1_match = re.search(r"^#\s+(.+)$", md_content, re.MULTILINE)
    title = h1_match.group(1).strip() if h1_match else item["title"]
    
    # 2. TL;DR
    tldr_match = re.search(r">\s*\*\*TL;DR:\*\*\s*(.+?)(?=\n\n##)", md_content, re.DOTALL)
    tldr = tldr_match.group(1).strip() if tldr_match else ""
    
    # Split by \n##
    h2_sections = md_content.split("\n## ")
    
    intro_text = ""
    toc_items = []
    step_sections = []
    table_data = None
    checklist_items = []
    faq_items = []
    keep_reading_items = []
    
    for sec in h2_sections[1:]:
        first_nl = sec.find('\n')
        sec_title = sec[:first_nl].strip() if first_nl != -1 else sec.strip()
        sec_body = sec[first_nl:].strip() if first_nl != -1 else ""
        
        if sec_title.lower() == "why this question matters":
            intro_text = sec_body
        elif sec_title.lower() == "table of contents":
            for line in sec_body.split('\n'):
                m = re.search(r"\[(.*?)\]\(#(.*?)\)", line)
                if m:
                    toc_items.append({"title": m.group(1), "id": m.group(2)})
        elif sec_title.lower() == "comparison and decision table":
            table_data = parse_markdown_table(sec_body)
        elif sec_title.lower() == "practical release checklist":
            for idx, cl in enumerate(sec_body.split('\n')):
                clean_cl = re.sub(r"^-\s*\[\s*\]\s*", "", cl).strip()
                if clean_cl:
                    checklist_items.append({"id": f"c{idx+1}", "text": clean_cl})
        elif sec_title.lower() == "questions to ask":
            faq_chunks = re.split(r"\n\n###\s+", "\n\n" + sec_body)
            for fc in faq_chunks:
                fc = fc.strip()
                if not fc:
                    continue
                fnl = fc.find('\n')
                if fnl != -1:
                    faq_items.append({"q": fc[:fnl].strip(), "a": fc[fnl:].strip().replace('\n', ' ')})
        elif sec_title.lower() == "sources and scope":
            # Handled via authoritative_sources mapping
            continue
        elif sec_title.lower() == "keep reading":
            for kl in sec_body.split('\n'):
                km = re.search(r"\[(.*?)\]\((.*?)\)", kl)
                if km:
                    keep_reading_items.append({"title": km.group(1), "href": km.group(2)})
        else:
            # Step section
            sec_id = slugify(sec_title)
            
            # Extract How to apply
            hta_match = re.search(r"\*\*How to apply this step\.\*\*\s*(.+?)(?=\n\n|\Z)", sec_body, re.DOTALL)
            hta_text = hta_match.group(1).strip() if hta_match else ""
            
            # Extract Practical review record
            prr_match = re.search(r"\*\*Practical review record\.\*\*\s*(.+?)(?=\n\n|\Z)", sec_body, re.DOTALL)
            prr_text = prr_match.group(1).strip() if prr_match else ""
            
            # Other paragraphs
            other_paras = []
            raw_paras = [p.strip() for p in sec_body.split('\n\n') if p.strip()]
            for p in raw_paras:
                if p.startswith("**How to apply this step.**") or p.startswith("**Practical review record.**"):
                    continue
                if p.startswith("![") or p.startswith("*Diagram is an explanatory"):
                    continue
                if hta_text and (p == hta_text or p == hta_text[:len(p)]):
                    continue
                other_paras.append(p)
                
            step_sections.append({
                "id": sec_id,
                "heading": sec_title,
                "how_to_apply": hta_text,
                "practical_review": prr_text,
                "other_paras": other_paras
            })
            
    # Filter TOC items to remove old "sources-and-scope", add structured "Authoritative sources & standards"
    toc_items = [t for t in toc_items if t["id"] != "sources-and-scope"]
    toc_items.append({"title": "Authoritative sources & standards", "id": "sources-and-references"})
    
    # Hydrated Schema with Citations
    json_ld = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BlogPosting",
                "@id": f"https://securetools.live/blog/{slug}#article",
                "headline": title,
                "description": tldr,
                "datePublished": "2026-10-27",
                "dateModified": "2026-10-27",
                "mainEntityOfPage": {
                    "@id": f"https://securetools.live/blog/{slug}"
                },
                "image": stock['cover'],
                "citation": [s['url'] for s in sources_data],
                "author": {
                    "@type": "Person",
                    "name": "Mohamed Siraj",
                    "url": "https://www.linkedin.com/in/mohamed-siraj-1a1910234/"
                },
                "publisher": {
                    "@type": "Organization",
                    "name": "SecureTools.live",
                    "url": "https://securetools.live"
                },
                "inLanguage": "en",
                "isAccessibleForFree": True
            },
            {
                "@type": "BreadcrumbList",
                "@id": f"https://securetools.live/blog/{slug}#breadcrumb",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": "https://securetools.live"
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Blog",
                        "item": "https://securetools.live/blog"
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": cat_name,
                        "item": f"https://securetools.live/categories/{cat_slug}"
                    },
                    {
                        "@type": "ListItem",
                        "position": 4,
                        "name": title,
                        "item": f"https://securetools.live/blog/{slug}"
                    }
                ]
            },
            {
                "@type": "FAQPage",
                "@id": f"https://securetools.live/blog/{slug}#faq",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": fi["q"],
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": fi["a"]
                        }
                    }
                    for fi in faq_items
                ]
            }
        ]
    }
    
    with open(f"/Users/mohsmedsirajibrahim/Documents/Secure_tools/schemas/{slug}.jsonld", "w") as fp:
        json.dump(json_ld, fp, indent=2)
    with open(f"/Users/mohsmedsirajibrahim/Documents/Secure_tools/public/schemas/{slug}.jsonld", "w") as fp:
        json.dump(json_ld, fp, indent=2)

    # BUILD TSX
    parts = []
    parts.append("'use client';\n\nimport React, { useState } from 'react';\nimport Link from 'next/link';\nimport Image from 'next/image';\nimport { \n  Info, \n  List, \n  ArrowLeft, \n  ArrowRight, \n  ExternalLink, \n  Sparkles, \n  ShieldCheck, \n  CheckCircle2, \n  AlertTriangle, \n  Lock, \n  Layers, \n  FileText, \n  UserCheck, \n  Eye, \n  FileCheck, \n  Download, \n  FolderLock, \n  Briefcase, \n  BookOpen \n} from 'lucide-react';\nimport { BlogFaqAccordion, FaqItem } from '@/components/blog/BlogFaqAccordion';\nimport { AuthorHeader } from '@/components/blog/AuthorHeader';\nimport { AuthorCard } from '@/components/blog/AuthorCard';\n\n")
    
    parts.append(f"export function {comp_name}() {{\n")
    parts.append("  const [checklistState, setChecklistState] = useState<Record<string, boolean>>({\n")
    for cl in checklist_items:
        parts.append(f"    '{cl['id']}': false,\n")
    parts.append("  });\n\n")
    parts.append("  const toggleCheck = (id: string) => {\n    setChecklistState(prev => ({ ...prev, [id]: !prev[id] }));\n  };\n\n")
    parts.append(f"  const jsonLd = {json.dumps(json_ld, indent=2)};\n\n")
    parts.append(f"  const tocItems = {json.dumps(toc_items, indent=2)};\n\n")
    parts.append(f"  const faqItems: FaqItem[] = {json.dumps(faq_items, indent=2)};\n\n")
    parts.append(f"  const checklistItems = {json.dumps(checklist_items, indent=2)};\n\n")
    parts.append(f"  const sources = {json.dumps(sources_data, indent=2)};\n\n")
    
    parts.append("  return (\n")
    parts.append("    <div className=\"w-full\">\n")
    parts.append("      <script\n        type=\"application/ld+json\"\n        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}\n      />\n\n")
    parts.append("      <div className=\"max-w-[840px] mx-auto pb-16 px-4 sm:px-6\">\n")
    
    # Breadcrumbs & Header
    parts.append("        {/* Top Navigation & Breadcrumb */}\n")
    parts.append("        <div className=\"flex items-center justify-between mb-4 text-[13px] text-[#71717a]\">\n")
    parts.append("          <Link href=\"/blog\" className=\"inline-flex items-center gap-1.5 font-medium hover:text-[#09090b] transition-colors\">\n")
    parts.append("            <ArrowLeft className=\"w-4 h-4\" />\n            <span>All Articles</span>\n          </Link>\n")
    parts.append("          <div className=\"flex items-center gap-2\">\n")
    parts.append("            <Image src=\"/icon.png\" alt=\"SecureTools\" width={16} height={16} className=\"w-4 h-4 rounded-sm object-contain\" />\n")
    parts.append("            <span className=\"font-geist\">securetools.live • October 2026</span>\n")
    parts.append("          </div>\n        </div>\n\n")
    
    parts.append("        {/* Category & Badge */}\n")
    parts.append("        <div className=\"flex items-center gap-2 mb-3 text-[11px] font-mono uppercase tracking-wider text-[#71717a]\">\n")
    parts.append(f"          <Link href=\"/categories/{cat_slug}\" className=\"text-[#2563eb] font-semibold hover:underline\">\n            {cat_name}\n          </Link>\n")
    parts.append(f"          <span>•</span>\n          <span>{badge_text}</span>\n        </div>\n\n")
    
    parts.append(f"        <h1 className=\"text-2xl sm:text-3xl md:text-[38px] lg:text-[42px] font-bold tracking-tight text-[#09090b] leading-[1.18] mb-4 font-geist\">\n          {title}\n        </h1>\n\n")
    parts.append("        <AuthorHeader publishDate=\"October 27, 2026\" readTime=\"14 min read\" />\n\n")
    
    # Cover image
    parts.append("        {/* Hero Cover Stock Image */}\n")
    parts.append("        <div className=\"relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-7 border border-[#e4e4e7] shadow-xs bg-[#f4f4f5]\">\n")
    parts.append(f"          <Image src=\"{stock['cover']}\" alt=\"{stock['cover_alt']}\" fill sizes=\"(max-width: 840px) 100vw, 840px\" className=\"object-cover\" priority />\n")
    parts.append("        </div>\n\n")
    
    # TLDR Box
    parts.append("        <div className=\"rounded-2xl border border-[#e4e4e7] bg-[#fbfbfb] p-5 sm:p-6 mb-7 shadow-2xs\">\n")
    parts.append("          <div className=\"flex items-center gap-2 font-mono text-[11.5px] font-bold uppercase tracking-wider text-[#09090b] mb-2.5\">\n")
    parts.append("            <Info className=\"w-4 h-4 text-[#2563eb] shrink-0\" />\n            <span>TL;DR / EXECUTIVE SUMMARY</span>\n          </div>\n")
    parts.append(f"          <p className=\"text-[14px] sm:text-[14.5px] text-[#27272a] leading-relaxed font-normal\">\n            {tldr}\n          </p>\n        </div>\n\n")
    
    # Table of contents box
    parts.append("        <div className=\"rounded-2xl border border-[#e4e4e7] bg-[#fafafa] p-5 sm:p-6 mb-10 shadow-2xs\">\n")
    parts.append("          <div className=\"flex items-center justify-between mb-3.5 pb-2.5 border-b border-[#e4e4e7]\">\n")
    parts.append("            <div className=\"flex items-center gap-2 font-mono text-[11.5px] font-bold uppercase tracking-wider text-[#09090b]\">\n")
    parts.append("              <List className=\"w-4 h-4 text-[#71717a]\" />\n              <span>TABLE OF CONTENTS</span>\n            </div>\n")
    parts.append("            <span className=\"px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#f4f4f5] text-[#71717a] border border-[#e4e4e7]\">\n")
    parts.append(f"              {len(toc_items)} sections\n            </span>\n          </div>\n")
    parts.append("          <div className=\"flex flex-col space-y-2 text-[13.5px]\">\n")
    parts.append("            {tocItems.map((item, idx) => (\n")
    parts.append("              <a key={item.id} href={'#' + item.id} className=\"text-[#3f3f46] hover:text-[#09090b] hover:underline flex items-baseline gap-2.5 py-1 border-b border-[#f4f4f5] last:border-b-0 transition-colors\">\n")
    parts.append("                <span className=\"font-mono text-[11px] text-[#a1a1aa] shrink-0\">{String(idx + 1).padStart(2, '0')}.</span>\n")
    parts.append("                <span className=\"leading-snug\">{item.title}</span>\n              </a>\n            ))}\n          </div>\n        </div>\n\n")
    
    # Content sections
    parts.append("        <div className=\"space-y-10 text-[15px] leading-relaxed text-[#27272a]\">\n")
    parts.append("          <section id=\"why-this-question-matters\" className=\"space-y-4 pt-2\">\n")
    parts.append("            <h2 className=\"text-xl sm:text-2xl font-bold tracking-tight text-[#09090b] border-b border-[#e4e4e7] pb-2.5\">\n              Why this question matters\n            </h2>\n")
    for ip in intro_text.split('\n\n'):
        if ip.strip():
            parts.append(f"            <p>{format_inline_markdown(ip.strip())}</p>\n")
    parts.append("          </section>\n\n")
    
    # Insert inbody images at indices 1, 5, 8
    img_insert_map = { 1: 0, 5: 1, 8: 2 }
    
    for sec_idx, sec in enumerate(step_sections):
        parts.append(f"          <section id=\"{sec['id']}\" className=\"space-y-4 pt-2 scroll-mt-20\">\n")
        parts.append(f"            <h2 className=\"text-xl sm:text-2xl font-bold tracking-tight text-[#09090b] border-b border-[#e4e4e7] pb-2.5\">\n              {sec_idx + 1}. {sec['heading']}\n            </h2>\n")
        
        if sec["how_to_apply"]:
            parts.append(f"            <p className=\"text-[15px] leading-relaxed\">\n              <strong className=\"text-[#09090b] font-semibold\">How to apply this step:</strong> {format_inline_markdown(sec['how_to_apply'])}\n            </p>\n")
            
        for op in sec["other_paras"]:
            parts.append(f"            <p>{format_inline_markdown(op)}</p>\n")
            
        if sec["practical_review"]:
            parts.append("            <div className=\"rounded-xl border border-[#e4e4e7] bg-[#fafafa] p-4.5 my-3 shadow-2xs\">\n")
            parts.append("              <div className=\"flex items-center gap-2 font-mono text-[11.5px] font-bold uppercase tracking-wider text-[#09090b] mb-1.5\">\n")
            parts.append("                <CheckCircle2 className=\"w-4 h-4 text-[#2563eb]\" />\n                <span>PRACTICAL REVIEW RECORD</span>\n              </div>\n")
            parts.append(f"              <p className=\"text-[13.5px] text-[#3f3f46] leading-relaxed\">\n                {format_inline_markdown(sec['practical_review'])}\n              </p>\n            </div>\n")
            
        # Insert clean inline stock image if mapped
        if sec_idx in img_insert_map and img_insert_map[sec_idx] < len(stock["inbody"]):
            inb = stock["inbody"][img_insert_map[sec_idx]]
            parts.append("            <div className=\"my-8 rounded-2xl overflow-hidden border border-[#e4e4e7] shadow-xs\">\n")
            parts.append(f"              <Image src=\"{inb['src']}\" alt=\"{inb['alt']}\" width={{840}} height={{472}} className=\"w-full h-auto object-cover\" loading=\"lazy\" />\n")
            parts.append("            </div>\n")
            
        parts.append("          </section>\n\n")
        
    # Comparison table
    if table_data:
        headers, rows = table_data
        parts.append("          <section id=\"comparison-and-decision-table\" className=\"space-y-4 pt-4 border-t border-[#e4e4e7] scroll-mt-20\">\n")
        parts.append("            <h2 className=\"text-xl sm:text-2xl font-bold tracking-tight text-[#09090b] mb-2\">\n              Comparison and decision table\n            </h2>\n")
        parts.append("            <div className=\"overflow-x-auto rounded-xl border border-[#e4e4e7] my-4 shadow-2xs\">\n")
        parts.append("              <table className=\"w-full text-left border-collapse border border-[#e4e4e7] text-[13.5px]\">\n")
        parts.append("                <thead className=\"bg-[#f4f4f5] text-[#09090b] font-semibold text-[13px]\">\n                  <tr>\n")
        for h in headers:
            parts.append(f"                    <th className=\"p-3 border border-[#e4e4e7]\">{format_inline_markdown(h)}</th>\n")
        parts.append("                  </tr>\n                </thead>\n")
        parts.append("                <tbody className=\"divide-y divide-[#e4e4e7] bg-white text-[#3f3f46]\">\n")
        for row in rows:
            parts.append("                  <tr>\n")
            for cell in row:
                parts.append(f"                    <td className=\"p-3 border border-[#e4e4e7]\">{format_inline_markdown(cell)}</td>\n")
            parts.append("                  </tr>\n")
        parts.append("                </tbody>\n              </table>\n            </div>\n          </section>\n\n")
        
    # Checklist
    if checklist_items:
        parts.append("          <section id=\"practical-release-checklist\" className=\"space-y-4 pt-4 border-t border-[#e4e4e7] scroll-mt-20\">\n")
        parts.append("            <h2 className=\"text-xl sm:text-2xl font-bold tracking-tight text-[#09090b] mb-2\">\n              Practical release checklist\n            </h2>\n")
        parts.append("            <div className=\"rounded-2xl border border-[#e4e4e7] bg-[#fbfbfb] p-5 sm:p-6 my-4 shadow-2xs\">\n")
        parts.append("              <div className=\"space-y-3\">\n")
        parts.append("                {checklistItems.map(item => (\n")
        parts.append("                  <label key={item.id} className=\"flex items-start gap-3 cursor-pointer group select-none text-[14px] text-[#27272a]\">\n")
        parts.append("                    <input type=\"checkbox\" checked={checklistState[item.id] || false} onChange={() => toggleCheck(item.id)} className=\"mt-1 h-4 w-4 rounded-xs border-zinc-300 text-blue-600 focus:ring-blue-500 cursor-pointer\" />\n")
        parts.append("                    <span className={checklistState[item.id] ? 'line-through text-[#a1a1aa]' : 'group-hover:text-[#09090b]'}>{item.text}</span>\n")
        parts.append("                  </label>\n                ))}\n              </div>\n            </div>\n          </section>\n\n")
        
    # FAQ
    if faq_items:
        parts.append("          <section id=\"questions-to-ask\" className=\"space-y-4 pt-4 border-t border-[#e4e4e7] scroll-mt-20\">\n")
        parts.append("            <h2 className=\"text-xl sm:text-2xl font-bold tracking-tight text-[#09090b] border-b border-[#e4e4e7] pb-2.5\">\n              Questions to ask (FAQ)\n            </h2>\n")
        parts.append("            <BlogFaqAccordion items={faqItems} />\n")
        parts.append("          </section>\n\n")
        
    # Authoritative Sources & Standards
    parts.append("          {/* Authoritative Sources & Technical References */}\n")
    parts.append("          <section id=\"sources-and-references\" className=\"space-y-4 pt-4 border-t border-[#e4e4e7] scroll-mt-20\">\n")
    parts.append("            <div className=\"flex items-center gap-2 mb-1\">\n")
    parts.append("              <BookOpen className=\"w-5 h-5 text-[#2563eb]\" />\n")
    parts.append("              <h2 className=\"text-xl sm:text-2xl font-bold tracking-tight text-[#09090b]\">\n")
    parts.append("                Authoritative sources & standards\n")
    parts.append("              </h2>\n")
    parts.append("            </div>\n")
    parts.append("            <p className=\"text-[14px] text-[#71717a] leading-relaxed\">\n")
    parts.append("              The technical controls, cryptographic standards, and procedural recommendations in this guide are informed by verified industry frameworks and official documentation:\n")
    parts.append("            </p>\n")
    parts.append("            <div className=\"grid grid-cols-1 gap-3 pt-2\">\n")
    parts.append("              {sources.map((src, idx) => (\n")
    parts.append("                <a \n                  key={idx}\n                  href={src.url}\n                  target=\"_blank\"\n                  rel=\"noopener noreferrer\"\n                  className=\"flex items-start justify-between p-4 rounded-xl border border-[#e4e4e7] bg-[#fafafa] hover:bg-[#f4f4f5] hover:border-[#d4d4d8] transition-all group shadow-2xs\"\n                >\n")
    parts.append("                  <div className=\"pr-4 space-y-1\">\n")
    parts.append("                    <div className=\"text-[11px] font-mono uppercase tracking-wider text-[#2563eb] font-semibold\">\n                      {src.organization}\n                    </div>\n")
    parts.append("                    <div className=\"font-semibold text-[14.5px] text-[#09090b] group-hover:text-[#2563eb] transition-colors leading-snug\">\n                      {src.title}\n                    </div>\n")
    parts.append("                    <p className=\"text-[12.5px] text-[#71717a] leading-relaxed\">\n                      {src.description}\n                    </p>\n")
    parts.append("                    <div className=\"text-[11.5px] font-mono text-[#a1a1aa] group-hover:text-[#71717a] transition-colors pt-1 flex items-center gap-1 break-all\">\n                      <span>{src.url}</span>\n                    </div>\n")
    parts.append("                  </div>\n")
    parts.append("                  <ExternalLink className=\"w-4 h-4 text-[#71717a] group-hover:text-[#2563eb] transition-colors shrink-0 mt-1\" />\n")
    parts.append("                </a>\n")
    parts.append("              ))}\n")
    parts.append("            </div>\n")
    parts.append("          </section>\n\n")

    # Keep reading
    parts.append("          <section id=\"keep-reading\" className=\"space-y-4 pt-6 border-t border-[#e4e4e7] scroll-mt-20\">\n")
    parts.append("            <h2 className=\"text-xl sm:text-2xl font-bold tracking-tight text-[#09090b] mb-4\">\n              Keep reading\n            </h2>\n")
    parts.append("            <div className=\"grid grid-cols-1 sm:grid-cols-2 gap-4\">\n")
    for kr in keep_reading_items:
        parts.append(f"              <Link href=\"{kr['href']}\" className=\"p-4 rounded-xl border border-[#e4e4e7] hover:border-[#09090b] transition-colors bg-white block group shadow-2xs\">\n")
        parts.append(f"                <div className=\"font-semibold text-[14px] text-[#09090b] group-hover:text-[#2563eb] transition-colors mb-1\">\n                  {kr['title']}\n                </div>\n")
        parts.append("                <p className=\"text-[12.5px] text-[#71717a] line-clamp-2\">\n                  Explore practical operational workflows and security controls in our verified knowledge base.\n                </p>\n              </Link>\n")
    parts.append("            </div>\n          </section>\n\n")
    
    parts.append("          <div className=\"pt-6\">\n            <AuthorCard />\n          </div>\n")
    parts.append("        </div>\n      </div>\n    </div>\n  );\n}\n")
    
    out_file = os.path.join(output_dir, f"{comp_name}.tsx")
    with open(out_file, "w", encoding="utf-8") as fp:
        fp.write("".join(parts))
    print(f"Generated {out_file}")

print("All 7 components rebuilt with Authoritative Sources & Standards!")
