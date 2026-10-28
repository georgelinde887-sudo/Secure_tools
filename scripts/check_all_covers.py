import re

with open("src/data/articles.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Let's find each article entry
chunks = re.split(r'\n\s*\{\s*\n\s*id:\s*', content)
print(f"Total chunks: {len(chunks)-1}")

for c in chunks[1:]:
    slug_m = re.search(r"slug:\s*'([^']+)'", c)
    cover_m = re.search(r"coverImage:\s*'([^']*)'", c)
    slug = slug_m.group(1) if slug_m else "UNKNOWN"
    cover = cover_m.group(1) if cover_m else "NONE"
    print(f"{slug} -> {cover}")
