#!/usr/bin/env bash
#
# Generates API docs and updates the README TOC

set -e 
set -o pipefail

echo Generating new API docs

mkdir -p docs
touch docs/API.md

npx typedoc src/index.ts

# Link back to README at the top; the '' argument is for Mac support
sed -i '' "s/^@openmrs\/$1$/[Back to README.md](..\/README.md)/" "docs/API.md"

echo Generating TOC
npx markdown-toc -i --maxdepth 2 README.md
