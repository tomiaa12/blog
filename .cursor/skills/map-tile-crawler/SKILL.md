---

name: map-tile-crawler
description: Analyze and download web map tile assets from a website. Use when a task involves crawling map tiles, discovering XYZ/TMS/custom tile URL patterns, reverse-engineering Leaflet/OpenLayers/MapLibre map configurations, determining zoom/X/Y tile ranges, downloading tile images efficiently, validating missing or duplicate tiles, generating local tile datasets, stitching tiles into large map images, extracting map location/category JSON, adding official localized name fields such as title_zh, or serving downloaded tiles locally. Always create the dataset project as `{slug}-map-tile`. Trigger for URLs containing map interfaces, tile paths such as /{z}/{x}/{y}.png, /{z}/{x}_{y}.jpg, /tiles/, /tile/, /maps/, or when the user asks to download/offline/cache/back up a web map.

---

# Map Tile Crawler

Analyze a web map and turn its remotely loaded map tiles into a reproducible local dataset.

The primary goal is to discover the actual tile source and coordinate system before downloading anything. Do not blindly brute-force URLs unless discovery has failed.

## Core workflow

Always follow this order:

1. Identify the map technology.
2. Identify the tile URL template.
3. Identify the tile coordinate system.
4. Identify available layers.
5. Identify zoom levels.
6. Determine X/Y ranges.
7. Estimate the number and size of tiles.
8. Ask for confirmation before starting a potentially large download.
9. Download concurrently with rate limiting.
10. Validate every downloaded tile.
11. Record failures and metadata.
12. Optionally generate a local tile server or stitched image.

Prefer discovery over brute force.

---

# 0. Project naming and bundled scripts

Create a **new sibling dataset project** for every crawl. The folder name **must** end with `-map-tile`:

```text
{slug}-map-tile
```

Examples:

```text
zelda-botw-hyrule-map-tile
pubg-erangel-map-tile
```

Do not put hundreds of thousands of tiles inside the blog repo.

Required layout:

```text
{slug}-map-tile/
├── README.md
├── crawl_tiles.py          # local only, never git add
├── extract_locations.py    # local only, never git add
├── add_zh_names.py         # local only, never git add
├── data/
│   ├── source.json
│   ├── index.json
│   ├── manifest.json
│   ├── locations.json
│   ├── categories.json
│   ├── regions.json
│   └── names_zh.json
└── tiles/
    └── <layer>/
        └── {z}/{x}/{y}.<ext>
```

### Git policy

**Hard rule: never commit download/extract scripts to the dataset git repo.**

Scripts that must stay local / gitignored:

```text
crawl_tiles.py
extract_locations.py
add_zh_names.py
any other crawler/downloader/extractor .py created in the dataset project
```

Canonical copies live only in the skill:

```text
.cursor/skills/map-tile-crawler/scripts/
```

Copy them into `{slug}-map-tile/` for local use, but they must be in `.gitignore`.

When initializing or pushing `{slug}-map-tile`, always write/update `.gitignore` first, then `git add` only `README.md`, `data/`, and `tiles/`. Never `git add *.py` in the dataset project.

If scripts were already committed, `git rm --cached` them and keep the working copies on disk.

### Announce the repo name before download

As soon as `{slug}` is known — **before** starting the tile download — tell the user the exact GitHub repo to create:

```text
仓库名：{slug}-map-tile
远程：git@github.com:tomiaa12/{slug}-map-tile.git
新建空仓库：https://github.com/new?name={slug}-map-tile
要求：公开、不要勾选 README / .gitignore / license
```

Do not wait for tiles to finish before saying this. The user can create the empty public repo by hand while the crawler runs.

### Write the blog map page during download

Do not sit idle while tiles download. After discovery (template, layers, zoom, bounds, start lat/lng, category titles) is enough:

1. Start `crawl_tiles.py` in the background.
2. In parallel, add the blog page the same way as existing maps (`botw-map` / `gta-vc-map` / `wukong-map`):
   - `src/zh/pages/{slug}-map.md`
   - `src/zh/pages/components/{slug}Map.vue`
   - local `names_zh` / `bounds` JSON under `src/zh/pages/components/map/`
   - nav item in `src/config.ts` 游戏 menu
