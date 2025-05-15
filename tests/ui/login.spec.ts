import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import { loginFixture } from '../../fixtures/loginFixture';

test.describe('Login UI Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('admin login (happy path)', async () => {
    const { admin } = loginFixture;
    await loginPage.login(admin.username, admin.password);
    // Admin users go to the admin dashboard
    await expect(loginPage.page).toHaveURL(/admin\/dashboard/);
  });

  test('regular user login (happy path)', async () => {
    const { user } = loginFixture;
    await loginPage.login(user.username, user.password);
    // Regular users go to the account page
    await expect(loginPage.page).toHaveURL(/account$/);
  });

  test('invalid login (sad path)', async () => {
    const { invalid } = loginFixture;
    await loginPage.login(invalid.username, invalid.password);
    // Expect error message to be visible
    await expect(loginPage.errorMessage).toBeVisible();
  });
}); 