import os, urllib.request, time

# Master dictionary of image filename -> Unsplash photo ID
IMAGE_DOWNLOADS = {
    # 1. Share Financial Model With Investors Securely
    "share-financial-model-investors-securely-cover.jpg": "photo-1554224155-6726b3ff858f",
    "share-financial-model-investors-securely-img1.jpg": "photo-1460925895917-afdab827c52f",
    "share-financial-model-investors-securely-img2.jpg": "photo-1551836022-d5d88e9218df",
    "share-financial-model-investors-securely-img3.jpg": "photo-1551288049-bebda4e38f71",

    # 2. Check Whether Your PDF Is Encrypted
    "check-whether-your-pdf-is-encrypted-cover.jpg": "photo-1563986768609-322da13575f3",
    "check-whether-your-pdf-is-encrypted-img1.jpg": "photo-1526374965328-7f61d4dc18c5",
    "check-whether-your-pdf-is-encrypted-img2.jpg": "photo-1550751827-4bd374c3f58b",
    "check-whether-your-pdf-is-encrypted-img3.jpg": "photo-1510511459019-5dda7724fd87",

    # 3. Zero-Knowledge Encryption Guide
    "zero-knowledge-encryption-guide-cover.jpg": "photo-1558494949-ef010cbdcc31",
    "zero-knowledge-encryption-guide-img1.jpg": "photo-1544197150-b99a580bb7a8",
    "zero-knowledge-encryption-guide-img2.jpg": "photo-1618005182384-a83a8bd57fbe",
    "zero-knowledge-encryption-guide-img3.jpg": "photo-1607799279861-4dd421887fb3",

    # 4. Share Protected PDFs With Screen-Reader Users
    "share-protected-pdfs-with-screen-reader-users-cover.jpg": "photo-1517842645767-c639042777db",
    "share-protected-pdfs-with-screen-reader-users-img1.jpg": "photo-1573496359142-b8d87734a5a2",
    "share-protected-pdfs-with-screen-reader-users-img2.jpg": "photo-1531482615713-2afd69097998",
    "share-protected-pdfs-with-screen-reader-users-img3.jpg": "photo-1522071820081-009f0129c71c",

    # 5. Anonymize Customer Data Before Sharing
    "anonymize-customer-data-before-sharing-cover.jpg": "photo-1504868584819-f8e8b4b6d7e3",
    "anonymize-customer-data-before-sharing-img1.jpg": "photo-1451187580459-43490279c0fa",
    "anonymize-customer-data-before-sharing-img2.jpg": "photo-1516321318423-f06f85e504b3",
    "anonymize-customer-data-before-sharing-img3.jpg": "photo-1507679799987-c73779587ccf",

    # 6. E2EE vs Encryption at Rest
    "e2ee-vs-encryption-at-rest-ma-teams-cover.jpg": "photo-1450133064473-71024230f91b",
    "e2ee-vs-encryption-at-rest-ma-teams-img1.jpg": "photo-1521737604893-d14cc237f11d",
    "e2ee-vs-encryption-at-rest-ma-teams-img2.jpg": "photo-1486406146926-c627a92ad1ab",
    "e2ee-vs-encryption-at-rest-ma-teams-img3.jpg": "photo-1560520653-9e0e4c89eb11",

    # 7. Preventing Leaks in Sales Proposals
    "preventing-leaks-in-sales-proposals-watermarking-cover.jpg": "photo-1552664730-d307ca884978",
    "preventing-leaks-in-sales-proposals-watermarking-img1.jpg": "photo-1557804506-669a67965ba0",
    "preventing-leaks-in-sales-proposals-watermarking-img2.jpg": "photo-1454165804606-c3d57bc86b40",
    "preventing-leaks-in-sales-proposals-watermarking-img3.jpg": "photo-1542744173-8e7e53415bb0",

    # 8. Enterprise File Sharing Checklist
    "enterprise-file-sharing-security-checklist-hero.jpg": "photo-1504384308090-c894fdcc538d",
    "secure-document-workflow.jpg": "photo-1497366216548-37526070297c",
    "enterprise-document-access-governance.jpg": "photo-1497215728101-856f4ea42174",
    "enterprise-file-audit-evidence.jpg": "photo-1486312338219-ce68d2c6f44d",

    # 9. How to Share PDF With Screenshot Protection
    "how-to-share-pdf-with-screenshot-protection-1.jpg": "photo-1516321497487-e288fb19713f",
    "how-to-share-pdf-with-screenshot-protection-2.jpg": "photo-1563013544-824ae1b704d3",
    "how-to-share-pdf-with-screenshot-protection-3.jpg": "photo-1614064641938-3bbee52942c7",
    "how-to-share-pdf-with-screenshot-protection-4.jpg": "photo-1584433144859-1fc3ab64a957",

    # 10. How to Protect PDF With Dynamic Watermark
    "how-to-protect-pdf-with-dynamic-watermark-1.jpg": "photo-1589829545856-d10d557cf95f",
    "how-to-protect-pdf-with-dynamic-watermark-2.jpg": "photo-1505664194779-8beaceb93744",
    "how-to-protect-pdf-with-dynamic-watermark-3.jpg": "photo-1568992687947-868a62a9f521",
    "how-to-protect-pdf-with-dynamic-watermark-4.jpg": "photo-1556761175-5973dc0f32e7",

    # 11. How to Share PDF Without Download
    "pdf-no-download-cover.jpg": "photo-1519389950473-47ba0277781c",
    "pdf-no-download-workflow.jpg": "photo-1522202176988-66273c2fd55f",
    "pdf-no-download-team.jpg": "photo-1515378791036-0648a3ef77b2",
    "pdf-no-download-audit.jpg": "photo-1499750310107-5fef28a66643",

    # 12. How to Password Protect PDF and Share Securely
    "pdf-password-cover.jpg": "photo-1555949963-ff9fe0c870eb",
    "pdf-password-mac.jpg": "photo-1563986768494-4dee2763ff3f",
    "pdf-password-sharing.jpg": "photo-1584438784894-089d6a62b8fa",
    "pdf-password-audit.jpg": "photo-1562774053-701939374585",

    # 13. Investor Data Room Permissions Checklist
    "investor-data-room-permissions-checklist-cover.jpg": "photo-1553877522-43269d4ea984",
    "investor-data-room-permissions-checklist-fig1.jpg": "photo-1559526324-4b87b5e36e44",
    "investor-data-room-permissions-checklist-fig2.jpg": "photo-1507207611509-ec012433ff52",
    "investor-data-room-permissions-checklist-fig3.jpg": "photo-1534972195531-a756b1126f24",

    # 14. PDF Password vs Secure Sharing Link
    "pdf-password-vs-secure-sharing-link-cover.jpg": "photo-1512941937669-90a1b58e7e9c",
    "pdf-password-vs-secure-sharing-link-fig1.jpg": "photo-1516259762381-22954d7d3ad2",
    "pdf-password-vs-secure-sharing-link-fig2.jpg": "photo-1551836022-4c4c79ecde51",
    "pdf-password-vs-secure-sharing-link-fig3.jpg": "photo-1535378917042-10a22c95931a",

    # 15. Safe Document Sharing Startup Due Diligence
    "safe-document-sharing-startup-due-diligence-cover.jpg": "photo-1556761175-b413da4baf72",
    "safe-document-sharing-startup-due-diligence-fig1.jpg": "photo-1517245386807-bb43f82c33c4",
    "safe-document-sharing-startup-due-diligence-fig2.jpg": "photo-1556155092-490a1ba16284",
    "safe-document-sharing-startup-due-diligence-fig3.jpg": "photo-1524178232363-1fb2b075b655",

    # 16. Document View Tracking Privacy Investors
    "document-view-tracking-privacy-investors-cover.jpg": "photo-1526628953301-3e589a6a8b74",
    "document-view-tracking-privacy-investors-fig1.jpg": "photo-1551434678-e076c223a692",
    "document-view-tracking-privacy-investors-fig2.jpg": "photo-1553484771-371a605b060b",
    "document-view-tracking-privacy-investors-fig3.jpg": "photo-1517048676732-d65bc937f952",

    # 17. Virtual Data Room Seed & Series A
    "virtual-data-room-seed-series-a-header.jpg": "photo-1579532537598-459ecdaf39cc",
    "vdr-diligence-structure.jpg": "photo-1498050108023-c5249f4df085",
    "vdr-security-permissions.jpg": "photo-1542744095-fcf48d80b0fd"
}