3. Point tiles at jsDelivr `@master` with raw.githubusercontent.com fallback.
4. Finish extract / `title_zh` / README in the dataset project while the crawler is still running when possible.

Push the dataset repo as soon as the remote exists and the download has produced a valid first commit (or after download completes). Do not block page coding on `git push`.

### Publish with GitHub MCP

Use the GitHub MCP server `plugin-github-github` to create the repo when the user asks to publish. Do this **as early as possible** (right after announcing the name), not only after the download finishes.

1. Call `get_me` to confirm the account. This project uses `tomiaa12`.
2. Call `create_repository`:
   - `name`: `{slug}-map-tile`
   - `private`: `false` (jsDelivr / raw.githubusercontent.com need a public repo)
   - `autoInit`: `false` (empty repo so the first local commit can be pushed)
   - `description`: short dataset summary
3. If `create_repository` returns 401/403, call `mcp_auth` on the same server, then retry once.
4. If MCP is missing, still 403, or `mcp_auth` does not help: **do not stop the crawl**. Tell the user MCP 不可用，请手动创建上面的空公开仓库，建好后把 SSH 地址发回来。Keep downloading and writing the blog page.
5. Locally initialize and push. Do **not** use `push_files` for tiles (thousands of binaries). `push_files` is only for a handful of text files.

```text
git init -b master
git remote add origin git@github.com:{login}/{slug}-map-tile.git
git add .gitignore README.md data/ tiles/
git commit
git push -u origin HEAD
```

Never `git add *.py` in the dataset project.

Required `.gitignore` for every `{slug}-map-tile` repo:

```gitignore
# download / extract scripts — keep local, never commit
crawl_tiles.py
extract_locations.py
add_zh_names.py
*.py

__pycache__/
*.pyc
data/failures.jsonl
data/page.html
```

Listing the known script names plus `*.py` is the safe default. If a non-crawler Python file is truly needed in the repo, un-ignore it explicitly (for example `!serve.py`).

Copy and adapt the reference scripts from this skill:

```text
.cursor/skills/map-tile-crawler/scripts/crawl_tiles.py
.cursor/skills/map-tile-crawler/scripts/extract_locations.py
.cursor/skills/map-tile-crawler/scripts/add_zh_names.py
```

`crawl_tiles.py` is the preferred downloader: stdlib only, resume, JPEG/PNG magic check, 429 backoff, sliding-window futures (`max_in_flight = workers * 4`). Fill in `TEMPLATE`, `REFERER`, `BOUNDS`, and `TILE_DIR` after discovery.

`extract_locations.py` splits map JSON into `locations.json` / `regions.json` / `categories.json`. If a name field is English, add a sibling locale field using **official in-game Chinese**, not a free translation:

```text
title → title_zh
subtitle → subtitle_zh
```

Keep the original English field. Skip the locale field when no official name is known.

---

# 1. Scope and safety

Only download resources that the user is authorized to access.

Respect:

* robots.txt when applicable
* website terms of service
* copyright and map licensing
* authentication requirements
* rate limits
* server load

Do not bypass:

* authentication
* access controls
* signed URL protections
* anti-bot challenges
* CAPTCHA
* paywalls
* authorization tokens belonging to another user

If tiles require credentials, cookies, API keys, or signed URLs, explain what is required instead of attempting to circumvent access controls.

Do not generate aggressive request patterns.

Default concurrency:

```text
4 workers
```

Maximum default concurrency:

```text
8 workers
```

Use a configurable delay between requests.

If the server returns:

```text
429
403
5xx
```

reduce concurrency and use exponential backoff.

---

# 2. First identify the map implementation

Before downloading tiles, inspect the website.

Look for:

```text
Leaflet
OpenLayers
MapLibre
Mapbox GL
Google Maps
Cesium
ArcGIS
Bing Maps
Wikimedia
custom canvas renderer
custom image viewer
```

Search page HTML and JavaScript for:

```text
L.map
L.tileLayer
L.GridLayer
tileLayer
OpenLayers
ol/source/XYZ
ol/source/TileImage
MapLibre
mapbox
raster
source
tiles
tileUrl
tileURL
urlTemplate
template
/{z}/
/{x}/
/{y}/
{z}
{x}
{y}
zoom
minZoom
maxZoom
bounds
```

