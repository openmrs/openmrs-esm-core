import { test } from '../core';
import { expect } from '@playwright/test';
import { LoginPage } from '../pages';

test("Login as Admin user", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await test.step("When I navigate to the login page", async () => {
    await loginPage.goto();
  });

  await test.step("And I enter my username", async () => {
    await page
      .getByLabel(/username/i)
      .fill(`${process.env.E2E_USER_ADMIN_USERNAME}`);
    await page.getByText(/continue/i).click();
  });

  await test.step("And I enter my password", async () => {
    await page
      .getByLabel(/password/i)
      .fill(`${process.env.E2E_USER_ADMIN_PASSWORD}`);
  });

  await test.step("And I click the `Log in` button", async () => {
    await page.getByRole("button", { name: /log in/i }).click();
  });

  await test.step("And I choose a login location", async () => {
    await expect(page).toHaveURL(
      `${process.env.E2E_BASE_URL}/spa/login/location`
    );
    await page.getByText(/outpatient clinic/i).click();
    await page.getByRole("button", { name: /confirm/i }).click();
  });

  await test.step("Then I should get navigated to the home page", async () => {
    await expect(page).toHaveURL(`${process.env.E2E_BASE_URL}/spa/home`);
  });

  await test.step("And I should be able to see various elements on the page", async () => {
    await page.getByRole("button", { name: "Users" }).click();
    await expect(page.getByText(/super user/i)).toBeVisible();
    await expect(page.getByText(/outpatient clinic/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /logout/i })).toBeVisible();
  });
});
