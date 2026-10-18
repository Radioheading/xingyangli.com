#!/usr/bin/env bash
# Publish the site: GitHub Pages (xingyangli.com, canonical) + MIT Athena mirror (www.mit.edu/~xyli05).
# Athena login needs password + Duo, so the mirror step only runs when an `ssh athena` master
# connection is already open (see ~/.ssh/config); otherwise it prints a reminder and skips.
set -euo pipefail
cd "$(dirname "$0")"

if [ -n "$(git status --porcelain)" ]; then
  echo "Uncommitted changes — commit first." >&2; exit 1
fi

git push github master:main
echo "✓ GitHub Pages: https://xingyangli.com/ (rebuilds in ~1 min)"

if ssh -O check athena 2>/dev/null; then
  rsync -rlt --delete --chmod=Du=rwx,Dgo=rx,Fu=rw,Fgo=r \
    --exclude .git --exclude .gitignore --exclude CLAUDE.md --exclude CNAME \
    --exclude deploy.sh --exclude 'blog/source/' --exclude node_modules \
    ./ athena:www/
  echo "✓ MIT mirror: https://www.mit.edu/~xyli05/"
else
  echo "! MIT mirror skipped: run \`ssh athena\` in another terminal (password + Duo), then rerun." >&2
fi