For custom applications also search for:

```text
assets/maps
/maps/
tiles/
tile/
map/
images/
jpg
jpeg
png
webp
```

---

# 3. Network-first discovery

If browser DevTools or browser automation is available, prefer Network inspection over static source inspection.

Open the target page and reload it.

Filter requests by:

```text
Img
Fetch/XHR
JS
```

Search request URLs for:

```text
tile
tiles
map
maps
/{z}/
/{x}/
/{y}/
jpg
jpeg
png
webp
```

A map tile request usually looks like:

```text
https://example.com/tiles/4/10/4.png
```

or:

```text
https://example.com/assets/maps/detailed/4/10_4.jpg
```

or:

```text
https://a.example.com/{z}/{x}/{y}.png
```

Record at least one confirmed successful tile.

Example:

```text
URL:
https://map.doubi.run/assets/maps/detailed/4/10_4.jpg

status:
200

content-type:
image/jpeg
```

Do not assume the URL pattern from one request until it has been validated against nearby coordinates.

---

# 4. Static JavaScript analysis

If Network inspection is unavailable, inspect the loaded JavaScript.

Find:

```text
<script src="...">
```

Download or inspect the relevant JavaScript files.

Search them for:

```text
tileLayer
TileLayer
GridLayer
tileUrl
tileURL
urlTemplate
template
assets/maps
detailed
default
dark
black
satellite
terrain
```

For minified JavaScript, search for distinctive path fragments.

For example:

```text
/assets/maps/detailed/
```

is more useful than searching for:

```text
map
```

because "map" will usually occur thousands of times.

---

# 5. Detect the tile URL pattern

Normalize the discovered URL into a template.

Examples:

```text
/assets/maps/detailed/4/10_4.jpg
```

may become:

```text
/assets/maps/detailed/{z}/{x}_{y}.jpg
```

A standard XYZ pattern:

```text
/tiles/4/10/4.png
```

becomes:

```text
/tiles/{z}/{x}/{y}.png
```

A TMS pattern may use:

```text
/tiles/{z}/{x}/{invertedY}.png
```

A quadkey system may use:

```text
/{quadkey}.jpg
```

A custom map may use:

```text
/{layer}/{level}/{column}_{row}.jpg
```

Do not force every map into XYZ.

Store the discovered pattern explicitly.

Example metadata:

```json
{
  "template": "https://example.com/assets/maps/detailed/{z}/{x}_{y}.jpg",
  "scheme": "custom",
  "xParameter": "x",
  "yParameter": "y",
  "zoomParameter": "z",
  "extension": "jpg"
}
```

---

# 6. Validate X/Y semantics

A URL containing:

```text
4/10_4.jpg
```

does not automatically prove:

```text
z = 4
x = 10
y = 4
```

Test neighboring coordinates.

For example:

```text
4/10_4.jpg
4/11_4.jpg
4/10_5.jpg
4/9_4.jpg
4/10_3.jpg
```

Compare the resulting images.

Determine whether:

```text
first coordinate = X
second coordinate = Y
```

or the reverse.

Also test Y orientation.

XYZ:

```text
Y increases downward
```

TMS:

```text
Y increases upward
```

If necessary:

```text
tmsY = (2^z - 1) - y
```

Do not assume TMS unless evidence supports it.

---

# 7. Detect tile dimensions

Inspect the first successful tile.

Record:

```text
width
height
format
file size
```

Typical values:

```text
256x256
512x512
```

Do not assume 256.

Example metadata:

```json
{
  "tileWidth": 256,
  "tileHeight": 256,
  "format": "jpg"
}
```

---

# 8. Detect map layers

Many websites contain multiple tile layers.

Look for names such as:

```text
default
detailed
dark
black
satellite
terrain
road
labels
hybrid
```

For each layer record:

```text
name
URL template
minimum zoom
maximum zoom
tile format
tile size
```

Example:

```json
{
  "layers": [
    {
      "name": "default",
      "template": "https://example.com/assets/maps/default/{z}/{x}_{y}.jpg"
    },
    {
      "name": "detailed",
      "template": "https://example.com/assets/maps/detailed/{z}/{x}_{y}.jpg"
    }
  ]
}
```

