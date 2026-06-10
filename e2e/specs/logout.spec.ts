import { test } from '../core';
import { expect } from '@playwright/test';
import { HomePage } from '../pages';
import globalSetup from '../core/global-setup';

test('Logout as Admin user', async ({ page }) => {
  const homePage = new HomePage(page);

  await test.step('When I visit the home page', async () => {
    await homePage.goto();
    await page.waitForURL(/\/home\/\w+/);
  });

  await test.step('And I click the `User` button and log out', async () => {
    const myAccountButton = page.getByRole('button', { name: /My Account/i });
    const userMenu = page.locator('[aria-label="User menu"].cds--header-panel--expanded');

    // The user menu is rendered by a lazily-mounted extension. The first click can
    // land the instant the button mounts, before the navbar's React tree is
    // interactive, so the toggle is dropped and the panel never expands. Nothing
    // re-fires it, so a single click times out. Re-click until the panel opens.
    await expect(async () => {
      if (!(await userMenu.isVisible())) {
        await myAccountButton.click();
      }
      await expect(userMenu).toBeVisible({ timeout: 2_000 });
    }).toPass({ timeout: 30_000 });

    await userMenu.getByRole('button', { name: /logout/i }).click();
  });

  await test.step('Then I should be redirected to the login page', async () => {
    await expect(page).toHaveURL(`${process.env.E2E_BASE_URL}/spa/login`);
  });

  await test.step('And I should not see any error messages', async () => {
    // Note the complexity here is because we are ensuring that there are no elements
    // with the text "error" that are visible regardless of how many elements with
    // matching text may be in the DOM.
    const promises: Array<Promise<void>> = [];
    for (const elm of await page.getByText('error').all()) {
      // eslint-disable-next-line playwright/missing-playwright-await
      promises.push(expect(elm).toBeHidden());
    }

    await Promise.all(promises);
  });
});

test.afterEach(async () => {
  // log in again
  globalSetup();
});
