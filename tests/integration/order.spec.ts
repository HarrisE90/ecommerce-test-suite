import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import { ProductPage } from '../../pages/productPage';
import { CartPage } from '../../pages/cartPage';
import { CheckoutPage } from '../../pages/checkoutPage';
import { loginFixture } from '../../fixtures/loginFixture';
import { productFixture } from '../../fixtures/productFixture';

test.describe('Order Integration Tests', () => {
  test('create order via UI and verify via API', async ({ page, request }) => {
    // Login via UI
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(loginFixture.valid.username, loginFixture.valid.password);

    // Add product to cart
    const productPage = new ProductPage(page);
    await productPage.goto(productFixture.product1.id);
    await productPage.addToCart();

    // Proceed to checkout
    const cartPage = new CartPage(page);
    await cartPage.goto();
    await cartPage.proceedToCheckout();

    // Complete checkout
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.fillShippingInfo();
    await checkoutPage.fillPaymentInfo();
    const orderId = await checkoutPage.placeOrder();

    // Verify order via API
    const response = await request.get(`https://practice-software-testing.com/api/orders/${orderId}`);
    expect(response.ok()).toBeTruthy();
    
    const orderData = await response.json();
    expect(orderData.id).toBe(orderId);
    expect(orderData.status).toBe('confirmed');
  });
}); 