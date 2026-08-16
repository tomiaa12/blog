#!/usr/bin/env python3
"""XYZ/TMS tile downloader template for `{slug}-map-tile` projects.

Fill TEMPLATE, REFERER, BOUNDS, TILE_DIR after discovery. Usage:
  python crawl_tiles.py
  python crawl_tiles.py -w 24
  python crawl_tiles.py -w 8 9 10 11
"""

from __future__ import annotations

import json
import random
import sys
import time
import urllib.error
import urllib.request
from concurrent.futures import FIRST_COMPLETED, ThreadPoolExecutor, wait
from pathlib import Path
from threading import Lock

ROOT = Path(__file__).resolve().parent
TILE_DIR = ROOT / "tiles" / "default-v1"
DATA_DIR = ROOT / "data"

TEMPLATE = (
    "https://tiles.mapgenie.io/games/zelda-breath-of-the-wild/"
    "hyrule/default-v1/{z}/{x}/{y}.jpg"
)
REFERER = "https://mapgenie.io/zelda-breath-of-the-wild/maps/hyrule"
USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64; rv:126.0) Gecko/20100101 Firefox/126.0",
]
ACCEPT_LANGUAGES = [
    "en-US,en;q=0.9",
    "en-GB,en;q=0.8",
    "zh-CN,zh;q=0.9,en;q=0.8",
    "zh-TW,zh;q=0.9,en;q=0.7",
    "ja-JP,ja;q=0.9,en;q=0.6",
]

# From window.mapData.mapConfig.tile_sets[0].bounds
BOUNDS = {
    9: (254, 255, 254, 255),
    10: (508, 511, 508, 511),
    11: (1016, 1023, 1016, 1023),
    12: (2032, 2047, 2032, 2047),
    13: (4064, 4095, 4064, 4095),
    14: (8128, 8191, 8128, 8191),
    15: (16256, 16383, 16256, 16383),
    16: (32512, 32767, 32512, 32767),
    17: (65024, 65535, 65024, 65535),
}

WORKERS = 24
TIMEOUT = 15                                                                            
RETRIES = 6
JPEG_MAGIC = b"\xff\xd8"

stats = {
    "success": 0,
    "skipped": 0,
    "failed": 0,
    "missing": 0,
    "rate_limited": 0,
    "bytes": 0,
}
stats_lock = Lock()
fail_lock = Lock()
pause_until = 0.0
level_counts: dict[int, int] = {z: 0 for z in BOUNDS}


def iter_tiles(zooms: list[int]):
    for z in zooms:
        min_x, max_x, min_y, max_y = BOUNDS[z]
        for x in range(min_x, max_x + 1):
            for y in range(min_y, max_y + 1):
                yield z, x, y


def random_headers() -> dict[str, str]:
    return {
        "User-Agent": random.choice(USER_AGENTS),
        "Accept": "image/avif,image/webp,image/apng,image/jpeg,image/*,*/*;q=0.8",
        "Accept-Language": random.choice(ACCEPT_LANGUAGES),
        "Referer": REFERER,
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
    }


def is_valid_jpeg(path: Path) -> bool:
    if not path.exists() or path.stat().st_size < 4:
        return False
    with path.open("rb") as fh:
        return fh.read(2) == JPEG_MAGIC


def download_one(z: int, x: int, y: int) -> str:
    global pause_until
    dest = TILE_DIR / str(z) / str(x) / f"{y}.jpg"
    if is_valid_jpeg(dest):
        with stats_lock:
            stats["skipped"] += 1
            level_counts[z] += 1
        return "skipped"

    dest.parent.mkdir(parents=True, exist_ok=True)
    url = TEMPLATE.format(z=z, x=x, y=y)
    last_error = ""

    for attempt in range(RETRIES):
        now = time.time()
        if now < pause_until:
            time.sleep(pause_until - now)

        req = urllib.request.Request(url, headers=random_headers())
        try:
            with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
                data = resp.read()
                ctype = resp.headers.get("Content-Type", "")
            if not data.startswith(JPEG_MAGIC) or "html" in ctype.lower():
                last_error = f"invalid_image content-type={ctype} size={len(data)}"
                continue
            tmp = dest.with_suffix(".jpg.part")
            tmp.write_bytes(data)
            tmp.replace(dest)
            with stats_lock:
                stats["success"] += 1
                stats["bytes"] += len(data)
                level_counts[z] += 1
            return "success"
        except urllib.error.HTTPError as exc:
            last_error = f"HTTP {exc.code}"
            if exc.code in (404, 403):
                with stats_lock:
                    stats["missing"] += 1
                return "missing"
            if exc.code == 429:
                with stats_lock:
                    stats["rate_limited"] += 1
                retry_after = exc.headers.get("Retry-After")
                if retry_after and retry_after.replace(".", "", 1).isdigit():
                    wait = float(retry_after)
                else:
                    wait = min(90.0, 8 * (2 ** attempt)) + random.uniform(0.5, 2.5)
                pause_until = max(pause_until, time.time() + wait)
                time.sleep(wait)
                continue
            if 500 <= exc.code < 600:
                time.sleep(2 ** attempt)
                continue
            break
        except Exception as exc:
            last_error = str(exc)
            time.sleep(2 ** attempt)

    with stats_lock:
        stats["failed"] += 1
    with fail_lock:
        with (DATA_DIR / "failures.jsonl").open("a", encoding="utf-8") as fh:
            fh.write(json.dumps({"z": z, "x": x, "y": y, "url": url, "error": last_error}) + "\n")
    return "failed"


