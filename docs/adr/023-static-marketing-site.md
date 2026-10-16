# ADR-023: Buildless landing page in the app repository

Status: accepted, owner authorized 2026-10-16.

Keep the small public marketing site in website/ alongside the app. Use static HTML/CSS, existing example screenshots and bundled Inter/Fraunces fonts with their licenses. No site framework, dependency installation, cookies, analytics, signup form or backend. GitHub Pages hosts the site; app data never enters the artifact.

The Pages workflow checks links, fragments, assets and publication boundaries with Python's standard library before uploading website/ only. PRs check; main pushes affecting the site deploy with Pages/OIDC permissions restricted to the deploy job. All third-party actions are commit-pinned. Native build workflows ignore website-only inputs; core Validate remains unchanged so required checks are not accidentally skipped. Mixed app changes still trigger native workflows.

Store availability is text, not a dead link or imitation store badge. Replace the status panels with official store links after launch, and recheck price/availability copy. iPhone is the first planned paid release; Android remains in development. Support uses the existing public issue tracker; explicitly discourage sharing habit histories/backups. The privacy page describes the current local-first app and GitHub-hosted site, and must be reviewed against the final release. No private contact information is invented.

Relative URLs support both /tiny-wins/ project hosting and a later custom domain. Keep final store screenshots distinct from development marketing examples. No native app behavior, identifier, signing, permissions, data schema or dependency changes.

Deployment follows the [official custom Pages workflow](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages). Enable the repository's Pages build type as workflow before the first deployment. Preview locally with python3 -m http.server 8093 --bind 127.0.0.1 --directory website.

## Phone viewports and interface languages (task 027)

Replace the two 390×1250 scroll-page images with unmodified 390×844 Today and 360×800 Insights viewport captures; the weekly screenshot remains 390×844. Natural width/height attributes and height:auto preserve proportions without cropping, rotation or stretching. The artifact check reads image headers and rejects screenshot ratios outside 1.9–2.35 and incorrect intrinsic attributes.

English static pages live at the root; complete Portuguese landing/support/privacy pages live under pt/. Each page has its own language/title and alternate links. A small dependency-free local module resolves the first supported browser language (English or Portuguese; English fallback) and provides Browser language/English/Português selection. Manual choice saves only tiny-wins.site-language in this browser, independently from the app. Auto removes the override. Privacy copy discloses this preference. No tracking or remote service is added.

Explicit ?lang=en/pt-BR/auto choices carry through internal navigation and preserve current page/hash, including when storage is blocked. Without JavaScript, pages remain readable and a noscript alternate link switches languages; the inactive selector is disabled. Relative roots support local preview, project Pages hosting and custom domains. Node standard-library language tests and Python six-page/link/image checks run before publication. This supersedes task 026's Portuguese-only/no-JavaScript implementation; app behavior and native release gates remain separate.
