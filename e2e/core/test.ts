import { test as base } from "@playwright/test";

// This file sets up our custom test harness using the custom fixtures.
// See https://playwright.dev/docs/test-fixtures#creating-a-fixture for details.
// If a spec intends to use one of the custom fixtures, the special `test` function
// exported from this file must be used instead of the default `test` function
// provided by playwright.

export const test = base.extend({});
