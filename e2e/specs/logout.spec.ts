import { test } from '../core';
import { expect } from '@playwright/test';
import { HomePage } from '../pages';

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
    await expect(page.getByText('error')).not.toBeVisible();
  });
});
