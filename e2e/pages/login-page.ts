import { type Page } from '@playwright/test';

export class LoginPage {
  constructor(readonly page: Page) {}

  async goto() {
    await this.page.goto(`${process.env.E2E_BASE_URL}/spa/login`);
  }

  async login(username: string, password: string) {
    await this.goto();
    await this.page.getByLabel(/username/i).fill(username);
    await this.page.getByText(/continue/i).click();
    await this.page.getByLabel(/^password$/i).waitFor({ state: 'visible', timeout: 10000 });
    await this.page.getByLabel(/^password$/i).fill(password);
    await this.page.getByRole('button', { name: /log in/i }).click();
    await this.page.waitForLoadState('networkidle');
  }
}
