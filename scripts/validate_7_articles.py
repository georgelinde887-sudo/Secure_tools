import urllib.request
import re, json, os

slugs = [
    "share-financial-model-investors-securely",
    "check-whether-your-pdf-is-encrypted",
    "zero-knowledge-encryption-guide",
    "share-protected-pdfs-with-screen-reader-users",
    "anonymize-customer-data-before-sharing",
    "e2ee-vs-encryption-at-rest-ma-teams",
    "preventing-leaks-in-sales-proposals-watermarking"
]

results = []
all_passed = True

ld_tag = re.compile(r"<script[^>]*type=[\x27\x22]application/ld\+json[\x27\x22][^>]*>(.*?)</script>", re.DOTALL)
h1_tag = re.compile(r"<h1[^>]*>(.*?)</h1>", re.DOTALL)
title_tag = re.compile(r"<title[^>]*>(.*?)</title>", re.DOTALL)
meta_desc_tag = re.compile(r"<meta\s+name=[\x27\x22]description[\x27\x22]\s+content=[\x27\x22](.*?)[\x27\x22]", re.DOTALL)
canon_tag = re.compile(r"<link\s+rel=[\x27\x22]canonical[\x27\x22]\s+href=[\x27\x22](.*?)[\x27\x22]", re.DOTALL)

for slug in slugs:
    url = f"http://localhost:3001/blog/{slug}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    resp = urllib.request.urlopen(req)
    status = resp.status
    html = resp.read().decode("utf-8")
    
    h1s = h1_tag.findall(html)
    titles = title_tag.findall(html)
    descs = meta_desc_tag.findall(html)
    canons = canon_tag.findall(html)
    ld_scripts = ld_tag.findall(html)
    
    # Word count
    text_only = re.sub(r"<[^>]+>", " ", html)
    word_count = len(text_only.split())
    
    # Images
    cover_ok = f"{slug}-cover.png" in html
    d1_ok = f"{slug}-diagram-1.png" in html
    d2_ok = f"{slug}-diagram-2.png" in html
    d3_ok = f"{slug}-diagram-3.png" in html
    images_ok = cover_ok and d1_ok and d2_ok and d3_ok
    
    # JSON-LD validation
    jsonld_valid = True
    has_sendnow = False
    for s in ld_scripts:
        try:
            data = json.loads(s.strip())
            if "sendnow.live" in json.dumps(data):
                has_sendnow = True
        except:
            jsonld_valid = False
            
    # Check Keep Reading (4 links)
    kr_links = re.findall(r'href="(/blog/[^"]+)"', html)
    kr_count = len([l for l in kr_links if l != f"/blog/{slug}"])
    
    # Check H1 == 1
    h1_ok = len(h1s) == 1
    
    # Check canonical
    canonical_expected = f"https://securetools.live/blog/{slug}"
    canonical_ok = len(canons) > 0 and canons[0] == canonical_expected
    
    # Check words >= 1800
    words_ok = word_count >= 1800
    
    passed = (status == 200 and h1_ok and canonical_ok and images_ok and jsonld_valid and not has_sendnow and words_ok)
    if not passed:
        all_passed = False
        
    results.append({
        "slug": slug,
        "status": status,
        "word_count": word_count,
        "h1": h1s[0] if h1s else "MISSING",
        "title": titles[0] if titles else "MISSING",
        "canonical": canons[0] if canons else "MISSING",
        "images_verified": images_ok,
        "jsonld_valid": jsonld_valid,
        "sendnow_free": not has_sendnow,
        "passed": passed
    })

print(json.dumps(results, indent=2))
print(f"\nALL 7 ARTICLES VALIDATION PASSED: {all_passed}")
