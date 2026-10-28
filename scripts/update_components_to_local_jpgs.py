import os, re, glob

# 1. Update src/data/articles.ts
articles_ts = "src/data/articles.ts"
with open(articles_ts, "r", encoding="utf-8") as f:
    text = f.read()

# Map slug -> coverImage (all local jpg files)
cover_map = {
    'share-financial-model-investors-securely': '/blog-images/share-financial-model-investors-securely-cover.jpg',
    'share-protected-pdfs-with-screen-reader-users': '/blog-images/share-protected-pdfs-with-screen-reader-users-cover.jpg',
    'anonymize-customer-data-before-sharing': '/blog-images/anonymize-customer-data-before-sharing-cover.jpg',
    'check-whether-your-pdf-is-encrypted': '/blog-images/check-whether-your-pdf-is-encrypted-cover.jpg',
    'zero-knowledge-encryption-guide': '/blog-images/zero-knowledge-encryption-guide-cover.jpg',
    'enterprise-file-sharing-security-checklist': '/blog-images/enterprise-file-sharing-security-checklist-hero.jpg',
    'setting-up-virtual-data-room-seed-series-a-due-diligence': '/blog-images/virtual-data-room-seed-series-a-header.jpg',
    'best-document-management-systems': '/blog-images/dms-cover-stock.jpg',
    'e2ee-vs-encryption-at-rest-ma-teams': '/blog-images/e2ee-vs-encryption-at-rest-ma-teams-cover.jpg',
    'preventing-leaks-in-sales-proposals-watermarking': '/blog-images/preventing-leaks-in-sales-proposals-watermarking-cover.jpg',
    'how-to-share-pdf-with-screenshot-protection': '/blog-images/how-to-share-pdf-with-screenshot-protection-1.jpg',
    'how-to-protect-pdf-with-dynamic-watermark': '/blog-images/how-to-protect-pdf-with-dynamic-watermark-1.jpg',
    'how-to-share-pdf-without-download': '/blog-images/pdf-no-download-cover.jpg',
    'how-to-password-protect-pdf-and-share-securely': '/blog-images/pdf-password-cover.jpg',
    'investor-data-room-permissions-checklist': '/blog-images/investor-data-room-permissions-checklist-cover.jpg',
    'pdf-password-vs-secure-sharing-link': '/blog-images/pdf-password-vs-secure-sharing-link-cover.jpg',
    'safe-document-sharing-startup-due-diligence': '/blog-images/safe-document-sharing-startup-due-diligence-cover.jpg',
    'document-view-tracking-privacy-investors': '/blog-images/document-view-tracking-privacy-investors-cover.jpg'
}

for slug, new_cover in cover_map.items():
    # Replace coverImage for this article
    pattern = re.compile(rf"(slug:\s*'{slug}',.+?coverImage:\s*')[^']+(')", re.DOTALL)
    text = pattern.sub(rf"\g<1>{new_cover}\g<2>", text)

# Also remove any diagram image markdown in content
text = re.sub(r"!\[.*?\]\(/blog-images/.*?-diagram-.*?\)", "", text)
text = re.sub(r"!\[.*?\]\(/blog-images/.*?-figure-.*?\)", "", text)

with open(articles_ts, "w", encoding="utf-8") as f:
    f.write(text)
print("Updated src/data/articles.ts cover images!")

# 2. Update src/app/blog/[slug]/page.tsx
page_tsx = "src/app/blog/[slug]/page.tsx"
with open(page_tsx, "r", encoding="utf-8") as f:
    ptext = f.read()

# Replace webp with jpg
ptext = ptext.replace('enterprise-file-sharing-security-checklist-hero.webp', 'enterprise-file-sharing-security-checklist-hero.jpg')
ptext = ptext.replace('how-to-share-pdf-with-screenshot-protection-1.webp', 'how-to-share-pdf-with-screenshot-protection-1.jpg')
ptext = ptext.replace('how-to-protect-pdf-with-dynamic-watermark-1.webp', 'how-to-protect-pdf-with-dynamic-watermark-1.jpg')
ptext = ptext.replace('pdf-no-download-cover.webp', 'pdf-no-download-cover.jpg')
ptext = ptext.replace('pdf-password-cover.webp', 'pdf-password-cover.jpg')
ptext = ptext.replace('virtual-data-room-seed-series-a-header.png', 'virtual-data-room-seed-series-a-header.jpg')

with open(page_tsx, "w", encoding="utf-8") as f:
    f.write(ptext)
print("Updated src/app/blog/[slug]/page.tsx!")

