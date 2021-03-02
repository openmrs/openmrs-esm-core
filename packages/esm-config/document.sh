#!/usr/bin/env bash
#
# Generates API docs and updates the README TOC

set -e 
set -o pipefail

cd "$(dirname "$0")"

echo Generating new API docs
npx typedoc src/index.ts

# Link back to README at the top
sed -i 's/^@openmrs\/esm-config$/[Back to README.md](..\/README.md)/' docs/API.md

echo Generating TOC
npx markdown-toc -i --maxdepth 2 README.md