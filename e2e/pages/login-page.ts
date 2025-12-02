import { type Page } from '@playwright/test';

export class LoginPage {
  constructor(readonly page: Page) {}

  async goto() {
    await this.page.goto(`${process.env.E2E_BASE_URL}/spa/login`);
  }

  /**
   * Performs the two-step login flow.
   * Note: After O3-5243 fix, password field exists in DOM but is hidden until username step.
   * This method waits for password field to become visible before filling it.
   */
  async login(username: string, password: string) {
    await this.goto();
    await this.page.getByLabel(/username/i).fill(username);
    await this.page.getByText(/continue/i).click();
    // Password field is hidden until this step (O3-5243: two-step login form)
    await this.page.getByLabel(/^password$/i).waitFor({ state: 'visible', timeout: 10000 });
    await this.page.getByLabel(/^password$/i).fill(password);
    await this.page.getByRole('button', { name: /log in/i }).click();
    // Wait for page navigation to complete after login
    await this.page.waitForLoadState('networkidle');
  }
}
