import { test } from '../core';
import { expect } from '@playwright/test';
import { LoginPage, HomePage } from '../pages';

test('User succesfully navigates to Two-Factor Authentiaction page and sets up authenticator app', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const topNav = page.getByRole('banner', { name: 'OpenMRS' });

  await test.step('Given I navigate to the login page', async () => {
    await page.addInitScript(() => {
      window.localStorage.setItem(
        'openmrs:temporaryConfig',
        JSON.stringify({
          '@openmrs/esm-login-app': {
            twoFactorAuth: {
              enabled: true,
            },
          },
        }),
      );
    });
    await loginPage.goto();
  });

  await test.step('When I enter my valid credentials to login as admin', async () => {
    await page.getByLabel(/username/i).fill(`${process.env.E2E_USER_ADMIN_USERNAME}`);
    await page.getByText(/continue/i).click();
    await page.getByLabel(/^password$/i).waitFor({ state: 'visible', timeout: 10000 });
    await page.getByLabel(/^password$/i).fill(`${process.env.E2E_USER_ADMIN_PASSWORD}`);
    await page.getByRole('button', { name: /log in/i }).click();
    await page.getByText(/outpatient clinic/i).click();
    await page.getByRole('button', { name: /confirm/i }).click();
  });

  await test.step('Then I should be on the home page and see the "My Account" button in the top navigation', async () => {
    await homePage.goto();
    await expect(topNav.getByRole('button', { name: /my account/i })).toBeVisible();
  });

  await test.step('When I click on the "My Account" button', async () => {
    await topNav.getByRole('button', { name: /my account/i }).click();
  });

  await test.step('Then I should see the "Two-Factor Authentication" button', async () => {
    await expect(page.getByLabel(/two-factor authentication/i)).toBeVisible();
  });

  await test.step('When I click on the "Two-Factor Authentication" button', async () => {
    await page.getByLabel(/two-factor authentication/i).click();
  });

  await test.step('Then I should be navigated to the Two-Factor Authentication page', async () => {
    await expect(page).toHaveURL(/.*two-factor-auth/);
    await expect(page.getByText('Protect your account with an extra verification step.')).toBeVisible();
  });

  await test.step('And I should see the "Authenticator App" method tile', async () => {
    await expect(page.getByRole('heading', { name: 'Authenticator App' })).toBeVisible();
    await expect(page.getByRole('button', { name: /set up/i })).toBeVisible();
  });

  await test.step('When I click the "Set up" button', async () => {
    // In here we're forcing the backend to successfully initiate enrollment
    // because the backend might not have the TOTP module configured.
    await page.route('**/ws/rest/v1/auth/totp/enrollment', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ qrCodeUri: 'data:image/png;base64,mockQrCodeUri', secret: 'MOCK_SECRET_KEY' }),
        });
      } else {
        await route.continue();
      }
    });
    await page.getByRole('button', { name: /set up/i }).click();
  });

  await test.step('Then the TOTP enrollment modal should appear', async () => {
    await expect(page.getByRole('heading', { name: 'Set up Authenticator App' })).toBeVisible();
    await expect(
      page.getByText('Your authenticator app will generate a new 6-digit code every 30 seconds.'),
    ).toBeVisible();
    await expect(page.getByLabel(/Enter 6-digit code from your app/i)).toBeVisible();
  });

  await test.step('When I enter a verification code and submit', async () => {
    // In here we're forcing the backend to say the code is valid.
    await page.route('**/ws/rest/v1/auth/totp/enrollment/verify', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ isValidCode: true }),
      });
    });
    await page.getByLabel(/Enter 6-digit code from your app/i).fill('123456');
    await page.getByRole('button', { name: 'Confirm and Enable authenticator app' }).click();
  });

  await test.step('Then I should see a success notification and the modal should close', async () => {
    await expect(page.getByText('Two-Factor Authentication Enabled')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Set up Authenticator App' })).toBeHidden();
  });
});
