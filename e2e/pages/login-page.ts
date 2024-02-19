import { type Page } from '@playwright/test';

export class LoginPage {
  constructor(readonly page: Page) {}

  async goto() {
    await this.page.goto(`${process.env.E2E_BASE_URL}/spa/login`);
  }
}
