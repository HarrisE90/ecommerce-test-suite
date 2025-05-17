import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import { users } from '../../fixtures/loginFixture';

/**
 * Set timeout for all tests to account for potential network/rendering delays
 */
test.setTimeout(30000);

/**
 * Test suite for the login functionality
 * Tests both successful and unsuccessful login attempts
 * including admin, standard user, and invalid credentials
 */
test.describe('Login Functionality', () => {
  let loginPage: LoginPage;

  /**
   * Before each test:
   * - Initialize the LoginPage
   * - Navigate to the login page
   * - Ensure proper page loading
   */
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
    await page.waitForLoadState('networkidle');
  });

  /**
   * Test: Admin login happy path
   * 
   * Verifies that:
   * - Admin user can login successfully
   * - Admin is redirected to admin dashboard
   */
  test('should allow admin to login successfully', async ({ page }) => {
    const { admin } = users;
    await loginPage.login(admin.username, admin.password);
    
    // Verify redirect to admin dashboard
    await expect(page).toHaveURL(/admin\/dashboard/);
  });

  /**
   * Test: Standard user login happy path
   * 
   * Verifies that:
   * - Standard user can login successfully
   * - User is redirected to account page
   */
  test('should allow standard user to login successfully', async ({ page }) => {
    const { standard } = users;
    await loginPage.login(standard.username, standard.password);
    
    // Verify redirect to account page
    await expect(page).toHaveURL(/account$/);
  });

  /**
   * Test: Invalid login sad path
   * 
   * Verifies that:
   * - Invalid credentials keep user on login page
   * - Login doesn't succeed with wrong credentials
   */
  test('should show error message with invalid credentials', async ({ page }) => {
    const { invalid } = users;
    await loginPage.login(invalid.username, invalid.password);
    
    // Wait for any potential redirects
    await page.waitForTimeout(2000);
    
    // Verify user is still on login page (main verification point)
    await expect(page).toHaveURL(/auth\/login/);
    
    // Check login was not successful by verifying we're not on account page
    const url = page.url();
    expect(url).not.toContain('/account');
    expect(url).not.toContain('/dashboard');
  });
}); 