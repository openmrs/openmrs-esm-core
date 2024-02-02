import { test } from '../core';
import { expect } from '@playwright/test';
import { LoginPage } from '../pages';

test('Logout as Admin user', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await test.step('When I navigate to the home page', async () => {
    await loginPage.goto();
    await loginPage.enterLoginCredentials();
    await page.goto('home');
    await expect(page).toHaveURL(`${process.env.E2E_BASE_URL}/spa/home`);
  });

  await test.step('And I click the `User` button', async () => {
    await page.getByRole('button', { name: /user/i }).click();
    await expect(page.getByText(/super user/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /logout/i })).toBeVisible();
  });

  await test.step('And I click the `Logout` button', async () => {
    await page.getByRole('button', { name: /logout/i }).click();
  });

  await test.step('Then I should be redirected to the login page', async () => {
    await expect(page).toHaveURL(`${process.env.E2E_BASE_URL}/spa/login`);
    await expect(page.getByTitle('close notification')).not.toBeVisible();
    await expect(page.getByText('Language ID should be string or object.')).not.toBeVisible();
    await expect(page.getByText('Cannot read properties of undefined (reading `person`)')).not.toBeVisible();
  });
});