If the user asks for the detailed map, download only that layer.

Do not download every layer by default.

---

# 9. Determine zoom levels

Search configuration for:

```text
minZoom
maxZoom
minzoom
maxzoom
zoomLevels
zoom
levels
```

If configuration cannot be found, probe carefully.

Start with a known successful zoom.

Example:

```text
z = 4
```

Then test:

```text
z = 0
z = 1
z = 2
z = 3
z = 4
z = 5
...
```

Do not scan indefinitely.

Default maximum probe:

```text
z = 0..18
```

Stop when multiple consecutive zoom levels have no valid tiles, unless the site configuration indicates otherwise.

---

# 10. Determine X/Y bounds

Do not immediately brute-force:

```text
x = 0..1000
y = 0..1000
```

Use a progressive search.

## Strategy A: configuration

Best case:

```text
bounds
worldSize
extent
maxX
maxY
```

Use those values directly.

## Strategy B: neighboring tile expansion

Start from a known valid tile:

```text
(z, x, y)
```

Check:

```text
x-1,y
x+1,y
x,y-1
x,y+1
```

Expand outward until boundaries are detected.

## Strategy C: binary/progressive probing

If the map has a regular grid but the range is unknown:

1. Probe exponentially:

```text
1
2
4
8
16
32
64
128
256
512
```

2. Once a boundary is found, binary search it.

This is much more efficient than scanning every coordinate.

---

# 11. Handle sparse tile grids

Some maps do not contain a complete rectangle.

For example:

```text
z=4

xxxxxx
xxxxxx
xx..xx
xx..xx
xxx.xx
```

Do not treat missing tiles as errors automatically.

Record:

```text
existing tiles
missing tiles
```

A 404 can mean:

```text
outside map bounds
```

rather than a failed download.

Store missing coordinates separately.

---

# 12. Estimate download size before downloading

Calculate:

```text
tileCount = number of existing tiles
```

Estimate storage:

```text
estimatedSize =
    averageTileSize * tileCount
```

Example:

```text
12,000 tiles
average 35 KB

≈ 420 MB
```

If the estimated download is large, tell the user before downloading.

Suggested thresholds:

```text
< 100 MB      small
100 MB–1 GB   medium
1–10 GB       large
> 10 GB       very large
```

Do not start a multi-GB download silently.

---

# 13. Download architecture

Use concurrent workers.

Recommended:

```text
workers = 4
timeout = 15 seconds
retries = 3
```

Use exponential backoff:

```text
1s
2s
4s
8s
```

Respect:

```text
429 Retry-After
```

If the server returns repeated 429 responses:

```text
workers = workers / 2
```

until reaching:

```text
workers = 1
```

---

# 14. Resume support

Downloads must be resumable.

Before downloading:

```text
if target file exists
and file size > 0
and image validation succeeds:
    skip
```

Do not redownload valid tiles.

Store a manifest:

```text
manifest.json
```

Example:

```json
{
  "source": "https://example.com",
  "layer": "detailed",
  "template": "https://example.com/assets/maps/detailed/{z}/{x}_{y}.jpg",
  "scheme": "custom",
  "tileWidth": 256,
  "tileHeight": 256,
  "downloads": {
    "success": 12000,
    "failed": 13,
    "skipped": 4000
  }
}
```

---

# 15. Recommended local directory structure

Use a project named `{slug}-map-tile`:

```text
{slug}-map-tile/
├── crawl_tiles.py          # local only, never git add
├── extract_locations.py    # local only, never git add
├── add_zh_names.py         # local only, never git add
├── data/
└── tiles/
    └── <layer>/
        ├── 0/
        │   ├── 0_0.jpg
        │   └── ...
        └── 4/
            ├── 10_4.jpg
            └── ...
```

Python download/extract scripts are local-only. They belong in `.gitignore` and must never be committed. Canonical copies live in `.cursor/skills/map-tile-crawler/scripts/`.

For standard XYZ:

```text
output/
└── tiles/
    └── detailed/
        └── 4/
            └── 10/
                └── 4.jpg
```

Preserve the original coordinate naming when possible.

Do not silently convert coordinates.

---

