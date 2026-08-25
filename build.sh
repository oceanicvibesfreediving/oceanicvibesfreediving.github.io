#!/usr/bin/env bash
set -euo pipefail

rm -rf output
mkdir -p output

# The homepage and admin are still hand-authored static surfaces. Pelican owns
# the blog pages and writes them into the same deployable output directory.
for path in index.html styles.css app.js admin.html admin.css admin.js content.json; do
  if [ -e "$path" ]; then cp -R "$path" output/; fi
done
for directory in images; do
  if [ -d "$directory" ]; then cp -R "$directory" output/; fi
done

pelican content -o output -s pelicanconf.py

# Never publish Pelican's source tree or deployment-only files. If a future
# plugin copies one into output, remove it rather than failing a customer
# deployment; the output directory is the public boundary.
for forbidden in content themes pelicanconf.py build.sh requirements.txt README.md server.js \
  oceanicvibes-admin.service oceanicvibes-admin.service.example; do
  if [ -e "output/$forbidden" ]; then
    printf 'public output guard: removed forbidden path: output/%s\n' "$forbidden" >&2
    rm -rf "output/$forbidden"
  fi
done

for pattern in '*.jinja' '*.jinja2' '*.j2' '*.yaml' '*.yml'; do
  while IFS= read -r leaked; do
    [ -n "$leaked" ] || continue
    printf 'public output guard: removed template/config file: %s\n' "$leaked" >&2
    rm -f "$leaked"
  done < <(find output -type f -name "$pattern" -print)
done
