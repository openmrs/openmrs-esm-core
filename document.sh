#!/usr/bin/env bash
#
# Generates API docs and updates the README TOC

set -e 
set -o pipefail

echo Generating new API docs

npx typedoc src/index.ts

# Link back to README at the top; the -i.bak and rm is to support both Mac & Linux.
# See https://stackoverflow.com/a/22084103/1464495
sed -i.bak "s/^@openmrs\/$1$/[Back to README.md](..\/README.md)/" "docs/API.md"
rm docs/API.md.bak

# Delete everything up to the functions in the index file
start=$(grep -n -m 1 Enumerations docs/API.md | cut -f1 -d:)
end=$(grep -n -m 1 Functions docs/API.md | cut -f1 -d:)
sed -i.bak "${start},$(expr ${end} - 1)d" docs/API.md
rm docs/API.md.bak

if grep -q tocstop README.md; then
  echo Generating TOC
  npx markdown-toc -i --maxdepth 2 README.md
fi
