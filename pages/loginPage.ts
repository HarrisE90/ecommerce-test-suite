import { Page, expect } from '@playwright/test';

/**
 * Page Object Model for the login functionality
 * Handles interactions with the login page including login attempts
 * and error message verification
 */
export class LoginPage {
  private page: Page;

  /**
   * Initialize the LoginPage with locators for key elements
   * @param page - Playwright page object
   */
  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to the login page
   */
  async goto() {
    // First go to homepage
    await this.page.goto('https://practicesoftwaretesting.com/');
    await this.page.waitForLoadState('networkidle');
    
    // Try multiple selectors for the sign-in link
    try {
      // Try data-test attribute first
      const signInLink = this.page.locator('[data-test="nav-sign-in"]');
      if (await signInLink.isVisible()) {
        await signInLink.click();
      } else {
        // Try using text content
        await this.page.getByText('Sign in', { exact: true }).click();
      }
    } catch (error) {
      // If we can't find the link, go directly to the login page
      console.log("Couldn't find sign-in link, going directly to login page");
      await this.page.goto('https://practicesoftwaretesting.com/login');
    }
    
    await this.page.waitForLoadState('networkidle');
    console.log("Navigated to login page");
  }

  /**
   * Attempt to login with the provided credentials
   * @param email - Email address for login
   * @param password - Password for login
   */
  async login(email: string, password: string) {
    try {
      // Wait for page to load and email field to be visible
      await this.page.waitForSelector('[data-test="email"]', { timeout: 10000 });
      console.log("Email field found");
      
      // Fill in credentials
      await this.page.locator('[data-test="email"]').fill(email);
      console.log("Filled email field");
      
      await this.page.locator('[data-test="password"]').fill(password);
      console.log("Filled password field");
      
      // Click login button
      await this.page.locator('[data-test="login-submit"]').click();
      console.log("Clicked login button");
      
      // Wait for navigation
      await this.page.waitForLoadState('networkidle');
    } catch (error) {
      console.error("Error during login:", error);
      
      // Try alternative selectors if data-test attributes don't work
      console.log("Trying alternative selectors");
      await this.page.fill('input[type="email"]', email);
      await this.page.fill('input[type="password"]', password);
      
      // Try to find the login button
      const loginButton = this.page.getByRole('button', { name: /login|sign in/i });
      if (await loginButton.isVisible()) {
        await loginButton.click();
      }
      
      await this.page.waitForLoadState('networkidle');
    }
  }

  /**
   * Get the error message displayed after failed login
   * @returns Error message text or null if no error message is displayed
   */
  async getErrorMessage(): Promise<string | null> {
    const errorAlert = this.page.getByRole('alert');
    if (await errorAlert.isVisible()) {
      return await errorAlert.textContent();
    }
    return null;
  }

  /**
   * Check if user is logged in by looking for account menu
   * @returns boolean indicating if user is logged in
   */
  async isLoggedIn(): Promise<boolean> {
    // Check for elements that indicate a successful login
    try {
      // Look for account menu or profile link that appears after login
      const accountElement = this.page.locator('[data-test="nav-account"]');
      return await accountElement.isVisible();
    } catch (error) {
      return false;
    }
  }

  /**
   * Logout the user
   */
  async logout() {
    // Click on the account dropdown or menu
    await this.page.locator('[data-test="nav-account"]').click();
    
    // Click on the logout option
    await this.page.getByText('Logout').click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Register a new user
   * @param email - Email address for registration
   * @param password - Password for registration
   * @param firstName - First name for registration
   * @param lastName - Last name for registration
   * @param address - Address for registration
   * @param city - City for registration
   * @param state - State for registration
   * @param postcode - Postcode for registration
   * @param country - Country for registration
   */
  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    address: string = '123 Test St',
    city: string = 'Test City',
    state: string = 'Test State',
    postcode: string = '12345',
    country: string = 'US'
  ) {
    // Go to register page
    await this.page.goto('https://practicesoftwaretesting.com/register');
    await this.page.waitForLoadState('networkidle');
    
    // Fill registration form
    await this.page.locator('[data-test="first-name"]').fill(firstName);
    await this.page.locator('[data-test="last-name"]').fill(lastName);
    await this.page.locator('[data-test="address"]').fill(address);
    await this.page.locator('[data-test="city"]').fill(city);
    await this.page.locator('[data-test="state"]').fill(state);
    await this.page.locator('[data-test="postcode"]').fill(postcode);
    await this.page.locator('[data-test="country"]').selectOption(country);
    await this.page.locator('[data-test="email"]').fill(email);
    await this.page.locator('[data-test="password"]').fill(password);
    
    // Submit registration form
    await this.page.locator('[data-test="register-submit"]').click();
    await this.page.waitForLoadState('networkidle');
  }
} 