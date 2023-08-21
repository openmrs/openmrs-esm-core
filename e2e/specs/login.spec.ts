import { test } from "../core";
import { expect } from "@playwright/test";
import { LoginPage } from "../pages";

test("Should login as Admin", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await test.step("When I goto the login page", async () => {
    await loginPage.goto();
  });

  await test.step("And I enter the username", async () => {
    await page
      .locator("#username")
      .fill(`${process.env.E2E_USER_ADMIN_USERNAME}`);
    await page.getByText("Continue").click();
  });

  await test.step("And I enter the password", async () => {
    await page
      .locator("#password")
      .fill(`${process.env.E2E_USER_ADMIN_PASSWORD}`);
  });

  await test.step("And I click login buttion", async () => {
    await page.getByText("Log in").click();
  });

  await test.step("And I choose the location", async () => {
    await page.getByText("Outpatient clinic").click();
    await page.getByText("Confirm").click();
  });

  await test.step("Then I should be logged in", async () => {
    await expect(page).toHaveURL(`${process.env.E2E_BASE_URL}/spa/home`);
  });

  await test.step("Then I logged out", async () => {
    await page.getByRole("button", { name: "Users" }).click();
    await page.getByText("Logout").click();
  });
});