# 16. Image validation

A successful HTTP 200 response does not guarantee a valid tile.

Validate:

```text
Content-Type
file signature
image dimensions
file size
```

Reject:

```text
HTML error page
JSON error
empty response
corrupted JPEG/PNG
```

Common problem:

```text
HTTP 200
Content-Type: text/html
```

This is not a valid tile.

Use an image parser where available.

---

# 17. Detect placeholder tiles

Some servers return a valid image for nonexistent tiles.

For example:

```text
HTTP 200
1x1 image
```

or:

```text
"tile not available"
```

Detect repeated identical tiles.

Calculate:

```text
SHA-256
```

or perceptual hashes.

If hundreds of different coordinates return exactly the same image:

```text
likely placeholder
```

Record the placeholder hash and exclude it from the tile dataset.

---

# 18. Generate a tile index

After downloading, generate:

```text
index.json
```

Example:

```json
{
  "layer": "detailed",
  "scheme": "custom",
  "tileWidth": 256,
  "tileHeight": 256,
  "levels": {
    "4": {
      "minX": 0,
      "maxX": 20,
      "minY": 0,
      "maxY": 15,
      "count": 294
    }
  }
}
```

This allows later tools to understand the dataset without re-crawling the website.

---

# 19. Optional: generate a local tile server

If the user wants to use the downloaded map in a browser, provide a simple local tile server.

For example:

```text
http://127.0.0.1:8787/tiles/detailed/4/10_4.jpg
```

The server should map:

```text
/tiles/{layer}/{z}/{x}_{y}.jpg
```

to:

```text
output/tiles/{layer}/{z}/{x}_{y}.jpg
```

Support CORS for local development:

```text
Access-Control-Allow-Origin: *
```

Do not expose the local server to the public network unless explicitly requested.

---

# 20. Optional: generate Leaflet configuration

For a standard XYZ dataset:

```javascript
L.tileLayer(
  'http://127.0.0.1:8787/tiles/detailed/{z}/{x}/{y}.jpg',
  {
    minZoom: 0,
    maxZoom: 4,
    tileSize: 256
  }
).addTo(map);
```

For a custom `{x}_{y}` scheme, use a custom GridLayer or URL function.

Leaflet's normal TileLayer uses URL templates containing `{z}`, `{x}`, and `{y}`, and supports options such as `minZoom`, `maxZoom`, `tileSize`, and TMS Y inversion.

Do not pretend a custom coordinate system is standard XYZ.

---

# 21. Optional: stitch tiles into large images

Only stitch when the user explicitly requests a large image.

For each zoom:

```text
minX
maxX
minY
maxY
```

Calculate:

```text
width =
    (maxX - minX + 1) * tileWidth

height =
    (maxY - minY + 1) * tileHeight
```

Place:

```text
tile(x,y)
```

at:

```text
(
    (x - minX) * tileWidth,
    (y - minY) * tileHeight
)
```

Do not load the entire image into memory when dimensions become large.

Prefer streaming or tiled output.

For very large maps, use:

```text
BigTIFF
Deep Zoom
IIIF
MBTiles
tile pyramid
```

instead of a single enormous JPEG.

---

# 22. Optional: generate MBTiles

If the user wants an offline GIS/map package, MBTiles is often preferable to thousands of loose files.

Before converting:

```text
scheme
zoom
x
y
tile format
```

must be known.

For XYZ → MBTiles, remember that MBTiles commonly stores TMS row numbering.

Conversion may require:

```text
tmsY = (2^z - 1) - xyzY
```

Do not perform this conversion unless the source coordinate scheme has been established.

---

# 23. Browser-based discovery fallback

If direct HTTP requests cannot discover the tile URL:

Use browser automation.

Preferred order:

```text
Playwright
Chrome DevTools Protocol
browser extension
manual DevTools
```

Listen to network requests and collect:

```text
request.url
response.status
response.headers["content-type"]
```

Filter for image requests.

Example conceptual logic:

```javascript
page.on('response', response => {
  const url = response.url();
  const contentType =
    response.headers()['content-type'] || '';

  if (
    contentType.startsWith('image/') ||
    /tile|tiles|maps|map/i.test(url)
  ) {
    console.log(response.status(), url);
  }
});
```

