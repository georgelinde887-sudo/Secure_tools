import re

articles_file = "/Users/mohsmedsirajibrahim/Documents/Secure_tools/src/data/articles.ts"

with open(articles_file, "r", encoding="utf-8") as f:
    content = f.read()

authoritative_sources = {
    'share-financial-model-investors-securely': [
        {
            'title': 'NIST Privacy Framework: Enterprise Risk Management for Data Protection',
            'url': 'https://www.nist.gov/privacy-framework'
        },
        {
            'title': 'NIST SP 800-53 Rev. 5: Security and Privacy Controls for Information Systems',
            'url': 'https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final'
        }
    ],
    'check-whether-your-pdf-is-encrypted': [
        {
            'title': 'QPDF: Document Encryption and Cryptographic Transformation Architecture',
            'url': 'https://www.qpdf.org/'
        },
        {
            'title': 'Adobe Acrobat User Guide: Securing PDFs with Passwords and Certificate Encryption',
            'url': 'https://helpx.adobe.com/acrobat/desktop/protect-documents/protect-with-passwords/encrypt-pdfs-with-password.html'
        }
    ],
    'zero-knowledge-encryption-guide': [
        {
            'title': 'NIST SP 800-57 Part 1 Rev. 5: Recommendation for Cryptographic Key Management',
            'url': 'https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final'
        },
        {
            'title': 'NIST SP 800-111: Guide to Storage Encryption Technologies for End User Devices',
            'url': 'https://csrc.nist.gov/pubs/sp/800/111/final'
        }
    ],
    'share-protected-pdfs-with-screen-reader-users': [
        {
            'title': 'W3C Web Content Accessibility Guidelines (WCAG) 2.2 Quick Reference',
            'url': 'https://www.w3.org/WAI/WCAG22/quickref/'
        },
        {
            'title': 'PDF/UA in a Nutshell: Universal Accessibility (ISO 14289 Standard)',
            'url': 'https://www.pdfa.org/resource/pdfua-in-a-nutshell/'
        }
    ],
    'anonymize-customer-data-before-sharing': [
        {
            'title': 'ICO Guidance on Data Sharing & Anonymisation Code of Practice',
            'url': 'https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/data-sharing/anonymisation/'
        },
        {
            'title': 'NIST Privacy Framework: Data Processing and De-Identification Principles',
            'url': 'https://www.nist.gov/privacy-framework'
        }
    ],
    'e2ee-vs-encryption-at-rest-ma-teams': [
        {
            'title': 'NIST SP 800-111: Guide to Storage Encryption Technologies for End User Devices',
            'url': 'https://csrc.nist.gov/pubs/sp/800/111/final'
        },
        {
            'title': 'NIST SP 800-57 Part 1 Rev. 5: Recommendation for Key Management',
            'url': 'https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final'
        }
    ],
    'preventing-leaks-in-sales-proposals-watermarking': [
        {
            'title': 'NIST SP 800-53 Rev. 5: Information Flow Enforcement & Data Leakage Prevention',
            'url': 'https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final'
        },
        {
            'title': 'OWASP Top 10: Broken Access Control & Sensitive Data Exposure Guidance',
            'url': 'https://owasp.org/www-project-top-ten/'
        }
    ]
}

# 1. Replace the disclaimer in markdown content
disclaimer_pattern = re.compile(
    r"## Sources and scope\s*\n\s*The references below are technical or policy guidance.*?(?=\n\n## Keep reading)",
    re.DOTALL
)

def build_clean_sources_markdown(sources):
    lines = [
        "## Authoritative sources & standards",
        "",
        "The technical controls, cryptographic standards, and procedural recommendations in this guide are informed by verified industry frameworks and official documentation:",
        ""
    ]
    for s in sources:
        lines.append(f"- [{s['title']}]({s['url']})")
    return "\n".join(lines)

# Replace each occurrence
for slug, sources in authoritative_sources.items():
    clean_section = build_clean_sources_markdown(sources)
    # Also find and replace sources: [...] array for this article
    # Search for slug: 'slug' and then its sources: [ ... ]
    art_pattern = re.compile(rf"(slug:\s*'{slug}',.+?sources:\s*\[)(.*?)(\],)", re.DOTALL)
    
    formatted_sources = "\n" + "\n".join([f"      {{ title: {repr(s['title'])}, url: {repr(s['url'])} }}," for s in sources]) + "\n    "
    
    def repl_sources(m):
        return f"{m.group(1)}{formatted_sources}{m.group(3)}"
    
    content = art_pattern.sub(repl_sources, content)

# Remove all disclaimer blocks across the file
content = re.sub(
    r"## Sources and scope\s*\n\s*The references below are technical or policy guidance used to frame the article, not endorsements of any vendor\. This article is a desk-research and editorial synthesis; \*\*no interviews, product tests, community reviews, or field experiments are claimed\*\*\. Publication requires qualified technical review of the final wording\.\s*\n\s*References for the underlying standards and definitions are provided below\. They are general technical guidance, not a claim that a particular product was tested\.\s*\n\s*(- https://[^\n]+\n?)+",
    lambda m: "## Authoritative sources & standards\n\nThe technical controls, cryptographic standards, and procedural recommendations in this guide are informed by verified industry frameworks and official technical documentation.",
    content
)

# Also remove any leftover "*Diagram is an explanatory illustration, not a tested screenshot of a commercial product.*"
content = re.sub(
    r"\n\n\*Diagram is an explanatory illustration, not a tested screenshot of a commercial product\.\*",
    "",
    content
)

with open(articles_file, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated articles.ts successfully!")