def write_manifest(zooms: list[int], extra: dict | None = None):
    levels = {}
    for z in zooms:
        min_x, max_x, min_y, max_y = BOUNDS[z]
        levels[str(z)] = {
            "minX": min_x,
            "maxX": max_x,
            "minY": min_y,
            "maxY": max_y,
            "planned": (max_x - min_x + 1) * (max_y - min_y + 1),
            "count": level_counts.get(z, 0),
        }
    payload = {
        "source": "https://mapgenie.io/zelda-breath-of-the-wild/maps/hyrule",
        "layer": "default-v1",
        "template": TEMPLATE,
        "scheme": "xyz",
        "tileWidth": 256,
        "tileHeight": 256,
        "format": "jpg",
        "minZoom": min(zooms),
        "maxZoom": max(zooms),
        "downloads": dict(stats),
        "levels": levels,
    }
    if extra:
        payload.update(extra)
    (DATA_DIR / "manifest.json").write_text(
        json.dumps(payload, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    (DATA_DIR / "index.json").write_text(
        json.dumps(
            {
                "layer": "default-v1",
                "scheme": "xyz",
                "tileWidth": 256,
                "tileHeight": 256,
                "levels": levels,
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )


def parse_args():
    workers = WORKERS
    zooms: list[int] = []
    args = sys.argv[1:]
    i = 0
    while i < len(args):
        if args[i] in ("-w", "--workers"):
            workers = int(args[i + 1])
            i += 2
            continue
        zooms.append(int(args[i]))
        i += 1
    return workers, zooms or list(BOUNDS)


def main():
    workers, zooms = parse_args()
    for z in zooms:
        if z not in BOUNDS:
            raise SystemExit(f"unsupported zoom {z}")

    planned = sum(
        (mx - mn + 1) * (my - ny + 1) for z in zooms for mn, mx, ny, my in [BOUNDS[z]]
    )
    print(f"zooms={zooms} planned={planned} workers={workers}")
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    TILE_DIR.mkdir(parents=True, exist_ok=True)

    started = time.time()
    done = 0
    current_z = None
    # 同时在飞任务数封顶，避免 z16/z17 一次塞进几十万 Future 把内存打爆
    max_in_flight = max(workers * 4, 32)
    pending: set = set()
    tiles = iter_tiles(zooms)

    def submit_one() -> bool:
        nonlocal current_z
        try:
            z, x, y = next(tiles)
        except StopIteration:
            return False
        if z != current_z:
            min_x, max_x, min_y, max_y = BOUNDS[z]
            n = (max_x - min_x + 1) * (max_y - min_y + 1)
            print(f"zoom {z}: {n} tiles", flush=True)
            current_z = z
        pending.add(pool.submit(download_one, z, x, y))
        return True

    with ThreadPoolExecutor(max_workers=workers) as pool:
        while len(pending) < max_in_flight and submit_one():
            pass
        while pending:
            finished, pending = wait(pending, return_when=FIRST_COMPLETED)
            for fut in finished:
                fut.result()
                done += 1
                if done % 200 == 0 or done == planned:
                    elapsed = max(time.time() - started, 0.001)
                    with stats_lock:
                        snap = dict(stats)
                    print(
                        f"[{done}/{planned}] ok={snap['success']} skip={snap['skipped']} "
                        f"miss={snap['missing']} fail={snap['failed']} "
                        f"429={snap['rate_limited']} "
                        f"{snap['bytes'] / 1024 / 1024:.1f}MB "
                        f"{done / elapsed:.1f} tiles/s",
                        flush=True,
                    )
                if done % 2000 == 0:
                    write_manifest(zooms)
            while len(pending) < max_in_flight and submit_one():
                pass

    write_manifest(zooms, extra={"elapsedSec": round(time.time() - started, 1)})
    print("done", json.dumps(stats))


if __name__ == "__main__":
    main()
