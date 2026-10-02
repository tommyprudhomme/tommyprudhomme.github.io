"""Convertit les photos du salon en WebP optimisés et responsives."""
import os
from PIL import Image

SRC = 'img_dogs_sources'
OUT = 'img_dogs'
WIDTHS = [480, 960, 1600]
QUALITY = 80

# dog1.jpg (fourni par le client) remplace husky.webp comme photo principale.
# Ordre de la galerie conservé + jessy en dog13 (section « Le salon »)
MAPPING = [
    ('dog1.jpg',        'dog1'),
    ('Untitled.jpg',    'dog2'),
    ('Untitled2.jpg',   'dog3'),
    ('Untitled3.jpg',   'dog4'),
    ('Untitled4.jpg',   'dog5'),
    ('Untitled5.jpg',   'dog6'),
    ('Untitled6.jpg',   'dog7'),
    ('Untitled7.jpg',   'dog8'),
    ('Untitled8.jpg',   'dog9'),
    ('Untitle9d.jpg',   'dog10'),
    ('Untitled10.jpg',  'dog11'),
    ('zoro.webp',       'dog12'),
    ('jessy.webp',      'dog13'),
]

results = []
for src_name, dog in MAPPING:
    src_path = os.path.join(SRC, src_name)
    im = Image.open(src_path).convert('RGB')
    w, h = im.size
    # cibles : largeurs demandées plus petites que l'original, puis l'original (toujours)
    targets = sorted({t for t in WIDTHS if t < w} | {w})
    variants = []
    for tw_eff in targets:
        th_eff = round(h * tw_eff / w) if tw_eff != w else h
        out = os.path.join(OUT, f'{dog}-{tw_eff}w.webp')
        im.resize((tw_eff, th_eff), Image.LANCZOS).save(
            out, 'WEBP', quality=QUALITY, method=6)
        variants.append({'w': tw_eff, 'h': th_eff, 'file': f'{dog}-{tw_eff}w.webp'})
    results.append({'dog': dog, 'src': src_name, 'orig': [w, h], 'variants': variants})

# Rapport + données prêtes pour le JS
total = 0
for r in results:
    sizes = ', '.join(f"{v['file']}: {os.path.getsize(os.path.join(OUT, v['file']))//1024} Ko" for v in r['variants'])
    total += sum(os.path.getsize(os.path.join(OUT, v['file'])) for v in r['variants'])
    print(r['dog'], r['src'], r['orig'], '->', sizes)
print(f'TOTAL: {total//1024} Ko')

import json
with open('variants.json', 'w') as f:
    json.dump(results, f, indent=2)