The goal is discovery, not screenshotting the map.

---

# 24. Handle JavaScript-generated URLs

Some applications construct URLs dynamically:

```javascript
const url =
  base +
  '/' +
  zoom +
  '/' +
  x +
  '_' +
  y +
  '.jpg';
```

Infer the template from:

```text
base
zoom
x
y
extension
```

If the URL is generated through a function, inspect its callers.

Example:

```javascript
getTileUrl(x, y, z)
```

This is stronger evidence than guessing from the DOM.

---

# 25. Handle URL parameters

Preserve required query parameters.

Example:

```text
https://example.com/tile/{z}/{x}/{y}.jpg?style=detailed
```

Do not remove:

```text
style
layer
version
format
retina
```

unless confirmed unnecessary.

If a token expires, report that the source uses temporary authorization.

Do not attempt to bypass token expiration.

---

# 26. Handle retina tiles

Some sites use:

```text
@2x
```

or:

```text
512x512
```

Record:

```json
{
  "tileWidth": 512,
  "tileHeight": 512,
  "pixelRatio": 2
}
```

Do not treat 512x512 retina tiles as a different zoom level.

---

# 27. Handle multiple subdomains

Example:

```text
https://a.example.com/{z}/{x}/{y}.png
https://b.example.com/{z}/{x}/{y}.png
https://c.example.com/{z}/{x}/{y}.png
```

These are usually equivalent tile servers.

Download from one host unless the user explicitly needs all hosts.

Do not multiply requests unnecessarily.

---

# 28. Handle HTTP headers

Some tile servers require:

```text
Referer
User-Agent
Accept
Accept-Language
```

Use normal browser-like headers when necessary.

Do not fabricate authentication credentials.

If a normal browser can access the tile but a script cannot, investigate headers and CORS first.

Remember:

```text
CORS affects browser JavaScript.
CORS does not normally prevent a server-side HTTP client from downloading a public resource.
```

---

# 29. Handle authentication

If the map requires authentication:

1. Determine whether the user is already authenticated.
2. Use an authorized browser session if available.
3. Do not ask the user to provide passwords.
4. Do not extract or persist sensitive cookies unnecessarily.
5. Do not bypass access controls.

Prefer exporting only the minimum required non-sensitive request information.

---

# 30. Detect map bounds from configuration

Search for:

```text
bounds
maxBounds
center
extent
projection
worldCopyJump
crs
coordinate
origin
resolution
scale
```

For non-geographic maps, especially game maps, the coordinate system may not correspond to:

```text
latitude
longitude
EPSG:3857
```

Do not force geographic coordinates.

Treat the map as a pixel/tile coordinate plane when appropriate.

---

# 31. Special handling for game maps

Game maps often differ from geographic maps.

Common characteristics:

```text
custom CRS
no latitude/longitude
fixed image plane
custom origin
custom zoom hierarchy
non-standard tile names
```

For these maps prioritize:

```text
tile coordinate
pixel coordinate
image dimensions
map bounds
zoom hierarchy
```

over:

```text
GPS
EPSG:3857
standard slippy-map assumptions
```

If the source contains:

```text
detailed
default
dark
black
```

treat these as visual layers rather than geographic projections unless configuration proves otherwise.

---

# 32. Example: custom tile URL

Suppose the website requests:

```text
https://map.example.com/assets/maps/detailed/4/10_4.jpg
```

Infer the candidate:

```text
https://map.example.com/assets/maps/detailed/{z}/{x}_{y}.jpg
```

Then validate:

```text
/4/9_4.jpg
/4/10_4.jpg
/4/11_4.jpg
/4/10_3.jpg
/4/10_5.jpg
```

If neighboring tiles exist and their visual content aligns correctly, accept the pattern.

Then determine the complete range.

---

# 33. Example project output

A successful crawl should produce:

```text
example-hyrule-map-tile/
├── tiles/
│   └── detailed/
│       ├── 0/
│       ├── 1/
│       ├── 2/
│       ├── 3/
│       └── 4/
│
├── metadata.json
├── index.json
├── failed.json
├── crawl.log
└── README.md
```

