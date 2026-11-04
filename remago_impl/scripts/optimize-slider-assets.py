"""Generate responsive slider WebP files. Requires Python 3 and Pillow."""
import json
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parent.parent
public = root / 'public'
manifest_path = root / 'src/data/optimized-assets.json'
manifest = json.loads(manifest_path.read_text())
output = public / 'assets/optimized'
output.mkdir(exist_ok=True)
sources = sorted([
    *(public / 'assets/products/custom').glob('*.webp'),
    *(public / 'assets/partners/slides').glob('*.webp'),
    *(public / 'assets/services/locations').glob('*.webp'),
    public / 'assets/products/outdoor-board-mascot.webp',
    public / 'assets/services/minsk-locations-map.webp',
])
generated = 0
for source in sources:
    url = '/' + source.relative_to(public).as_posix()
    with Image.open(source) as image:
        width, height = image.size
        entry = {'src': url, 'width': width, 'height': height}
        variants = []
        for target in (384, 640):
            if target >= width:
                continue
            filename = source.relative_to(public / 'assets').with_suffix('').as_posix().replace('/', '-')
            destination = output / f'{filename}-{target}.webp'
            resized = image.resize((target, round(height * target / width)), Image.Resampling.LANCZOS)
            resized.save(destination, 'WEBP', quality=90, method=6)
            # Keep full-size artwork when a thumbnail would cost more bytes.
            if destination.stat().st_size < source.stat().st_size:
                variants.append(f'/{destination.relative_to(public).as_posix()} {target}w')
                generated += 1
            else:
                destination.unlink()
        if variants:
            variants.append(f'{url} {width}w')
            entry['srcSet'] = ', '.join(variants)
        if '/partners/slides/' in url:
            entry['sizes'] = '(max-width: 600px) calc(100vw - 96px), 480px'
        elif '/products/custom/' in url:
            entry['sizes'] = '(max-width: 600px) calc(100vw - 90px), (max-width: 900px) calc(100vw - 200px), 900px'
        manifest[url] = entry
manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
print(f'{len(sources)} assets registered; {generated} responsive variants generated')
