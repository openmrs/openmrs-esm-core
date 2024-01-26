import { test } from '../core';
import { expect } from '@playwright/test';
import { LoginPage } from '../pages';

test('Login as Admin user', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await test.step('When a user navigates to the login page', async () => {
    await loginPage.goto();
  });

  await test.step('And enters the username', async () => {
    await page.getByLabel(/username/i).fill(`${process.env.E2E_USER_ADMIN_USERNAME}`);
    await page.getByText(/continue/i).click();
  });

  await test.step('And enters the password', async () => {
    await page.getByLabel(/password/i).fill(`${process.env.E2E_USER_ADMIN_PASSWORD}`);
  });

  await test.step('And clicks on `Log in` button', async () => {
    await page.getByRole('button', { name: /log in/i }).click();
  });

  await test.step('And chooses a login location', async () => {
    await expect(page).toHaveURL(`${process.env.E2E_BASE_URL}/spa/login/location`);
    await page.getByText(/outpatient clinic/i).click();
    await page.getByRole('button', { name: /confirm/i }).click();
  });

  await test.step('Then the system loads home page', async () => {
    await expect(page).toHaveURL(`${process.env.E2E_BASE_URL}/spa/home`);
    await page.getByRole('button', { name: /user/i }).click();
    await expect(page.getByText(/super user/i)).toBeVisible();
    await expect(page.getByText(/outpatient clinic/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /logout/i })).toBeVisible();
  });

  await test.step('And click on `Logout` button', async () => {
    await page.getByRole('button', { name: /logout/i }).click();
    await expect(page).toHaveURL(`${process.env.E2E_BASE_URL}/spa/login`);
    await expect(page.getByTitle('close notification')).not.toBeVisible();
    await expect(page.getByText('Language ID should be string or object.')).not.toBeVisible();
    await expect(page.getByText('Cannot read properties of undefined (reading `person`)')).not.toBeVisible();
  });
});