Do not list or commit crawler/download/extract scripts (`crawl_tiles.py`, `extract_locations.py`, `add_zh_names.py`, `crawler.py`, or any other `.py`). Scripts stay local and gitignored. Canonical copies live only in the skill.

`metadata.json`:

```json
{
  "source": "https://example.com",
  "layer": "detailed",
  "template": "https://example.com/assets/maps/detailed/{z}/{x}_{y}.jpg",
  "scheme": "custom",
  "tileWidth": 256,
  "tileHeight": 256,
  "minZoom": 0,
  "maxZoom": 4
}
```

---

# 34. Required crawler behavior

When implementing the crawler, expose configuration similar to:

```text
--url
--layer
--output
--min-zoom
--max-zoom
--workers
--timeout
--retries
--delay
--resume
--force
--stitch
--serve
```

Example:

```bash
python crawler.py \
  --url https://map.example.com \
  --layer detailed \
  --output ./map-crawl \
  --workers 4 \
  --resume
```

---

# 35. Prefer Python for crawler implementation

Use Python unless the existing project clearly prefers another runtime.

Recommended libraries:

```text
requests
httpx
aiohttp
Pillow
beautifulsoup4
```

For browser discovery:

```text
playwright
```

Avoid unnecessary dependencies.

For a simple crawler:

```text
httpx + asyncio + Pillow
```

is preferred.

---

# 36. Crawler implementation principles

Implement these components separately:

```text
Discovery
    ↓
TilePattern
    ↓
RangeDetector
    ↓
Downloader
    ↓
Validator
    ↓
Manifest
    ↓
Exporter
```

Do not put everything into one giant function.

Suggested classes:

```python
class MapDiscovery:
    pass

class TilePattern:
    pass

class TileRangeDetector:
    pass

class TileDownloader:
    pass

class TileValidator:
    pass

class TileManifest:
    pass
```

---

# 37. Failure handling

Never silently ignore errors.

Record:

```json
{
  "z": 4,
  "x": 10,
  "y": 4,
  "url": "...",
  "status": 500,
  "error": "HTTP 500"
}
```

Separate:

```text
not_found
rate_limited
server_error
timeout
invalid_image
network_error
```

At the end print:

```text
Downloaded: 12000
Skipped:     4000
Failed:        13
404:            8
429:            2
5xx:            3
```

---

# 38. Do not confuse 404 with crawler failure

For map tiles:

```text
404
```

may simply mean:

```text
tile does not exist
```

Treat it as:

```text
missing tile
```

when determining map boundaries.

Treat:

```text
500
502
503
504
timeout
```

as actual download failures.

Treat:

```text
429
```

as rate limiting.

---

# 39. Avoid accidental massive downloads

Before starting a full crawl, always calculate:

```text
zoom count
tiles per zoom
total tile count
estimated storage
estimated requests
```

For a standard full XYZ pyramid:

```text
tiles at zoom z = 4^z
```

But never assume the actual map contains the entire world.

A custom game map may contain only a small subset.

---

# 40. User confirmation policy

If the crawl is estimated to exceed:

```text
500 MB
```

or:

```text
10,000 requests
```

show a summary first.

Example:

```text
发现：
Layer: detailed
Zoom: 0-6
Tile size: 256x256
Tiles: 18,240
Estimated size: 620 MB
Requests: 18,240

建议使用 4 个并发下载。

是否开始完整下载？
```

Do not start a large crawl silently.

For small crawls:

```text
< 500 MB
< 10,000 requests
```

the agent may proceed directly when the user explicitly requested the download.

---

# 41. If the user gives a tile URL directly

Example:

```text
https://map.doubi.run/assets/maps/detailed/4/10_4.jpg
```

Do not ask unnecessary questions.

Start discovery from the URL itself.

Infer:

```text
host
path
layer
zoom
x
y
extension
```

Then validate nearby coordinates.

If successful, investigate the parent site for:

```text
minZoom
maxZoom
bounds
layers
```

---

# 42. If the user gives only a website URL

Example:

```text
https://example.com/map
```

Perform:

```text
HTML inspection
↓
JS inspection
↓
Network discovery if available
↓
tile pattern detection
↓
layer detection
↓
zoom detection
↓
range detection
```

Do not immediately brute-force the entire domain.

---

