import { Page } from '@playwright/test';

export class LoginPage {
  constructor(readonly page: Page) {}

  async goto() {
    await this.page.goto(`${process.env.E2E_BASE_URL}/spa/login`);
  }

  async enterLoginCredentials() {
    await this.page.getByLabel(/username/i).fill(`${process.env.E2E_USER_ADMIN_USERNAME}`);
    await this.page.getByText(/continue/i).click();
    await this.page.getByLabel(/password/i).fill(`${process.env.E2E_USER_ADMIN_PASSWORD}`);
    await this.page.getByRole('button', { name: /log in/i }).click();
    await this.page.getByText(/inpatient ward/i).click();
    await this.page.getByRole('button', { name: /confirm/i }).click();
  }
}
