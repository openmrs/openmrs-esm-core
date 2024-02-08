import { test } from '../core';
import { expect } from '@playwright/test';
import { LoginPage } from '../pages';

test('Logout as Admin user', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await test.step('When I go to Login page', async () => {
    await loginPage.goto();
  });

  await test.step('And I enter the login credentials', async () => {
    await loginPage.enterLoginCredentials();
  });

  await test.step('Then I should be on the Home page', async () => {
    await expect(page).toHaveURL(`${process.env.E2E_BASE_URL}/spa/home`);
  });

  await test.step('When I click the `User` button', async () => {
    await page.getByRole('button', { name: /user/i }).click();
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
