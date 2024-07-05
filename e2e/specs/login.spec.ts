import { test } from '../core';
import { expect } from '@playwright/test';
import { LoginPage } from '../pages';

test.use({ storageState: { cookies: [], origins: [] } });

test('Login as Admin user', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const userPanel = page.locator('[data-extension-slot-name="user-panel-slot"]');

  await test.step('When I navigate to the login page', async () => {
    await loginPage.goto();
  });

  await test.step('And I enter my username', async () => {
    await page.getByLabel(/username/i).fill(`${process.env.E2E_USER_ADMIN_USERNAME}`);
    await page.getByText(/continue/i).click();
  });

  await test.step('And I enter my password', async () => {
    await page.getByLabel(/password/i).fill(`${process.env.E2E_USER_ADMIN_PASSWORD}`);
  });

  await test.step('And I click the `Log in` button', async () => {
    await page.getByRole('button', { name: /log in/i }).click();
  });

  await test.step('And I choose a login location', async () => {
    await expect(page).toHaveURL(`${process.env.E2E_BASE_URL}/spa/login/location`);
    await page.getByText(/outpatient clinic/i).click();
    await page.getByRole('button', { name: /confirm/i }).click();
  });

  await test.step('Then I should get navigated to the home page', async () => {
    await expect(page).toHaveURL(`${process.env.E2E_BASE_URL}/spa/home`);
  });

  await test.step('When I click on the my account button', async () => {
    await page.getByRole('button', { name: /My Account/i }).click();
  });

  await test.step('Then I should see the user details', async () => {
    await expect(userPanel.getByText(/super user/i)).toBeVisible();
  });

  await test.step('And I should see the location details', async () => {
    await expect(userPanel.getByText(/outpatient clinic/i)).toBeVisible();
  });

  await test.step('And I should see the logout button', async () => {
    await expect(page.getByRole('button', { name: /logout/i })).toBeVisible();
  });
});
