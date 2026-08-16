"""Split map JSON and attach official title_zh from data/names_zh.json.

Copy into `{slug}-map-tile/` and keep names_zh.json next to the extracted files.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DATA = ROOT / "data"


def lookup_zh(title: str, names: dict[str, str]) -> str | None:
    if not title or title in names and names[title]:
        return names.get(title)
    return names.get(title)


def add_title_zh(obj: dict, names: dict[str, str], key: str = "title") -> None:
    en = obj.get(key)
    if not isinstance(en, str) or not en:
        return
    zh = names.get(en)
    if zh:
        obj[f"{key}_zh"] = zh


def write_json(path: Path, payload) -> None:
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main():
    payload = json.loads((DATA / "map-data.json").read_text(encoding="utf-8"))
    locations = payload.get("locations") or []
    regions = payload.get("regions") or []
    page = json.loads((DATA / "page-map-data.json").read_text(encoding="utf-8"))
    groups = page.get("groups") or []

    names_path = DATA / "names_zh.json"
    names = json.loads(names_path.read_text(encoding="utf-8")) if names_path.exists() else {}

    for item in locations:
        add_title_zh(item, names)
    for item in regions:
        add_title_zh(item, names)
        add_title_zh(item, names, "subtitle")
    for group in groups:
        add_title_zh(group, names)
        for cat in group.get("categories") or []:
            add_title_zh(cat, names)

    write_json(DATA / "locations.json", locations)
    write_json(DATA / "regions.json", regions)
    write_json(DATA / "categories.json", groups)

    print(f"locations: {len(locations)}")
    print(f"regions: {len(regions)}")
    print(f"groups: {len(groups)}")
    print(f"categories: {sum(len(g.get('categories') or []) for g in groups)}")
    print(f"names_zh: {len(names)}")


if __name__ == "__main__":
    main()
