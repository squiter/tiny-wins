"""Check the buildless Pages artifact without app dependencies or network access."""

from html.parser import HTMLParser
from pathlib import Path
import re
import struct
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1] / "website"
ALLOWED = {".html", ".css", ".svg", ".jpg", ".png", ".ttf", ".txt", ".mjs"}


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.path = path
        self.ids = set()
        self.links = []
        self.images = []
        self.language = None
        self.selector = False
        self.feed(path.read_text())

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            assert attrs["id"] not in self.ids, f"Duplicate ID in {self.path}"
            self.ids.add(attrs["id"])
        for key in ("href", "src"):
            if key in attrs:
                self.links.append(attrs[key])
        if tag == "img":
            self.images.append(attrs)
            assert "alt" in attrs, f"Missing image alternative in {self.path}"
        if tag == "html":
            self.language = attrs.get("lang")
            assert self.language in {"en", "pt-BR"}, "Missing page language"
        if tag == "select" and attrs.get("id") == "site-language":
            self.selector = True
        if tag == "script":
            assert attrs.get("type") == "module" and attrs.get("src") in {"language.mjs", "../language.mjs"}, "Unreviewed site script"
        assert tag not in {"iframe", "form"}, "Review new data flows first"


pages = {path.resolve(): Page(path) for path in ROOT.rglob("*.html")}
assert len(pages) == 6, "Missing landing/support/privacy pages"
assert (ROOT / ".nojekyll").is_file()
for path in ROOT.rglob("*"):
    assert not path.is_symlink(), f"Symlink in public artifact: {path}"
    if path.is_file():
        assert path.name == ".nojekyll" or path.suffix in ALLOWED, path


def image_dimensions(path):
    data = path.read_bytes()
    if data.startswith(b"\x89PNG\r\n\x1a\n"):
        return struct.unpack(">II", data[16:24])
    assert data[:2] == b"\xff\xd8", f"Unsupported screenshot: {path}"
    position = 2
    while position < len(data):
        assert data[position] == 0xFF
        marker = data[position + 1]
        position += 2
        size = int.from_bytes(data[position:position + 2], "big")
        assert size >= 2 and position + size <= len(data), "Invalid JPEG segment"
        if marker in {0xC0, 0xC1, 0xC2}:
            height, width = struct.unpack(">HH", data[position + 3:position + 7])
            return width, height
        position += size
    raise AssertionError(f"No image dimensions: {path}")


for page in pages.values():
    expected_language = "pt-BR" if page.path.parent.name == "pt" else "en"
    assert page.language == expected_language
    assert page.selector, f"Missing language selector: {page.path}"
    for attrs in page.images:
        if "assets/" not in attrs["src"]:
            continue
        dimensions = image_dimensions((page.path.parent / attrs["src"]).resolve())
        assert dimensions == (int(attrs["width"]), int(attrs["height"])), "Wrong intrinsic dimensions"
        assert 1.9 <= dimensions[1] / dimensions[0] <= 2.35, "Use phone viewports, not full-page screenshots"
    for link in page.links:
        url = urlsplit(link)
        if url.scheme or url.netloc:
            assert url.scheme == "https", f"Unexpected link: {link}"
            continue
        assert not url.path.startswith("/"), f"Project Pages needs relative URLs: {link}"
        target = (page.path.parent / unquote(url.path)).resolve()
        assert target.is_relative_to(ROOT), f"Path escapes public artifact: {link}"
        if target.is_dir():
            target = target / "index.html"
        assert target.is_file(), f"Missing target: {link} in {page.path}"
        if url.fragment:
            assert target in pages and url.fragment in pages[target].ids, link
for asset in re.findall(r'url\(["\']?([^"\')]+)', (ROOT / "styles.css").read_text()):
    assert (ROOT / asset).is_file(), f"Missing CSS asset: {asset}"
print(f"Website PASS: {len(pages)} pages, EN/PT selectors, phone screenshot dimensions, links/fragments/assets and public artifact checked.")
