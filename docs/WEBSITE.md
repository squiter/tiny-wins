# Tiny Wins landing page

[Open the public site](https://squiter.github.io/tiny-wins/). First successful deployment: [38936101284](https://github.com/squiter/tiny-wins/actions/runs/38936101284).

Static English/Brazilian Portuguese marketing site, hosted separately from the Expo browser preview. No build or dependency installation.

Preview from the repository root:

```sh
python3 scripts/check-website.py
node --test scripts/check-website-language.mjs
python3 -m http.server 8093 --bind 127.0.0.1 --directory website
```

Open http://localhost:8093. The Pages workflow publishes only this folder; source app and user data are excluded. Enable **Settings → Pages → Build and deployment → GitHub Actions** for the first deployment. Main changes under website/ trigger publication; PRs validate only. Native build workflows ignore website-only changes; core app Validate still runs.

To launch: replace the two availability panels in index.html with genuine store links and official badges; update support/privacy, store metadata and availability copy. Until then they are intentionally noninteractive status panels. Do not add a fake download, newsletter form or tracking.

Screenshots in assets/ are unmodified phone viewport captures with example habits: cozy-all-day-light-390.png (390×844), appearance-insights-dark-360.png (360×800) and weekly-today-pt-light-390.jpg (390×844). Avoid full-page/scroll-length captures. The artifact check reads image headers and verifies intrinsic dimensions and phone proportions. Refresh these copies when app UI changes. They are development previews, not final App Store submission captures. Fonts are copied from existing app packages with their original license files.

No personal support contact has been published. The public issue tracker is used for now; never request habit backups in public issues. Review privacy/support against the signed release before store submission.

## Languages

English is the static default at the root; Portuguese pages live under pt/. The selector on every page offers Browser language, English and Português. First visit follows the first supported browser language, falling back to English. Manual selection saves a website-only language preference; Browser language removes it. Explicit ?lang=en, ?lang=pt-BR and ?lang=auto links also work if local storage is blocked. Switches preserve the current support/privacy page and fragment. No app preferences, analytics, external translation API or cookies are involved.

Update both sets of static pages when changing copy. Keep matching page names and fragments across locales and include relative assets, module source, language metadata and alternates. With JavaScript disabled, pages remain readable and provide a plain alternate-language link. Six deterministic language tests and six-page artifact checks run in the Pages workflow. App verification remains a separate required gate.
