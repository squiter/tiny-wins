# Tiny Wins landing page

Static Portuguese marketing site, hosted separately from the Expo browser preview. No build or dependency installation.

Preview from the repository root:

```sh
python3 scripts/check-website.py
python3 -m http.server 8093 --bind 127.0.0.1 --directory website
```

Open http://localhost:8093. The Pages workflow publishes only this folder; source app and user data are excluded. Enable **Settings → Pages → Build and deployment → GitHub Actions** for the first deployment. Main changes under website/ trigger publication; PRs validate only. Native build workflows ignore website-only changes; core app Validate still runs.

To launch: replace the two availability panels in index.html with genuine store links and official badges; update support/privacy, store metadata and availability copy. Until then they are intentionally noninteractive status panels. Do not add a fake download, newsletter form or tracking.

Screenshots in assets/ are copies of the three README browser previews (Today, dark Insights and Portuguese weekly goals), containing example habits. Refresh these copies when app UI changes. They are development previews, not final App Store submission captures. Fonts are copied from existing app packages with their original license files.

No personal support contact has been published. The public issue tracker is used for now; never request habit backups in public issues. Review privacy/support against the signed release before store submission.
