#!/usr/bin/env bash
set -euo pipefail

rm -rf output
mkdir -p output

# The homepage and admin are still hand-authored static surfaces. Pelican owns
# the blog pages and writes them into the same deployable output directory.
for path in index.html styles.css app.js admin.html admin.css admin.js server.js \
  oceanicvibes-admin.service oceanicvibes-admin.service.example content.json README.md; do
  if [ -e "$path" ]; then cp -R "$path" output/; fi
done
for directory in images; do
  if [ -d "$directory" ]; then cp -R "$directory" output/; fi
done

pelican content -o output -s pelicanconf.py
