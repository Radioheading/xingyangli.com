# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

Xingyang Li's personal academic homepage. This repo **is** the deployed website.

- **Live site:** https://xingyangli.com — GitHub Pages, served from the `main` branch of
  https://github.com/Radioheading/xingyangli.com (remote `github`). Domain registered at Porkbun;
  DNS points the apex at GitHub Pages' A records and `www` at `radioheading.github.io`.
- **Old URL:** https://acm.sjtu.edu.cn/~xyli/ — since commit `3d7a28b` (2026-08-09) it serves
  only a small "Moved" stub (meta-refresh + `location.replace`) pointing at xingyangli.com.
- **Retired hosting:** from 2026-08-09 to 2026-09-02 the domain pointed at a WordPress.com
  (Atomic) site running a theme packaged from this repo. WordPress.com disabled that site
  (HTTP 410 "This site is disabled"), so the site moved to GitHub Pages on 2026-09-02.
  The theme packaging notes under `~/Files/code/xingyangli-website/` are obsolete.

## Tech Stack

- Static HTML with no build process
- Bootstrap 3 + Font Awesome, minimal vanilla JavaScript
- Google Analytics (UA-106869316-1) in the HTML head

## Deployment

Edit `index.html` (and add assets under `images/` / `files/`), commit on `master`, then:

    git push github master:main

GitHub Pages rebuilds within about a minute. `CNAME` must stay `xingyangli.com`; deleting it
drops the custom domain.

Local preview: `python3 -m http.server 8000`, then open http://localhost:8000.

## IMPORTANT: do not push content to `origin`

`origin` is `https://brucelee_sjtu@acm.sjtu.edu.cn/~xyli/.git` and its checkout **is** the
served old URL. Its tip must stay the redirect stub. Pushing the full `index.html` there would
resurrect the retired static site and kill the redirect. Local `master` sits ahead of
`origin/master` with content commits and behind it by the stub commit — that is expected;
leave it alone. Always push to `github`, never `origin`.

## Project Structure

- `index.html` — all homepage content
- `CNAME` — custom domain for GitHub Pages
- `stylesheets/` — Bootstrap, Font Awesome, plus `special.css` and `blog.css` overrides
- `javascripts/` — Bootstrap JS and small helpers
- `images/`, `files/` — figures, photos, CV and other PDFs
- `blog/` — blog page assets and Markdown drafts (`blog/source/neurips2025.md` is an unpublished
  draft, not wired into `blogPosts`)
- `robots.txt` — crawler rules (disallows `/files/`)
