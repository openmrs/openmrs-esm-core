import { test } from '../core';
import { expect } from '@playwright/test';
import { HomePage, LoginPage } from '../pages';

test('View action buttons in the navbar', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const topNav = page.getByRole('banner', { name: 'OpenMRS' });

  await test.step('When I log in as admin', async () => {
    await loginPage.goto();
    await page.getByLabel(/username/i).fill(`${process.env.E2E_USER_ADMIN_USERNAME}`);
    await page.getByText(/continue/i).click();
    await page.getByLabel(/^password$/i).fill(`${process.env.E2E_USER_ADMIN_PASSWORD}`);
    await page.getByRole('button', { name: /log in/i }).click();
    await page.getByText(/outpatient clinic/i).click();
    await page.getByRole('button', { name: /confirm/i }).click();
  });

  await test.step('When I visit the home page', async () => {
    await homePage.goto();
  });

  await test.step('Then the action buttons should be in the top nav', async () => {
    await expect(topNav.getByRole('button', { name: /search patient/i })).toBeVisible();
    await expect(topNav.getByRole('button', { name: /add patient/i })).toBeVisible();
    await expect(topNav.getByRole('button', { name: /implementer tools/i })).toBeVisible();
    await expect(topNav.getByRole('button', { name: /my account/i })).toBeVisible();
    await expect(topNav.getByRole('button', { name: /app menu/i })).toBeVisible();
  });

  await test.step('When I click on the "my account" button', async () => {
    await topNav.getByRole('button', { name: /my account/i }).click();
  });

  await test.step('Then I should see the "my account" menu', async () => {
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });

  await test.step('When I click on the "app menu" button', async () => {
    await topNav.getByRole('button', { name: /app menu/i }).click();
  });

  await test.step('Then I should see the app menu', async () => {
    await expect(page.getByRole('link', { name: /system administration/i })).toBeVisible();
  });
});
