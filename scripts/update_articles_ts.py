import os, sys, re, json

source_folder = "/Users/mohsmedsirajibrahim/Downloads/Secure_Tools_7_Final_Implementation_2026"
articles_dir = os.path.join(source_folder, "articles")

with open(os.path.join(source_folder, "article_manifest.json"), "r") as f:
    manifest = json.load(f)

with open("src/data/articles.ts", "r") as f:
    content = f.read()

for item in manifest:
    slug = item["slug"]
    title = item["title"]
    
    md_path = os.path.join(articles_dir, f"{slug}.md")
    with open(md_path, "r", encoding="utf-8") as f:
        md_text = f.read()
        
    tldr_m = re.search(r">\s*\*\*TL;DR:\*\*\s*(.+?)(?=\n\n##)", md_text, re.DOTALL)
    summary = tldr_m.group(1).strip() if tldr_m else ""
    summary_escaped = summary.replace("'", "\\'")
    
    # TOC
    toc_match = re.search(r"## Table of contents\s*\n\n(.*?)(?=\n\n## )", md_text, re.DOTALL)
    toc_lines = toc_match.group(1).strip().split('\n') if toc_match else []
    toc_items = []
    for line in toc_lines:
        m = re.search(r"\[(.*?)\]\(#(.*?)\)", line)
        if m:
            toc_items.append({"id": m.group(2), "title": m.group(1).replace("'", "\\'")})
            
    # Clean redundant duplicated paragraphs
    # Remove relative image paths and replace with /blog-images/
    clean_md = md_text.replace("../images/", "/blog-images/")
    clean_md_escaped = clean_md.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")
    
    # Update title
    title_pattern = re.compile(r"(slug:\s*['\"]" + slug + r"['\"].*?title:\s*['\"])([^'\"]+)(['\"])", re.DOTALL)
    content = title_pattern.sub(r"\g<1>" + title.replace("'", "\\'") + r"\g<3>", content)
    
    # Update summary
    summary_pattern = re.compile(r"(slug:\s*['\"]" + slug + r"['\"].*?summary:\s*['\"])([^'\"]+)(['\"])", re.DOTALL)
    content = summary_pattern.sub(r"\g<1>" + summary_escaped + r"\g<3>", content)
    
    # Update coverImage
    cover_pattern = re.compile(r"(slug:\s*['\"]" + slug + r"['\"].*?coverImage:\s*['\"])([^'\"]+)(['\"])", re.DOTALL)
    content = cover_pattern.sub(r"\g<1>/blog-images/" + slug + r"-cover.png\g<3>", content)
    
    # Update publishedAt / updatedAt
    date_pattern = re.compile(r"(slug:\s*['\"]" + slug + r"['\"].*?publishedAt:\s*['\"])([^'\"]+)(['\"])", re.DOTALL)
    content = date_pattern.sub(r"\g<1>2026-10-27\g<3>", content)
    
    update_date_pattern = re.compile(r"(slug:\s*['\"]" + slug + r"['\"].*?updatedAt:\s*['\"])([^'\"]+)(['\"])", re.DOTALL)
    content = update_date_pattern.sub(r"\g<1>2026-10-27\g<3>", content)
    
    # Update readTimeMinutes
    read_pattern = re.compile(r"(slug:\s*['\"]" + slug + r"['\"].*?readTimeMinutes:\s*)(\d+)", re.DOTALL)
    content = read_pattern.sub(r"\g<1>14", content)
    
    # Update content backticks
    content_pattern = re.compile(r"(slug:\s*['\"]" + slug + r"['\"].*?content:\s*`)(.*?)(`,\s*sources)", re.DOTALL)
    content = content_pattern.sub(r"\g<1>\n" + clean_md_escaped + r"\n\g<3>", content)

with open("src/data/articles.ts", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated src/data/articles.ts successfully!")
