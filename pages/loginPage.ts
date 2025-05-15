import { Page } from '@playwright/test';

export class LoginPage {
  page: Page;

  // Locators 
  private readonly usernameLocator = '#email';                   // ID selector
  private readonly passwordLocator = '#password';                // ID selector
  private readonly loginButtonLocator = '[data-test="login-submit"]';  // Data-test attribute selector
  private readonly errorMessageLocator = '.alert-danger';        // Class selector 

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('https://practicesoftwaretesting.com/auth/login');
  }

  async login(username: string, password: string) {
    // Wait for the email field to be visible before interacting
    await this.page.waitForSelector(this.usernameLocator, { state: 'visible' });
    await this.page.fill(this.usernameLocator, username);
    await this.page.fill(this.passwordLocator, password);
    await this.page.click(this.loginButtonLocator);
  }

  get errorMessage() {
    return this.page.locator(this.errorMessageLocator);
  }
} 