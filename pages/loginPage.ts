import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for the login functionality
 * Handles interactions with the login page including login attempts
 * and error message verification
 */
export class LoginPage {
  private page: Page;
  private usernameInput: Locator;
  private passwordInput: Locator;
  private loginButton: Locator;
  private errorMessageElement: Locator;

  /**
   * Initialize the LoginPage with locators for key elements
   * @param page - Playwright page object
   */
  constructor(page: Page) {
    this.page = page;
    
    // Authentication form elements
    this.usernameInput = page.locator('#email');                 // ID selector
    this.passwordInput = page.locator('#password');              // ID selector
    this.loginButton = page.locator('[data-test="login-submit"]');  // Data-test attribute selector
    this.errorMessageElement = page.locator('.alert-danger');    // Class selector
  }

  /**
   * Navigate to the login page
   */
  async goto() {
    await this.page.goto('https://practicesoftwaretesting.com/auth/login');
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Attempt to login with the provided credentials
   * @param username - Email address for login
   * @param password - Password for login
   */
  async login(username: string, password: string) {
    // Wait for the email field to be visible before interacting
    await this.page.waitForSelector('#email', { state: 'visible' });
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get the error message displayed after failed login
   * @returns Locator for the error message element
   */
  get errorMessage() {
    return this.errorMessageElement;
  }

  /**
   * Check if user is logged in by looking for account menu
   * @returns boolean indicating if user is logged in
   */
  async isLoggedIn() {
    try {
      // Look for elements that indicate successful login
      await this.page.waitForSelector('[data-test="nav-account"]', { timeout: 3000 });
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Wait for redirect after login and verify URL
   * @param expectedUrlPattern - Regex pattern to verify the redirect URL
   */
  async verifyRedirect(expectedUrlPattern: RegExp) {
    await this.page.waitForURL(expectedUrlPattern, { timeout: 5000 });
    await expect(this.page).toHaveURL(expectedUrlPattern);
  }
} 