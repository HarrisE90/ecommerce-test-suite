import { Page } from '@playwright/test';

export class LoginPage {
  page: Page;

  // Locators
  private readonly usernameLocator = '[data-test-id="username"]';
  private readonly passwordLocator = '[data-test-id="password"]';
  private readonly loginButtonLocator = '[data-test-id="login-button"]';
  private readonly errorMessageLocator = '[data-test-id="login-error"]';

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(username: string, password: string) {
    await this.page.fill(this.usernameLocator, username);
    await this.page.fill(this.passwordLocator, password);
    await this.page.click(this.loginButtonLocator);
  }

  get errorMessage() {
    return this.page.locator(this.errorMessageLocator);
  }
} 