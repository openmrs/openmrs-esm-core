import { test } from '../core';
import { expect } from '@playwright/test';
import { HomePage } from '../pages';
import globalSetup from '../core/global-setup';

test('Logout as Admin user', async ({ page }) => {
  const homePage = new HomePage(page);

  await test.step('When I visit the home page', async () => {
    await homePage.goto();
  });

  await test.step('And I click the `User` button', async () => {
    await page.getByRole('button', { name: /My Account/i }).click();
  });

  await test.step('And I click the `Logout` button', async () => {
    await page.getByRole('button', { name: /logout/i }).click();
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
