import { test } from '../core';
import { expect } from '@playwright/test';
import { HomePage } from '../pages';

test('action buttons in top nav', async ({ page }) => {
  const homePage = new HomePage(page);
  const topNav = page.getByRole('banner', { name: 'OpenMRS' });

  await test.step('When I visit the home page', async () => {
    await homePage.goto();
  });

  await test.step('Then the action buttons should be in the top nav', async () => {
    await expect(topNav.getByRole('button', { name: /Search patient/i })).toBeVisible();
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
