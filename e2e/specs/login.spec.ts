import { test } from '../core';
import { expect } from '@playwright/test';
import { LoginPage } from '../pages';

test.use({ storageState: { cookies: [], origins: [] } });

test('Login as Admin user', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const userPanel = page.locator('[data-extension-slot-name="user-panel-slot"]');
  const topNav = page.getByRole('banner', { name: 'OpenMRS' });

  await test.step('When I navigate to the login page', async () => {
    await loginPage.goto();
  });

  await test.step('And I enter my username', async () => {
    await page.getByLabel(/username/i).fill(`${process.env.E2E_USER_ADMIN_USERNAME}`);
    await page.getByText(/continue/i).click();
  });

  await test.step('And I enter my password', async () => {
    // Password field is hidden until this step (O3-5243: two-step login form)
    await page.getByLabel(/^password$/i).waitFor({ state: 'visible', timeout: 10000 });
    await page.getByLabel(/^password$/i).fill(`${process.env.E2E_USER_ADMIN_PASSWORD}`);
  });

  await test.step('And I click the `Log in` button', async () => {
    await page.getByRole('button', { name: /log in/i }).click();
    // Wait for page navigation to complete after login
    await page.waitForLoadState('domcontentloaded');
  });

  await test.step('And I choose a login location if required', async () => {
    // After login, user is redirected to location selection page OR directly to home
    // (depending on whether a default location is already set in the session)
    const locationPicker = page.getByText(/outpatient clinic/i);
    await locationPicker.click({ timeout: 5000 }).catch(() => {});
    const confirmButton = page.getByRole('button', { name: /confirm/i });
    await confirmButton.click({ timeout: 5000 }).catch(() => {});
  });

  await test.step('Then I should get navigated to the home page', async () => {
    await expect(page).toHaveURL(/\/spa\/home/);
  });

  await test.step('And I should see the location picker in top nav', async () => {
    // The location shown depends on what was selected or already set
    await expect(topNav.getByText(/(outpatient clinic|inpatient ward)/i)).toBeVisible();
  });

  await test.step('When I click on the my account button', async () => {
    await page.getByRole('button', { name: /My Account/i }).click();
  });

  await test.step('Then I should see the user details', async () => {
    await expect(userPanel.getByText(/super user/i)).toBeVisible();
  });

  await test.step('And I should see the logout button', async () => {
    await expect(page.getByRole('button', { name: /logout/i })).toBeVisible();
  });
});