# 43. If no tile URLs are found

Consider whether the map is:

```text
Canvas-rendered
WebGL-rendered
SVG-based
single large image
vector tiles
```

For vector maps search for:

```text
.pbf
vector
mvt
protobuf
tiles
source
style.json
```

Do not treat vector tiles as raster JPG tiles.

If the user specifically wants raster images, explain that rasterization may require rendering the vector map.

---

# 44. If the map uses a single giant image

Detect requests such as:

```text
map.jpg
world.jpg
background.webp
```

and image dimensions such as:

```text
10000x8000
```

In this case do not invent a tile crawler.

Download the original image if authorized.

---

# 45. Final report

After completing discovery, always report:

```text
Source
Layer
Tile URL template
Scheme
Tile size
Zoom range
X/Y range
Tile count
Estimated/downloaded size
Successful tiles
Missing tiles
Failed tiles
Output directory
```

Example:

```text
地图分析完成

Source:
https://map.example.com

Layer:
detailed

Template:
https://map.example.com/assets/maps/detailed/{z}/{x}_{y}.jpg

Scheme:
custom X_Y

Tile:
256 × 256 JPEG

Zoom:
0-6

Tiles:
18,240

Downloaded:
18,215

Missing:
20

Failed:
5

Output:
./map-crawl/tiles/detailed/
```

---

# 46. Important decision rules

Use these rules throughout the task:

```text
Known tile URL
    ↓
Validate neighboring coordinates
    ↓
Find configuration
    ↓
Determine range
    ↓
Estimate size
    ↓
Download
```

Never:

```text
Guess huge range
    ↓
Send hundreds of thousands of requests
```

Prefer:

```text
configuration > network evidence > neighboring tiles > progressive probing > brute force
```

Prefer:

```text
4 workers > 50 workers
```

Prefer:

```text
resume > redownload
```

Prefer:

```text
manifest > undocumented output
```

Prefer:

```text
original coordinate system > forced XYZ conversion
```

---

# 47. Definition of done

Consider the task complete only when:

* [ ] Tile URL template is identified.
* [ ] Coordinate scheme is identified.
* [ ] At least one tile is successfully validated.
* [ ] Tile dimensions are known.
* [ ] Relevant layer is identified.
* [ ] Zoom range is known or explicitly bounded.
* [ ] X/Y range is known or explicitly bounded.
* [ ] Download size has been estimated.
* [ ] Large download was confirmed when necessary.
* [ ] Downloader supports retries.
* [ ] Downloader supports resume.
* [ ] Downloaded images are validated.
* [ ] Missing/failed tiles are recorded.
* [ ] Metadata is generated.
* [ ] Output directory is documented.
* [ ] Optional local serving instructions are provided when requested.
* [ ] Optional stitching/export is completed when requested.
* [ ] Download/extract scripts are gitignored and not committed.
* [ ] Repo name `{slug}-map-tile` was announced before download started.
* [ ] Blog map page was started during download when the user asked to接入 / 做页面.
* [ ] If GitHub MCP could not create the repo, the user was given the empty-repo URL to create it manually.

---

# 48. Preferred interaction style

Do not overwhelm the user with implementation details before discovery.

Initially provide a concise discovery summary:

```text
已找到地图瓦片：

Layer: detailed
Template: /assets/maps/detailed/{z}/{x}_{y}.jpg
Scheme: custom
Zoom: 0-6
Tile: 256x256 JPEG

正在计算完整瓦片范围和下载大小。
```

If the estimated download is large, stop before downloading and request confirmation.

Before starting any download, always print the repo name and the GitHub “create empty public repo” URL. If GitHub MCP is unavailable, the user can create it manually while tiles download and the blog page is written.

If the user explicitly says:

```text
全部下载
```

then proceed using the discovered configuration and the safe concurrency defaults.

---

# 49. Primary objective

The final result should not merely be:

```text
downloaded some jpg files
```

It should be a reproducible offline map dataset containing:

```text
tiles
+
metadata
+
index
+
failure report
+
repeatable crawler configuration
```

The same dataset should be usable later by:

```text
Leaflet
OpenLayers
MapLibre
local tile server
image stitching tools
MBTiles tools
```

without having to rediscover the original website.
