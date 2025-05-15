import { Page, Locator, expect } from '@playwright/test';

export class CheckoutPage {
  private page: Page;
  // Cart page elements
  private cartItems: Locator;
  private cartItemName: Locator;
  private itemQuantity: Locator;
  private removeButton: Locator;
  private checkoutButton: Locator;
  
  // Multi-step checkout process
  // Step 1 - Cart elements
  private quantityInput: Locator;
  private continueShoppingButton: Locator;
  private proceedToCheckoutButton: Locator;
  
  // Step 2 - Sign In
  private signInButton: Locator;
  private continueAsGuestButton: Locator;
  
  // Step 3 - Billing Address
  private firstNameInput: Locator;
  private lastNameInput: Locator;
  private addressInput: Locator;
  private cityInput: Locator;
  private stateInput: Locator;
  private postalCodeInput: Locator;
  private countrySelect: Locator;
  private continueToPaymentButton: Locator;
  
  // Step 4 - Payment
  private accountNameInput: Locator;
  private accountNumberInput: Locator;
  private completeOrderButton: Locator;
  
  // Confirmation
  private confirmationMessage: Locator;
  private orderNumber: Locator;
  
  // Shared
  private errorMessage: Locator;
  private totalAmount: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Cart page elements
    this.cartItems = page.locator('tr.align-middle');
    this.cartItemName = page.locator('tr.align-middle td:nth-child(1)');
    this.itemQuantity = page.locator('input.form-control');
    this.removeButton = page.locator('button.btn-danger');
    this.checkoutButton = page.locator('a').filter({ hasText: 'Proceed to checkout' });
    
    // Step 1 - Cart
    this.quantityInput = page.locator('input.form-control[type="number"]');
    this.continueShoppingButton = page.locator('a').filter({ hasText: 'Continue shopping' });
    this.proceedToCheckoutButton = page.locator('a.btn-success').filter({ hasText: 'Proceed to checkout' });
    
    // Step 2 - Sign In
    this.signInButton = page.locator('button.btn-primary').filter({ hasText: 'Sign in' });
    this.continueAsGuestButton = page.locator('button.btn-primary').filter({ hasText: 'Continue as guest' });
    
    // Step 3 - Billing Address
    this.firstNameInput = page.locator('#first-name');
    this.lastNameInput = page.locator('#last-name');
    this.addressInput = page.locator('#address');
    this.cityInput = page.locator('#city');
    this.stateInput = page.locator('#state');
    this.postalCodeInput = page.locator('#postcode');
    this.countrySelect = page.locator('#country');
    this.continueToPaymentButton = page.locator('button.btn-primary').filter({ hasText: 'Continue to payment' });
    
    // Step 4 - Payment
    this.accountNameInput = page.locator('#account-name');
    this.accountNumberInput = page.locator('#account-number');
    this.completeOrderButton = page.locator('button.btn-primary').filter({ hasText: 'Complete order' });
    
    // Confirmation
    this.confirmationMessage = page.locator('h1.confirmation-title');
    this.orderNumber = page.locator('.confirmation-order-number');
    
    // Shared
    this.errorMessage = page.locator('.alert-danger');
    this.totalAmount = page.locator('.total-amount');
  }

  async gotoCart() {
    await this.page.goto('https://practicesoftwaretesting.com/cart');
    await expect(this.page).toHaveURL(/.*\/cart/);
  }

  async getCartItemCount() {
    return await this.cartItems.count();
  }

  async getCartItemNames() {
    const count = await this.cartItemName.count();
    const names: string[] = [];
    
    for (let i = 0; i < count; i++) {
      names.push(await this.cartItemName.nth(i).textContent() || '');
    }
    
    return names;
  }

  async updateQuantity(itemName: string, quantity: number) {
    const itemRow = this.page.locator('tr.align-middle')
      .filter({ hasText: itemName });
      
    await itemRow.locator('input.form-control').fill(quantity.toString());
  }

  async removeItem(itemName: string) {
    const itemRow = this.page.locator('tr.align-middle')
      .filter({ hasText: itemName });
      
    await itemRow.locator('button.btn-danger').click();
  }

  async proceedToCheckout() {
    await this.proceedToCheckoutButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async continueAsGuest() {
    await this.continueAsGuestButton.click();
  }

  async fillBillingInfo(firstName: string, lastName: string, address: string, city: string, state: string, postcode: string, country: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.addressInput.fill(address);
    await this.cityInput.fill(city);
    await this.stateInput.fill(state);
    await this.postalCodeInput.fill(postcode);
    await this.countrySelect.selectOption(country);
  }

  async continueToPayment() {
    await this.continueToPaymentButton.click();
  }

  async fillPaymentInfo(accountName: string, accountNumber: string) {
    await this.accountNameInput.fill(accountName);
    await this.accountNumberInput.fill(accountNumber);
  }

  async completeOrder() {
    await this.completeOrderButton.click();
  }

  async getErrorMessage() {
    if (await this.errorMessage.isVisible()) {
      return await this.errorMessage.textContent();
    }
    return null;
  }

  async getConfirmationMessage() {
    if (await this.confirmationMessage.isVisible()) {
      return await this.confirmationMessage.textContent();
    }
    return null;
  }

  async getOrderNumber() {
    if (await this.orderNumber.isVisible()) {
      return await this.orderNumber.textContent();
    }
    return null;
  }

  async getTotal() {
    return await this.totalAmount.textContent();
  }
} 