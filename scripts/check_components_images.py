import glob, re, os

components = glob.glob("src/components/blog/*.tsx")
for c in sorted(components):
    with open(c, "r", encoding="utf-8") as f:
        text = f.read()
    # Find all Image src or <img> src or markdown image references
    imgs = re.findall(r'<Image[^>]+src=["\x27]([^"\x27]+)["\x27]', text)
    imgs += re.findall(r'src=["\x27]([^"\x27]+\.(?:webp|png|jpg|jpeg))["\x27]', text)
    imgs = sorted(list(set(imgs)))
    print(f"\n=== {os.path.basename(c)} ===")
    for img in imgs:
        print(f"  {img}")
