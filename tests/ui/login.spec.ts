import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import { loginFixture } from '../../fixtures/loginFixture';

test.describe('Login UI Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('valid login (happy path)', async () => {
    const { valid } = loginFixture;
    await loginPage.login(valid.username, valid.password);
    // (Assume that a successful login redirects to a dashboard or home page.)
    await expect(loginPage.page).toHaveURL(/.*dashboard/);
  });

  test('invalid login (sad path)', async () => {
    const { invalid } = loginFixture;
    await loginPage.login(invalid.username, invalid.password);
    // (Assume that an error message is shown.)
    await expect(loginPage.errorMessage).toBeVisible();
  });
}); 