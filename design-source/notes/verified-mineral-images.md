# Verified mineral photography — Wikimedia Commons

All 20 files below were **existence-checked** (loaded successfully at `?width=400`).
Commons filenames describe their subject, so name + confirmed existence = correct subject.
A wrong name 404s rather than silently showing an unrelated photo (this is why Commons was
chosen over Unsplash numeric IDs, which previously resolved to wrong subjects).

URL pattern:
`https://commons.wikimedia.org/wiki/Special:FilePath/<URL-ENCODED-FILENAME>?width=<W>`

## Confirmed files

| Use | Commons filename | Native size |
|---|---|---|
| Gold (crystals) | `Gold-crystals.jpg` | 500x324 |
| Gold (nuggets) | `Native gold nuggets.jpg` | 347x494 |
| Gold (nugget) | `Golden nugget.jpg` | 500x375 |
| Silver | `Silver crystal.jpg` | 500x392 |
| Platinum (crystals) | `Platinum crystals.jpg` | 500x350 |
| Platinum (nugget) | `Platinum-nugget.jpg` | 500x345 |
| Diamond | `Rough diamond.jpg` | 360x271 |
| Emerald | `Smaragd.jpg` (German for emerald) | 500x375 |
| Copper (macro) | `Native Copper Macro Digon3.jpg` | 500x448 |
| Copper (native) | `NatCopper.jpg` | 500x473 |
| Lithium ore | `Spodumene.jpg` | 500x339 |
| Lithium (refined) | `Lithium carbonate.jpg` | 500x383 |
| Lithium (mica) | `Lepidolite.jpg` | 500x343 |
| Lithium (petalite) | `Petalite.jpg` | 500x376 |
| Quartz | `Quartz Brésil.jpg` | 500x426 |
| Coal | `Coal anthracite.jpg` | 360x337 |
| Iron ore | `Hematite.jpg` | 500x482 |
| Mine site | `Gold mine.jpg` | 500x333 |
| Open pit | `Open pit mine.jpg` | 500x376 |
| Lab / assay | `Chemistry laboratory.jpg` | 500x345 |

## Not found (keep gradient, or source later)
Ruby, sapphire, limestone, gypsum, mica, nickel, cobalt, uranium,
logistics/truck, vault.

## Application plan (NOT YET APPLIED — app currently uses gradients)

Add to logic class:

```js
CIMG = (f, w) => 'https://commons.wikimedia.org/wiki/Special:FilePath/'
  + encodeURIComponent(f) + '?width=' + (w || 800);
```

Then set backgrounds as **photo layered over the existing gradient** so the gradient
remains a fallback if the network is unavailable:

```js
bg: 'url("' + this.CIMG('Gold-crystals.jpg') + '") center/cover, ' + grad
```

### Targets
- `PRODUCTS[]` — gold, silver, platinum, diamond, emerald, copper, lithium, quartz
- `CATS[]` — precious (gold), gemstone (diamond), industrial (quartz),
  critical (copper), energy (coal)
- `AUCS[]` — a1 gold, a2 emerald, a3 copper, a4 platinum, a5 diamond
- `ORDERS[]` — matching mineral thumbnails
- `COURSES[]` — ASM courses use `Gold mine.jpg` / `Open pit mine.jpg` /
  `Chemistry laboratory.jpg`
- `CHAPTERS[]` (How it works) — 1 mine site, 2 gold, 3 lab, 4 gold bars/vault, 5 open pit
- Home hero, Academy hero, Mining hero

## Applied — current state

All images are applied as a photo layer **over** the original gradient, so the gradient
remains the fallback:

```
background: url('<commons-url>') center/cover, linear-gradient(...)
```

### CRITICAL: quoting rule
- **Logic class (`grad:` values)** — these are JS strings fed to React style objects.
  Double quotes inside are safe: `grad:'url("https://...") center/cover, linear-gradient(...)'`
- **Template (inline `style="..."`)** — MUST use **single** quotes: `url('https://...')`.
  Double quotes terminate the HTML style attribute early, which:
  silently blanks the image, injects junk attributes (`https:`, `commons.wikimedia.org`,
  `special:filepath`), and `special:filepath` is an invalid XML QName that makes
  DOM→SVG serialization fail — breaking PNG export, standalone bundling and PDF export.
  This bit us once on the 3 hero sections; fixed.

### Resolution upgrades
- `Rough diamond.jpg` (360x271, too soft for the measured 850x360 full-bleed detail hero)
  → replaced with **`Amity Diamonds diamante Uncut-En-Bruto.jpg`** (1280x1640)

  NOTE: an interim swap to `Diamonds.jpg` was WRONG and was reverted. A generic
  "Diamonds" file predominantly depicts cut/polished brilliants, so it failed the
  subject-verification standard used here — and rough-vs-cut is the single most
  price-determinative attribute for a diamond lot. The replacement is grounded twice:
  it is a member of `Category:Rough_diamonds` AND its filename encodes "Uncut".
- `Coal anthracite.jpg` (360x337) → replaced with `Bituminous coal.jpg` (1280x1707)
- All product/category/auction images now request `?width=1200`; heroes `?width=1400`

### Known limitation: exports
These are **hotlinked remote** images. They render correctly in the live app, but they
cannot be embedded by the DOM→image capture path, so they appear blank in:
PNG export (snapshot_element), standalone-HTML bundling, and PDF export.

Localising them is **not possible in this sandbox** — `crossOrigin='anonymous'` load
fails and the opaque origin blocks `fetch`, so pixels can't be read into a canvas to save
locally. To make exports pixel-complete, the image files must be uploaded into the
project manually (then swap the Commons URLs for `assets/` paths).

## Sourcing method (use this, do not guess filenames)

Guessing filenames is unreliable (a 21-name batch resolved only 4). Query the Commons
category API instead — **category membership verifies the subject**, which is stronger
grounding than the filename alone:

```
https://commons.wikimedia.org/w/api.php?action=query&list=categorymembers
  &cmtitle=Category:Rough_diamonds&cmtype=file&cmlimit=40&format=json&origin=*
```

`origin=*` is required for CORS. Then existence/size-check each returned title at
`?width=1200` before use. Prefer a file whose **category and filename agree**.
(`Category:Diamond_crystals` and `Category:Uncut_diamonds` are empty — use
`Category:Rough_diamonds`.)
