# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

Xingyang Li's personal academic homepage. This repo is **no longer a deployed website** — it is
now the *content source* for the WordPress theme that powers the live site.

- **Live site:** https://xingyangli.com — WordPress (WordPress.com Atomic hosting; domain via
  Porkbun). Runs the custom theme `xingyangli`, which is a straight port of this repo's HTML.
- **Old URL:** https://acm.sjtu.edu.cn/~xyli/ — since commit `3d7a28b` (2026-08-09) it serves
  only a small "Moved" stub (meta-refresh + `location.replace`) pointing at xingyangli.com.

## Tech Stack

- Static HTML with no build process
- Bootstrap 3 + Font Awesome, minimal vanilla JavaScript
- Google Analytics (UA-106869316-1) in the HTML head

## Deployment: how a content change reaches the live site

There is **no git-based deploy to xingyangli.com**. The flow is:

1. Edit `index.html` (and add assets under `images/` / `files/`) here.
2. Repackage the WordPress theme (see below) as `~/Desktop/xingyangli-theme.zip`.
3. In `xingyangli.com/wp-admin`: Appearance → Themes → Add New → Upload Theme → Install Now
   → Activate (re-uploading an updated zip replaces the active theme).

### Theme packaging

The theme (`xingyangli/`) is this repo's files with three mechanical changes:

- `index.html` → `front-page.php` (and an identical copy as `index.php`)
- every relative asset path (`images/…`, `./images/…`, `files/…`) rewritten to
  `<?php echo get_template_directory_uri(); ?>/images/…`
- a `style.css` added carrying only the WordPress theme header (real styling still comes from
  `stylesheets/*.css`, enqueued from `front-page.php` / `page-blog.php`)

Also: `<?php wp_head(); ?>` before `</head>` and `<?php wp_footer(); ?>` before `</body>`.
Assets bundled: `images/ files/ stylesheets/ javascripts/ fonts/ blog/source/ blog/feed.xml`.
Excluded: the blog build tooling (`blog/index.html`, `blog/blog-config.js`,
`blog/generate-rss.js`, `blog/README.md`) and `CLAUDE.md` / `index.html` themselves.

`page-blog.php` is a Page template ("Blog") for the blog section; the blog itself is currently
empty (draft at `blog/source/neurips2025.md`, not wired into `blogPosts`).

Local preview of the plain HTML: `python3 -m http.server 8000`, then open http://localhost:8000.

## IMPORTANT: do not push content to `origin`

`origin` is `https://acm.sjtu.edu.cn/~xyli/.git` and its checkout **is** the served old URL.
Its tip must stay the redirect stub. Pushing the full `index.html` there would resurrect the
retired static site and kill the redirect. Local `master` may sit ahead of `origin/master` with
content commits — that is expected; leave it unpushed.

## Project Structure

- `index.html` — all homepage content (source of truth for the theme's `front-page.php`)
- `stylesheets/` — Bootstrap, Font Awesome, plus `special.css` and `blog.css` overrides
- `javascripts/` — Bootstrap JS and small helpers
- `images/`, `files/` — figures, photos, CV and other PDFs
- `blog/` — blog page assets and Markdown drafts
- `robot.txt` — crawler rules
- (`CNAME` was removed: a vestigial GitHub Pages file naming someone else's domain,
  `www.linji.me`, left over from the upstream template this site was forked from.)
