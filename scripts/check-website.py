"""Check the buildless Pages artifact without app dependencies or network access."""

from html.parser import HTMLParser
from pathlib import Path
import re
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1] / "website"
ALLOWED = {".html", ".css", ".svg", ".jpg", ".png", ".ttf", ".txt"}


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.path = path
        self.ids = set()
        self.links = []
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
            assert "alt" in attrs, f"Missing image alternative in {self.path}"
        if tag == "html":
            assert attrs.get("lang") == "pt-BR", "Missing page language"
        assert tag not in {"script", "iframe", "form"}, "Review new data flows first"


pages = {path.resolve(): Page(path) for path in ROOT.glob("*.html")}
assert len(pages) >= 3, "Missing landing/support/privacy pages"
assert (ROOT / ".nojekyll").is_file()
for path in ROOT.rglob("*"):
    assert not path.is_symlink(), f"Symlink in public artifact: {path}"
    if path.is_file():
        assert path.name == ".nojekyll" or path.suffix in ALLOWED, path
for page in pages.values():
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
print(f"Website PASS: {len(pages)} pages, local links/fragments/assets and public artifact checked.")
