#!/usr/bin/env bash
#
# Generates API docs and updates the README TOC

set -e
set -o pipefail

echo Generating new API docs

yarn typedoc --tsconfig tsconfig.typedoc.json src/index.ts