# 3. Update existing components (PDF and older articles)
comp_replacements = {
    "src/components/blog/EnterpriseFileSharingChecklistArticle.tsx": [
        ('enterprise-file-sharing-security-checklist-hero.webp', 'enterprise-file-sharing-security-checklist-hero.jpg'),
        ('secure-document-workflow.webp', 'secure-document-workflow.jpg'),
        ('enterprise-document-access-governance.webp', 'enterprise-document-access-governance.jpg'),
        ('enterprise-file-audit-evidence.webp', 'enterprise-file-audit-evidence.jpg')
    ],
    "src/components/blog/HowToSharePdfWithScreenshotProtectionArticle.tsx": [
        ('how-to-share-pdf-with-screenshot-protection-1.webp', 'how-to-share-pdf-with-screenshot-protection-1.jpg'),
        ('how-to-share-pdf-with-screenshot-protection-2.webp', 'how-to-share-pdf-with-screenshot-protection-2.jpg'),
        ('how-to-share-pdf-with-screenshot-protection-3.webp', 'how-to-share-pdf-with-screenshot-protection-3.jpg'),
        ('how-to-share-pdf-with-screenshot-protection-4.webp', 'how-to-share-pdf-with-screenshot-protection-4.jpg')
    ],
    "src/components/blog/HowToProtectPdfWithDynamicWatermarkArticle.tsx": [
        ('how-to-protect-pdf-with-dynamic-watermark-1.webp', 'how-to-protect-pdf-with-dynamic-watermark-1.jpg'),
        ('how-to-protect-pdf-with-dynamic-watermark-2.webp', 'how-to-protect-pdf-with-dynamic-watermark-2.jpg'),
        ('how-to-protect-pdf-with-dynamic-watermark-3.webp', 'how-to-protect-pdf-with-dynamic-watermark-3.jpg'),
        ('how-to-protect-pdf-with-dynamic-watermark-4.webp', 'how-to-protect-pdf-with-dynamic-watermark-4.jpg')
    ],
    "src/components/blog/HowToSharePdfWithoutDownloadArticle.tsx": [
        ('pdf-no-download-cover.webp', 'pdf-no-download-cover.jpg'),
        ('pdf-no-download-workflow.webp', 'pdf-no-download-workflow.jpg'),
        ('pdf-no-download-team.webp', 'pdf-no-download-team.jpg'),
        ('pdf-no-download-audit.webp', 'pdf-no-download-audit.jpg')
    ],
    "src/components/blog/HowToPasswordProtectPdfAndShareSecurelyArticle.tsx": [
        ('pdf-password-cover.webp', 'pdf-password-cover.jpg'),
        ('pdf-password-mac.webp', 'pdf-password-mac.jpg'),
        ('pdf-password-sharing.webp', 'pdf-password-sharing.jpg'),
        ('pdf-password-audit.webp', 'pdf-password-audit.jpg')
    ],
    "src/components/blog/InvestorDataRoomPermissionsChecklistArticle.tsx": [
        ('investor-data-room-permissions-checklist-cover.png', 'investor-data-room-permissions-checklist-cover.jpg'),
        ('investor-data-room-permissions-checklist-figure-1.png', 'investor-data-room-permissions-checklist-fig1.jpg'),
        ('investor-data-room-permissions-checklist-figure-2.png', 'investor-data-room-permissions-checklist-fig2.jpg'),
        ('investor-data-room-permissions-checklist-figure-3.png', 'investor-data-room-permissions-checklist-fig3.jpg')
    ],
    "src/components/blog/PdfPasswordVsSecureSharingLinkArticle.tsx": [
        ('pdf-password-vs-secure-sharing-link-cover.png', 'pdf-password-vs-secure-sharing-link-cover.jpg'),
        ('pdf-password-vs-secure-sharing-link-figure-1.png', 'pdf-password-vs-secure-sharing-link-fig1.jpg'),
        ('pdf-password-vs-secure-sharing-link-figure-2.png', 'pdf-password-vs-secure-sharing-link-fig2.jpg'),
        ('pdf-password-vs-secure-sharing-link-figure-3.png', 'pdf-password-vs-secure-sharing-link-fig3.jpg')
    ],
    "src/components/blog/SafeDocumentSharingStartupDueDiligenceArticle.tsx": [
        ('safe-document-sharing-startup-due-diligence-cover.png', 'safe-document-sharing-startup-due-diligence-cover.jpg'),
        ('safe-document-sharing-startup-due-diligence-figure-1.png', 'safe-document-sharing-startup-due-diligence-fig1.jpg'),
        ('safe-document-sharing-startup-due-diligence-figure-2.png', 'safe-document-sharing-startup-due-diligence-fig2.jpg'),
        ('safe-document-sharing-startup-due-diligence-figure-3.png', 'safe-document-sharing-startup-due-diligence-fig3.jpg')
    ],
    "src/components/blog/DocumentViewTrackingPrivacyInvestorsArticle.tsx": [
        ('document-view-tracking-privacy-investors-cover.png', 'document-view-tracking-privacy-investors-cover.jpg'),
        ('document-view-tracking-privacy-investors-figure-1.png', 'document-view-tracking-privacy-investors-fig1.jpg'),
        ('document-view-tracking-privacy-investors-figure-2.png', 'document-view-tracking-privacy-investors-fig2.jpg'),
        ('document-view-tracking-privacy-investors-figure-3.png', 'document-view-tracking-privacy-investors-fig3.jpg')
    ]
}

for file_path, reps in comp_replacements.items():
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            c = f.read()
        for old, new in reps:
            c = c.replace(old, new)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(c)
        print(f"Updated {file_path}")

print("All existing blog components updated!")