# Verify NO duplicate photo IDs
seen_ids = {}
has_duplicates = False
for filename, photo_id in IMAGE_DOWNLOADS.items():
    if photo_id in seen_ids:
        print(f"ERROR: Duplicate photo ID {photo_id} used in {filename} and {seen_ids[photo_id]}")
        has_duplicates = True
    seen_ids[photo_id] = filename

if has_duplicates:
    print("FAILED duplicate check!")
    exit(1)

print(f"Verified {len(IMAGE_DOWNLOADS)} completely unique stock images!")

# Target dir
out_dir = "/Users/mohsmedsirajibrahim/Documents/Secure_tools/public/blog-images"
os.makedirs(out_dir, exist_ok=True)

success_count = 0
for filename, photo_id in IMAGE_DOWNLOADS.items():
    dest_path = os.path.join(out_dir, filename)
    if os.path.exists(dest_path) and os.path.getsize(dest_path) > 10000:
        # Already downloaded
        success_count += 1
        continue
    
    url = f"https://images.unsplash.com/{photo_id}?auto=format&fit=crop&w=1200&q=80"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = resp.read()
            with open(dest_path, "wb") as f:
                f.write(data)
            success_count += 1
            print(f"Downloaded [{success_count}/{len(IMAGE_DOWNLOADS)}] {filename} ({len(data)} bytes)")
            time.sleep(0.1) # polite delay
    except Exception as e:
        print(f"FAILED {filename} from {url}: {e}")

print(f"\nDone! {success_count}/{len(IMAGE_DOWNLOADS)} stock images ready in {out_dir}")
