import { test, expect } from '@playwright/test';
import { ProductBrowsingPage } from '../../pages/productBrowsingPage';
import { CheckoutPage } from '../../pages/checkoutPage';
import { LoginPage } from '../../pages/loginPage';
import { products, userInfo } from '../../fixtures/productFixture';
import { users } from '../../fixtures/loginFixture';

test.describe('Checkout Process', () => {
  let productPage: ProductBrowsingPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    productPage = new ProductBrowsingPage(page);
    checkoutPage = new CheckoutPage(page);
    
    // Start at the product page
    await productPage.goto();
    
    // Add a product to the cart for checkout tests
    const productNames = await productPage.getProductNames();
    if (productNames.length > 0) {
      await productPage.addProductToCart(productNames[0]);
      // Wait for cart to update
      await page.waitForTimeout(500);
    }
  });

  test('should display correct items in cart', async ({ page }) => {
    // Go to cart page
    await checkoutPage.gotoCart();
    
    // Verify items in cart
    const cartItemCount = await checkoutPage.getCartItemCount();
    expect(cartItemCount).toBe(1);
    
    // Get the name of the item in the cart
    const cartItemNames = await checkoutPage.getCartItemNames();
    expect(cartItemNames.length).toBe(1);
  });

  test('should update item quantity in cart', async ({ page }) => {
    // Go to cart page
    await checkoutPage.gotoCart();
    
    // Get the name of the item in the cart
    const cartItemNames = await checkoutPage.getCartItemNames();
    expect(cartItemNames.length).toBe(1);
    
    // Update quantity to 2
    await checkoutPage.updateQuantity(cartItemNames[0], 2);
    
    // Wait for cart to update
    await page.waitForTimeout(500);
    
    // Verify total reflects the quantity change
    const total = await checkoutPage.getTotal();
    expect(total).toBeTruthy();
  });

  test('should remove item from cart', async ({ page }) => {
    // Go to cart page
    await checkoutPage.gotoCart();
    
    // Get initial cart count
    let cartItemCount = await checkoutPage.getCartItemCount();
    expect(cartItemCount).toBe(1);
    
    // Get the name of the item in the cart
    const cartItemNames = await checkoutPage.getCartItemNames();
    expect(cartItemNames.length).toBe(1);
    
    // Remove the item
    await checkoutPage.removeItem(cartItemNames[0]);
    
    // Wait for cart to update
    await page.waitForTimeout(500);
    
    // Verify cart is empty
    cartItemCount = await checkoutPage.getCartItemCount();
    expect(cartItemCount).toBe(0);
  });

  test('should proceed through checkout as guest', async ({ page }) => {
    // Go to cart page
    await checkoutPage.gotoCart();
    
    // Verify we have items in cart
    const cartItemCount = await checkoutPage.getCartItemCount();
    expect(cartItemCount).toBe(1);
    
    // Proceed to checkout
    await checkoutPage.proceedToCheckout();
    
    // Continue as guest
    await checkoutPage.continueAsGuest();
    
    // Fill billing information
    await checkoutPage.fillBillingInfo(
      userInfo.validCheckout.firstName,
      userInfo.validCheckout.lastName,
      userInfo.validCheckout.address,
      userInfo.validCheckout.city,
      userInfo.validCheckout.state,
      userInfo.validCheckout.postcode,
      userInfo.validCheckout.country
    );
    
    // Continue to payment
    await checkoutPage.continueToPayment();
    
    // Fill payment information
    await checkoutPage.fillPaymentInfo(
      userInfo.validCheckout.accountName,
      userInfo.validCheckout.accountNumber
    );
    
    // Complete order
    await checkoutPage.completeOrder();
    
    // Verify confirmation message
    const confirmationMessage = await checkoutPage.getConfirmationMessage();
    expect(confirmationMessage).toBeTruthy();
    
    // Verify order number is generated
    const orderNumber = await checkoutPage.getOrderNumber();
    expect(orderNumber).toBeTruthy();
  });

  test('should display error with invalid payment info', async ({ page }) => {
    // Go to cart page
    await checkoutPage.gotoCart();
    
    // Proceed to checkout
    await checkoutPage.proceedToCheckout();
    
    // Continue as guest
    await checkoutPage.continueAsGuest();
    
    // Fill valid billing information
    await checkoutPage.fillBillingInfo(
      userInfo.validCheckout.firstName,
      userInfo.validCheckout.lastName,
      userInfo.validCheckout.address,
      userInfo.validCheckout.city,
      userInfo.validCheckout.state,
      userInfo.validCheckout.postcode,
      userInfo.validCheckout.country
    );
    
    // Continue to payment
    await checkoutPage.continueToPayment();
    
    // Fill invalid payment information
    await checkoutPage.fillPaymentInfo(
      userInfo.invalidCheckout.accountName,
      userInfo.invalidCheckout.accountNumber
    );
    
    // Try to complete order
    await checkoutPage.completeOrder();
    
    // Verify error message is displayed
    const errorMessage = await checkoutPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });
}); 