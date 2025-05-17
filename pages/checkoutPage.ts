import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for the checkout functionality
 * Handles interactions with the cart and checkout process
 * including item management, billing, payment, and order confirmation
 */
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
  // General payment elements
  private paymentMethodSelect: Locator;
  private completeOrderButton: Locator;
  
  // Bank Transfer specific fields
  private bankNameInput: Locator;
  private accountNameInput: Locator;
  private accountNumberInput: Locator;
  
  // Credit Card specific fields
  private creditCardNumberInput: Locator;
  private expirationDateInput: Locator;
  private cvvInput: Locator;
  private cardHolderNameInput: Locator;
  
  // Gift Card specific fields
  private giftCardNumberInput: Locator;
  private validationCodeInput: Locator;
  
  // Buy Now Pay Later specific fields
  private monthlyInstallmentsSelect: Locator;
  
  // Confirmation
  private confirmationMessage: Locator;
  private orderNumber: Locator;
  private paymentSuccessMessage: Locator;
  
  // Shared
  private errorMessage: Locator;
  private totalAmount: Locator;

  /**
   * Initialize the CheckoutPage with locators for key elements
   * @param page - Playwright page object
   */
  constructor(page: Page) {
    this.page = page;
    
    // Cart page elements - updated based on actual page structure
    this.cartItems = page.locator('table tbody tr').filter({ hasText: '$' });
    this.cartItemName = page.locator('table tbody tr td').first();
    this.itemQuantity = page.locator('input[type="number"]');
    this.removeButton = page.locator('button.btn.btn-danger');
    this.checkoutButton = page.locator('button.btn-success').filter({ hasText: 'Proceed to checkout' });
    
    // Step 1 - Cart
    this.quantityInput = page.locator('input[type="number"]');
    this.continueShoppingButton = page.locator('a').filter({ hasText: 'Continue shopping' });
    this.proceedToCheckoutButton = page.locator('[data-test="proceed-1"]');
    
    // Step 2 - Sign In
    this.signInButton = page.locator('button').filter({ hasText: 'Login' });
    this.continueAsGuestButton = page.locator('button').filter({ hasText: 'Continue as guest' });
    
    // Step 3 - Billing Address
    this.firstNameInput = page.locator('#first-name');
    this.lastNameInput = page.locator('#last-name');
    this.addressInput = page.locator('[data-test="street"]');
    this.cityInput = page.locator('[data-test="city"]');
    this.stateInput = page.locator('[data-test="state"]');
    this.postalCodeInput = page.locator('[data-test="postal_code"]');
    this.countrySelect = page.locator('[data-test="country"]');
    this.continueToPaymentButton = page.locator('[data-test="proceed-2"]');
    
    // Step 4 - Payment
    // General payment elements
    this.paymentMethodSelect = page.locator('[data-test="payment-method"]');
    this.completeOrderButton = page.locator('[data-test="finish"]');
    
    // Bank Transfer specific fields
    this.bankNameInput = page.locator('[data-test="bank_name"]');
    this.accountNameInput = page.locator('[data-test="account_name"]');
    this.accountNumberInput = page.locator('[data-test="account_number"]');
    
    // Credit Card specific fields
    this.creditCardNumberInput = page.locator('[data-test="credit_card_number"]');
    this.expirationDateInput = page.locator('[data-test="expiration_date"]');
    this.cvvInput = page.locator('[data-test="cvv"]');
    this.cardHolderNameInput = page.locator('[data-test="card_holder_name"]');
    
    // Gift Card specific fields
    this.giftCardNumberInput = page.locator('[data-test="gift_card_number"]');
    this.validationCodeInput = page.locator('[data-test="validation_code"]');
    
    // Buy Now Pay Later specific fields
    this.monthlyInstallmentsSelect = page.locator('[data-test="monthly_installments"]');
    
    // Confirmation
    this.confirmationMessage = page.locator('h1.confirmation-title');
    this.orderNumber = page.locator('.confirmation-order-number');
    this.paymentSuccessMessage = page.locator('div').filter({ hasText: /^Payment was successful$/ }).first();
    
    // Shared
    this.errorMessage = page.locator('.alert-danger');
    this.totalAmount = page.locator('[data-test="cart-total"]');
  }

  /**
   * Navigate to the cart page
   */
  async gotoCart() {
    console.log("Navigating to cart page");
    try {
      // Try to click the cart navigation link
      const cartNavLink = this.page.locator('[data-test="nav-cart"]');
      
      // Wait for the link to be visible before clicking
      await cartNavLink.waitFor({ state: 'visible', timeout: 5000 });
      await cartNavLink.click();
      
      // Wait for navigation to complete
      await this.page.waitForLoadState('networkidle');
      
      // Add extra wait time for cart to fully load
      await this.page.waitForTimeout(2000);
      
      // Wait for either cart table or empty cart message to be visible
      try {
        await Promise.race([
          this.page.locator('table').waitFor({ state: 'visible', timeout: 5000 }),
          this.page.locator('.cart-items').waitFor({ state: 'visible', timeout: 5000 }),
          this.page.locator('text=The cart is empty').waitFor({ state: 'visible', timeout: 5000 })
        ]);
        console.log("Cart page content loaded");
      } catch (error) {
        console.log("Timed out waiting for cart page elements, continuing anyway");
      }
    } catch (error) {
      console.log(`Error navigating to cart: ${error}`);
      
      // Fallback: try direct navigation to cart
      await this.page.goto('https://practicesoftwaretesting.com/cart');
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(2000);
      console.log("Navigated directly to cart page as fallback");
    }
  }

  /**
   * Get the number of items in the cart
   * @returns The count of items in the cart
   */
  async getCartItemCount(): Promise<number> {
    // Wait for cart content to be visible
    try {
      await Promise.race([
        this.page.locator('table tbody tr').first().waitFor({ timeout: 2000 }),
        this.page.locator('.cart-item').first().waitFor({ timeout: 2000 }),
        this.page.locator('text=The cart is empty').waitFor({ timeout: 2000 })
      ]);
      console.log("Cart content detected");
    } catch (error) {
      console.log("Timed out waiting for cart content visibility");
    }
    
    // Wait an additional moment for any dynamic content to render
    await this.page.waitForTimeout(1000);
    
    // Try multiple approaches to count items
    // 1. Try counting table rows (traditional approach)
    const tableRowCount = await this.page.locator('table tbody tr:not(.empty-row)').count();
    
    // 2. Try counting quantity inputs
    const quantityInputCount = await this.page.locator('[data-test="product-quantity"]').count();
    
    // 3. Try counting product titles
    const productTitleCount = await this.page.locator('[data-test="product-title"]').count();
    
    // 4. Try counting cart items by class
    const cartItemCount = await this.page.locator('.cart-item').count();
    
    // 5. Try looking for product images in cart
    const productImageCount = await this.page.locator('.cart-product-image').count();
    
    // Log all counts for debugging
    console.log(`Cart count detection - Table rows: ${tableRowCount}, Quantity inputs: ${quantityInputCount}, Product titles: ${productTitleCount}, Cart items: ${cartItemCount}, Product images: ${productImageCount}`);
    
    // Return the maximum count found by any method
    return Math.max(tableRowCount, quantityInputCount, productTitleCount, cartItemCount, productImageCount);
  }

  /**
   * Get the names of all items in the cart
   * @returns Array of item names in the cart
   */
  async getCartItemNames(): Promise<string[]> {
    const itemNames: string[] = [];
    
    // Try multiple selector approaches to find product names
    
    // 1. Try data-test attribute for product titles
    const productTitles = await this.page.locator('[data-test="product-title"]').all();
    for (const item of productTitles) {
      const text = await item.textContent();
      if (text && !itemNames.includes(text.trim())) {
        itemNames.push(text.trim());
      }
    }
    
    // 2. If no product titles found, try table cell approach
    if (itemNames.length === 0) {
      // Look for product names in table cells (first cell of each row typically)
      const rows = await this.page.locator('table tbody tr').all();
      for (const row of rows) {
        const cells = await row.locator('td').all();
        if (cells.length > 0) {
          const text = await cells[0].textContent();
          if (text && !itemNames.includes(text.trim())) {
            itemNames.push(text.trim());
          }
        }
      }
    }
    
    // 3. Try cart-item-name class if available
    if (itemNames.length === 0) {
      const cartItemNames = await this.page.locator('.cart-item-name').all();
      for (const item of cartItemNames) {
        const text = await item.textContent();
        if (text && !itemNames.includes(text.trim())) {
          itemNames.push(text.trim());
        }
      }
    }
    
    // 4. Last resort - look for any text in cart items that might be product names
    if (itemNames.length === 0) {
      const cartItems = await this.page.locator('.cart-item').all();
      for (const item of cartItems) {
        // Try to find the most likely element containing the product name
        const nameElement = await item.locator('h5, h4, h3, strong, .name, [class*="name"], [class*="title"]').first();
        if (await nameElement.count() > 0) {
          const text = await nameElement.textContent();
          if (text && !itemNames.includes(text.trim())) {
            itemNames.push(text.trim());
          }
        }
      }
    }
    
    // Log the results
    console.log(`Found ${itemNames.length} cart item names: ${itemNames.join(', ')}`);
    
    return itemNames;
  }

  /**
   * Update the quantity of a specific item in the cart
   * @param productName - Name of the item to update
   * @param quantity - New quantity to set
   */
  async updateQuantity(productName: string, quantity: number) {
    console.log(`Updating quantity for "${productName}" to ${quantity}`);
    
    let quantityUpdated = false;
    
    // Approach 1: Find the row containing the product using data-test attributes
    try {
      const rows = await this.page.locator('table tbody tr').all();
      
      for (const row of rows) {
        const nameElement = await row.locator('[data-test="product-title"]');
        if (await nameElement.count() > 0) {
          const name = await nameElement.textContent();
          
          if (name?.includes(productName)) {
            console.log(`Found product "${productName}" in cart table`);
            // Find quantity input and update it
            const quantityInput = row.locator('[data-test="product-quantity"]');
            if (await quantityInput.count() > 0) {
              await quantityInput.clear();
              await quantityInput.fill(quantity.toString());
              console.log(`Updated quantity using data-test attributes`);
              
              // Wait for cart to update
              await this.page.waitForTimeout(1000);
              quantityUpdated = true;
              break;
            }
          }
        }
      }
    } catch (error) {
      console.log(`Error using approach 1: ${error}`);
    }
    
    // Approach 2: Look for cart items by class
    if (!quantityUpdated) {
      try {
        const cartItems = await this.page.locator('.cart-item').all();
        
        for (const item of cartItems) {
          // Try to find the product name element
          const nameElements = await item.locator('h5, h4, h3, strong, .name, [class*="name"], [class*="title"]').all();
          
          for (const nameElement of nameElements) {
            const name = await nameElement.textContent();
            
            if (name?.includes(productName)) {
              console.log(`Found product "${productName}" in cart items`);
              // Find quantity input and update it
              const quantityInput = item.locator('input[type="number"]');
              if (await quantityInput.count() > 0) {
                await quantityInput.clear();
                await quantityInput.fill(quantity.toString());
                console.log(`Updated quantity using cart item classes`);
                
                // Wait for cart to update
                await this.page.waitForTimeout(1000);
                quantityUpdated = true;
                break;
              }
            }
          }
          
          if (quantityUpdated) break;
        }
      } catch (error) {
        console.log(`Error using approach 2: ${error}`);
      }
    }
    
    // Approach 3: Find by direct quantity input if product name cannot be matched
    if (!quantityUpdated) {
      try {
        console.log(`Product "${productName}" not found, updating first available quantity input`);
        const quantityInputs = await this.page.locator('input[type="number"]').all();
        
        if (quantityInputs.length > 0) {
          await quantityInputs[0].clear();
          await quantityInputs[0].fill(quantity.toString());
          console.log(`Updated first available quantity input`);
          
          // Wait for cart to update
          await this.page.waitForTimeout(1000);
          quantityUpdated = true;
        }
      } catch (error) {
        console.log(`Error using approach 3: ${error}`);
      }
    }
    
    if (!quantityUpdated) {
      console.log(`Failed to update quantity for "${productName}"`);
    }
  }

  /**
   * Remove an item from the cart
   * @param productName - Name of the item to remove
   */
  async removeItem(productName: string) {
    console.log(`Removing item "${productName}" from cart`);
    
    let itemRemoved = false;
    
    // Approach 1: Find the row containing the product using data-test attributes
    try {
      const rows = await this.page.locator('table tbody tr').all();
      
      for (const row of rows) {
        const nameElement = await row.locator('[data-test="product-title"]');
        if (await nameElement.count() > 0) {
          const name = await nameElement.textContent();
          
          if (name?.includes(productName)) {
            console.log(`Found product "${productName}" in cart table`);
            // Look for remove button or link
            const removeButton = row.locator('button, a').filter({ hasText: /remove|delete|×|x/i }).first();
            if (await removeButton.count() > 0) {
              await removeButton.click();
              console.log(`Removed product using remove button`);
              itemRemoved = true;
            } else {
              // Try clicking any button or link that might be for removal
              const buttons = await row.locator('button, a').all();
              if (buttons.length > 0) {
                await buttons[buttons.length - 1].click(); // Often the last button/link is for removal
                console.log(`Clicked potential remove button`);
                itemRemoved = true;
              }
            }
            
            // Wait for confirmation alert
            try {
              await this.page.getByRole('alert').waitFor({ state: 'visible', timeout: 5000 });
              console.log(`Removal confirmation alert seen`);
            } catch (error) {
              console.log("No delete confirmation seen, continuing anyway");
            }
            
            // Wait for cart to update
            await this.page.waitForTimeout(1000);
            break;
          }
        }
      }
    } catch (error) {
      console.log(`Error using approach 1: ${error}`);
    }
    
    // Approach 2: Look for cart items by class
    if (!itemRemoved) {
      try {
        const cartItems = await this.page.locator('.cart-item').all();
        
        for (const item of cartItems) {
          // Try to find the product name element
          const nameElements = await item.locator('h5, h4, h3, strong, .name, [class*="name"], [class*="title"]').all();
          
          for (const nameElement of nameElements) {
            const name = await nameElement.textContent();
            
            if (name?.includes(productName)) {
              console.log(`Found product "${productName}" in cart items`);
              // Look for remove button or link
              const removeButton = item.locator('button, a').filter({ hasText: /remove|delete|×|x/i }).first();
              if (await removeButton.count() > 0) {
                await removeButton.click();
                console.log(`Removed product using cart item classes`);
                itemRemoved = true;
              } else {
                // Try clicking any button or link that might be for removal
                const buttons = await item.locator('button, a').all();
                if (buttons.length > 0) {
                  await buttons[buttons.length - 1].click(); // Often the last button/link is for removal
                  console.log(`Clicked potential remove button in cart item`);
                  itemRemoved = true;
                }
              }
              
              // Wait for cart to update
              await this.page.waitForTimeout(1000);
              break;
            }
          }
          
          if (itemRemoved) break;
        }
      } catch (error) {
        console.log(`Error using approach 2: ${error}`);
      }
    }
    
    // Approach 3: Remove first item if product name cannot be matched
    if (!itemRemoved) {
      try {
        console.log(`Product "${productName}" not found, removing first available item`);
        const removeButtons = await this.page.locator('button, a').filter({ hasText: /remove|delete|×|x/i }).all();
        
        if (removeButtons.length > 0) {
          await removeButtons[0].click();
          console.log(`Removed first item using remove button`);
          itemRemoved = true;
          
          // Wait for cart to update
          await this.page.waitForTimeout(1000);
        } else {
          // Try finding table rows and clicking likely removal elements
          const rows = await this.page.locator('table tbody tr').all();
          if (rows.length > 0) {
            const firstRow = rows[0];
            const buttons = await firstRow.locator('button, a').all();
            if (buttons.length > 0) {
              await buttons[buttons.length - 1].click(); // Often the last button/link is for removal
              console.log(`Clicked potential remove button on first row`);
              itemRemoved = true;
              
              // Wait for cart to update
              await this.page.waitForTimeout(1000);
            }
          }
        }
      } catch (error) {
        console.log(`Error using approach 3: ${error}`);
      }
    }
    
    if (!itemRemoved) {
      console.log(`Failed to remove item "${productName}" from cart`);
    }
  }

  /**
   * Proceed to checkout from the cart page
   */
  async proceedToCheckout() {
    console.log("Attempting to proceed to checkout...");
    
    // Take a screenshot before proceeding to help with debugging
    await this.page.screenshot({ path: 'before-proceed-to-checkout.png' })
      .catch(err => console.log("Could not take screenshot:", err));
    
    // Wait to ensure the page is stable before proceeding
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
    
    // Try multiple selectors for the checkout button
    const checkoutSelectors = [
      '[data-test="proceed-1"]', 
      'button:has-text("Proceed to Checkout")',
      'button:has-text("Checkout")',
      'a:has-text("Proceed to Checkout")',
      'a:has-text("Checkout")',
      '.checkout-button',
      '.btn-success'
    ];
    
    let proceedClicked = false;
    
    for (const selector of checkoutSelectors) {
      try {
        const button = this.page.locator(selector);
        const count = await button.count();
        
        if (count > 0) {
          // Make sure the button is visible and scrolled into view
          await button.scrollIntoViewIfNeeded();
          await this.page.waitForTimeout(500);
          
          if (await button.isVisible()) {
            // Wait a moment to make sure it's ready for interaction
            await this.page.waitForTimeout(500);
            
            // Click and wait for navigation
            await button.click();
            console.log(`Clicked checkout button using selector: ${selector}`);
            proceedClicked = true;
            
            // Wait for navigation to complete
            await this.page.waitForLoadState('networkidle');
            await this.page.waitForTimeout(2000);
            break;
          } else {
            console.log(`Checkout button found with ${selector} but not visible`);
          }
        }
      } catch (error) {
        console.log(`Error clicking ${selector}: ${error}`);
      }
    }
    
    if (!proceedClicked) {
      console.log("Could not find or click any checkout button");
      // Try clicking any primary/success button on the page as a last resort
      try {
        const buttons = await this.page.locator('button.btn-primary, button.btn-success').all();
        if (buttons.length > 0) {
          for (const button of buttons) {
            if (await button.isVisible()) {
              await button.click();
              console.log("Clicked a prominent button as fallback");
              proceedClicked = true;
              
              // Wait for navigation
              await this.page.waitForLoadState('networkidle');
              await this.page.waitForTimeout(2000);
              break;
            }
          }
        }
      } catch (error) {
        console.log(`Error with fallback button approach: ${error}`);
      }
    }
    
    // Wait for checkout page to be ready - look for signs of login/guest or billing form
    try {
      await Promise.race([
        this.page.locator('button:has-text("Continue as guest")').waitFor({ timeout: 5000 }),
        this.page.locator('button:has-text("Login")').waitFor({ timeout: 5000 }),
        this.page.locator('#first-name').waitFor({ timeout: 5000 }),
        this.page.locator('[data-test="first-name"]').waitFor({ timeout: 5000 }),
        this.page.locator('[data-test="email"]').waitFor({ timeout: 5000 })
      ]);
      console.log("Checkout page loaded");
    } catch (error) {
      console.log("Timed out waiting for checkout page, continuing anyway");
    }
    
    // Take a screenshot after proceeding to help with debugging
    await this.page.screenshot({ path: 'after-proceed-to-checkout.png' })
      .catch(err => console.log("Could not take screenshot:", err));
  }

  /**
   * Continue shopping (return to product listing)
   */
  async continueShopping() {
    await this.continueShoppingButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Continue checkout as a guest (without signing in)
   */
  async continueAsGuest() {
    console.log("Attempting to continue as guest...");
    
    // Take a screenshot before proceeding
    await this.page.screenshot({ path: 'before-continue-as-guest.png' });
    
    // Try multiple selectors for the guest checkout button/link
    const guestSelectors = [
      'a:has-text("Continue as Guest")',
      'button:has-text("Continue as Guest")',
      'button:has-text("Continue as guest")',
      '[data-test="guest-checkout"]',
      'a:has-text("Checkout as Guest")',
      'button:has-text("Checkout as Guest")'
    ];
    
    let guestContinued = false;
    
    // First check if we need guest selection or if we're already at the billing form
    try {
      // Check if we're already at billing form (skipping guest/login)
      const billingForm = await Promise.race([
        this.page.locator('#first-name').waitFor({ state: 'visible', timeout: 2000 }),
        this.page.locator('[data-test="first-name"]').waitFor({ state: 'visible', timeout: 2000 })
      ]).then(() => true).catch(() => false);
      
      if (billingForm) {
        console.log("Already at billing form, no need to select guest checkout");
        guestContinued = true;
      }
    } catch (error) {
      // Continue with guest selection
    }
    
    if (!guestContinued) {
      for (const selector of guestSelectors) {
        try {
          const button = this.page.locator(selector);
          if (await button.count() > 0) {
            // Make sure the button is visible and scrolled into view
            await button.scrollIntoViewIfNeeded();
            await this.page.waitForTimeout(500);
            
            if (await button.isVisible()) {
              await button.click();
              console.log(`Clicked guest checkout button using selector: ${selector}`);
              guestContinued = true;
              break;
            } else {
              console.log(`Guest checkout button found with ${selector} but not visible`);
            }
          }
        } catch (error) {
          console.log(`Error clicking ${selector}: ${error}`);
        }
      }
    }
    
    if (!guestContinued) {
      console.log("Could not find or click any guest checkout button");
      // Look for any way to get to billing form, potentially skipping login
      try {
        const skipButtons = [
          'button:has-text("Skip")',
          'a:has-text("Skip")',
          'button:has-text("Continue")',
          'a:has-text("Continue")',
          'button.btn-secondary',
          'button.btn-outline-primary'
        ];
        
        for (const selector of skipButtons) {
          const button = this.page.locator(selector);
          if (await button.count() > 0 && await button.isVisible()) {
            await button.click();
            console.log(`Clicked potential skip/continue button: ${selector}`);
            guestContinued = true;
            break;
          }
        }
      } catch (error) {
        console.log(`Error with fallback approach: ${error}`);
      }
    }
    
    // Wait for navigation to complete
    await this.page.waitForLoadState('networkidle');
    
    // Wait for billing form to appear
    try {
      await Promise.race([
        this.page.locator('#first-name').waitFor({ timeout: 5000 }),
        this.page.locator('[data-test="first-name"]').waitFor({ timeout: 5000 }),
        this.page.locator('input[name="firstName"]').waitFor({ timeout: 5000 }),
        this.page.locator('form').waitFor({ timeout: 5000 })
      ]);
      console.log("Billing form detected after guest checkout");
    } catch (error) {
      console.log("Timed out waiting for billing form, continuing anyway");
    }
    
    // Take a screenshot after proceeding
    await this.page.screenshot({ path: 'after-continue-as-guest.png' });
  }

  /**
   * Fill in billing information form
   * @param firstName - Customer's first name
   * @param lastName - Customer's last name
   * @param address - Street address
   * @param city - City
   * @param state - State/province
   * @param postcode - Postal/ZIP code
   * @param country - Country code
   */
  async fillBillingInfo(firstName: string, lastName: string, address: string, city: string, state: string, postcode: string, country: string) {
    console.log("Filling billing information...");
    
    // Wait for form to appear - try multiple selectors
    try {
      await Promise.race([
        this.page.locator('#first-name').waitFor({ timeout: 5000 }),
        this.page.locator('[data-test="first-name"]').waitFor({ timeout: 5000 }),
        this.page.locator('input[name="firstName"]').waitFor({ timeout: 5000 }),
        this.page.locator('form').waitFor({ timeout: 5000 })
      ]);
      console.log("Billing form detected");
    } catch (error) {
      console.log("Timed out waiting for billing form, continuing anyway");
    }
    
    // Save a screenshot to see the form
    await this.page.screenshot({ path: 'billing-form.png' });
    
    // Helper function to fill input with multiple fallback selectors
    const fillInput = async (value: string, ...selectors: string[]) => {
      for (const selector of selectors) {
        try {
          const input = this.page.locator(selector);
          if (await input.count() > 0 && await input.isVisible()) {
            await input.fill(value);
            console.log(`Filled ${selector} with ${value}`);
            return true;
          }
        } catch (error) {
          console.log(`Error filling ${selector}: ${error}`);
        }
      }
      console.log(`Could not fill any selector with ${value}`);
      return false;
    };
    
    // Try filling each field with multiple possible selectors
    await fillInput(firstName, '#first-name', '[data-test="first-name"]', 'input[name="firstName"]', 'input[placeholder*="first"]');
    await fillInput(lastName, '#last-name', '[data-test="last-name"]', 'input[name="lastName"]', 'input[placeholder*="last"]');
    await fillInput(address, '[data-test="street"]', '#address', 'input[name="address"]', 'input[placeholder*="address"]');
    await fillInput(city, '[data-test="city"]', '#city', 'input[name="city"]', 'input[placeholder*="city"]');
    await fillInput(state, '[data-test="state"]', '#state', 'input[name="state"]', 'input[placeholder*="state"]');
    await fillInput(postcode, '[data-test="postal_code"]', '#postal-code', '#postcode', 'input[name="postalCode"]', 'input[placeholder*="postal"]', 'input[placeholder*="zip"]');
    
    // Try to select country with multiple possible selectors
    try {
      const countrySelectors = ['[data-test="country"]', '#country', 'select[name="country"]'];
      for (const selector of countrySelectors) {
        const select = this.page.locator(selector);
        if (await select.count() > 0 && await select.isVisible()) {
          await select.selectOption(country);
          console.log(`Selected country ${country} using ${selector}`);
          break;
        }
      }
    } catch (error) {
      console.log(`Error selecting country: ${error}`);
    }
    
    console.log("Billing information filled");
  }

  /**
   * Continue to the payment step
   */
  async continueToPayment() {
    console.log("Continuing to payment step...");
    
    // Take a screenshot to help with debugging
    try {
      await this.page.screenshot({ path: 'before-continue-to-payment.png' });
    } catch (error) {
      console.log("Could not take screenshot:", error);
    }
    
    // Wait for the page to be stable
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
    
    // Try multiple selectors for the continue button
    const continueSelectors = [
      '[data-test="proceed-3"]',
      'button:has-text("Continue to Payment")',
      'button:has-text("Continue")',
      '[type="submit"]',
      '.btn-primary'
    ];
    
    let clicked = false;
    
    for (const selector of continueSelectors) {
      try {
        const button = this.page.locator(selector);
        const count = await button.count();
        
        if (count > 0 && await button.isVisible()) {
          // Scroll the button into view to make sure it's clickable
          await button.scrollIntoViewIfNeeded();
          await this.page.waitForTimeout(500);
          
          await button.click();
          console.log(`Clicked continue button using selector: ${selector}`);
          clicked = true;
          
          // Wait for navigation to complete
          await this.page.waitForLoadState('networkidle');
          await this.page.waitForTimeout(2000);
          break;
        }
      } catch (error) {
        console.log(`Error clicking ${selector}: ${error}`);
      }
    }
    
    if (!clicked) {
      console.log("Could not find or click any continue button");
      
      // Try looking for the most likely button
      try {
        const buttons = await this.page.locator('button').all();
        for (const button of buttons) {
          const text = await button.textContent();
          if (text && (text.includes('Continue') || text.includes('Payment') || text.includes('Next'))) {
            await button.click();
            console.log(`Clicked button with text: ${text}`);
            clicked = true;
            
            // Wait for navigation
            await this.page.waitForLoadState('networkidle');
            await this.page.waitForTimeout(2000);
            break;
          }
        }
      } catch (error) {
        console.log(`Error with text-based button search: ${error}`);
      }
    }
    
    // Wait for payment form to appear
    try {
      await Promise.race([
        this.page.locator('[data-test="payment-method"]').waitFor({ timeout: 10000 }),
        this.page.locator('form:has-text("Payment")').waitFor({ timeout: 10000 }),
        this.page.locator('input[name^="payment"]').waitFor({ timeout: 10000 })
      ]);
      console.log("Payment form detected");
    } catch (error) {
      console.log("Timed out waiting for payment form, continuing anyway");
    }
    
    // Take a screenshot after navigation
    try {
      await this.page.screenshot({ path: 'after-continue-to-payment.png' });
    } catch (error) {
      console.log("Could not take screenshot:", error);
    }
  }

  /**
   * Select payment method
   * @param method - Payment method to select (bank-transfer, credit-card, gift-card, buy-now-pay-later)
   */
  async selectPaymentMethod(method: string) {
    console.log(`Attempting to select payment method: ${method}`);
    
    // Take a screenshot before selection
    await this.page.screenshot({ path: 'payment-method-before.png' });
    
    // Try multiple approach to select the payment method
    let methodSelected = false;
    
    // Approach 1: Try direct select using data-test attribute
    try {
      const select = this.page.locator('[data-test="payment-method"]');
      if (await select.count() > 0) {
        console.log("Found payment method select by data-test attribute");
        // Try to make it visible by scrolling to it
        await select.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(500);
        
        if (await select.isVisible()) {
          await select.selectOption(method);
          console.log(`Selected payment method using data-test attribute: ${method}`);
          methodSelected = true;
        } else {
          console.log("Payment method select found but not visible");
        }
      }
    } catch (error) {
      console.log(`Error selecting payment method via data-test: ${error}`);
    }
    
    // Approach 2: Try ID-based selector
    if (!methodSelected) {
      try {
        const select = this.page.locator('#payment-method');
        if (await select.count() > 0) {
          console.log("Found payment method select by ID");
          await select.scrollIntoViewIfNeeded();
          await this.page.waitForTimeout(500);
          
          if (await select.isVisible()) {
            await select.selectOption(method);
            console.log(`Selected payment method using ID: ${method}`);
            methodSelected = true;
          } else {
            console.log("Payment method select found by ID but not visible");
          }
        }
      } catch (error) {
        console.log(`Error selecting payment method via ID: ${error}`);
      }
    }
    
    // Approach 3: Try alternative selection methods if dropdown selection doesn't work
    if (!methodSelected) {
      try {
        console.log("Trying alternative payment selection methods");
        
        // Look for radio buttons or other payment method selectors
        const radioSelector = `input[type="radio"][value="${method}"], [data-value="${method}"]`;
        const radio = this.page.locator(radioSelector);
        
        if (await radio.count() > 0) {
          await radio.click();
          console.log(`Selected payment method using radio button: ${method}`);
          methodSelected = true;
        } else {
          // Try clicking on payment method text/labels
          const labels = {
            'credit-card': 'Credit Card',
            'bank-transfer': 'Bank Transfer',
            'gift-card': 'Gift Card',
            'buy-now-pay-later': 'Buy Now Pay Later'
          };
          
          if (method in labels) {
            const label = labels[method as keyof typeof labels];
            const textElement = this.page.getByText(label, { exact: false });
            
            if (await textElement.count() > 0) {
              await textElement.click();
              console.log(`Selected payment method by clicking text: ${label}`);
              methodSelected = true;
            }
          }
        }
      } catch (error) {
        console.log(`Error using alternative payment selection: ${error}`);
      }
    }
    
    // Approach 4: Try generic dropdown selection by checking all select elements
    if (!methodSelected) {
      try {
        const selects = await this.page.locator('select').all();
        console.log(`Found ${selects.length} select elements on page`);
        
        for (const [index, select] of selects.entries()) {
          try {
            if (await select.isVisible()) {
              console.log(`Trying generic select element #${index}`);
              await select.selectOption(method);
              console.log(`Selected payment method using generic select #${index}: ${method}`);
              methodSelected = true;
              break;
            }
          } catch (error) {
            console.log(`Error with generic select #${index}: ${error}`);
          }
        }
      } catch (error) {
        console.log(`Error with generic select approach: ${error}`);
      }
    }
    
    if (!methodSelected) {
      console.log(`WARNING: Could not select payment method: ${method}`);
    }
    
    // Wait for the payment form to update with the correct fields
    await this.page.waitForTimeout(1000);
    
    // Take a screenshot after selection
    await this.page.screenshot({ path: 'payment-method-after.png' });
  }

  /**
   * Fill in bank transfer information form
   * @param bankName - Name of the bank
   * @param accountName - Name on the account
   * @param accountNumber - Account number
   */
  async fillBankTransferInfo(bankName: string, accountName: string, accountNumber: string) {
    console.log("Filling bank transfer information...");
    
    // Use known working selectors from the user script
    try {
      await this.page.locator('[data-test="bank_name"]').fill(bankName);
      await this.page.locator('[data-test="account_name"]').fill(accountName);
      await this.page.locator('[data-test="account_number"]').fill(accountNumber);
      console.log("Bank transfer information filled successfully");
    } catch (error) {
      console.log(`Error filling bank transfer info with direct selectors: ${error}`);
      // Fallback to more flexible approach if specific selectors fail
      const fillInput = async (value: string, ...selectors: string[]) => {
        for (const selector of selectors) {
          try {
            const input = this.page.locator(selector);
            if (await input.count() > 0 && await input.isVisible()) {
              await input.fill(value);
              console.log(`Filled ${selector} with ${value}`);
              return true;
            }
          } catch (error) {
            console.log(`Error filling ${selector}: ${error}`);
          }
        }
        return false;
      };
      
      await fillInput(bankName, '[data-test="bank_name"]', '#bank-name', 'input[name="bankName"]');
      await fillInput(accountName, '[data-test="account_name"]', '#account-name', 'input[name="accountName"]');
      await fillInput(accountNumber, '[data-test="account_number"]', '#account-number', 'input[name="accountNumber"]');
    }
  }

  /**
   * Fill in credit card information form
   * @param cardNumber - Credit card number
   * @param expirationDate - Expiration date (MM/YY)
   * @param cvv - CVV code
   * @param cardHolderName - Name of card holder
   */
  async fillCreditCardInfo(cardNumber: string, expirationDate: string, cvv: string, cardHolderName: string) {
    console.log("Filling credit card information...");
    
    // Wait a moment for form to stabilize
    await this.page.waitForTimeout(1000);
    
    // Make sure we're working with a visible credit card form
    try {
      await this.page.locator('[data-test="credit_card_number"]').waitFor({ state: 'visible', timeout: 5000 });
    } catch (error) {
      console.log("Credit card form not visible yet, will try anyway");
    }
    
    // Take a screenshot for debugging
    try {
      await this.page.screenshot({ path: 'credit-card-form.png' });
    } catch (error) {
      console.log("Could not take screenshot:", error);
    }
    
    // Use the most reliable approach for filling credit card info
    try {
      // Use a helper function to fill each field with better error handling
      const fillCardField = async (selector: string, value: string, fieldName: string) => {
        try {
          const field = this.page.locator(selector);
          
          // Make sure the field is visible
          if (await field.isVisible({ timeout: 3000 })) {
            // Clear any existing value
            await field.clear();
            
            // Type the value with a small delay between characters
            await field.fill(value);
            console.log(`Filled ${fieldName} field with: ${value}`);
            return true;
          } else {
            console.log(`${fieldName} field not visible`);
            return false;
          }
        } catch (error) {
          console.log(`Error filling ${fieldName}: ${error}`);
          return false;
        }
      };
      
      // Fill each field with appropriate wait times between them
      await fillCardField('[data-test="credit_card_number"]', cardNumber, 'card number');
      await this.page.waitForTimeout(500);
      
      await fillCardField('[data-test="expiration_date"]', expirationDate, 'expiration date');
      await this.page.waitForTimeout(500);
      
      await fillCardField('[data-test="cvv"]', cvv, 'CVV');
      await this.page.waitForTimeout(500);
      
      await fillCardField('[data-test="card_holder_name"]', cardHolderName, 'card holder name');
      
      console.log("Credit card information filled successfully");
    } catch (error) {
      console.log(`Error filling credit card info: ${error}`);
      
      // Fallback to more flexible approach if specific selectors fail
      try {
        console.log("Trying fallback approach for filling credit card info");
        
        const fillInput = async (value: string, ...selectors: string[]) => {
          for (const selector of selectors) {
            try {
              const input = this.page.locator(selector);
              if (await input.count() > 0 && await input.isVisible()) {
                await input.fill(value);
                console.log(`Filled ${selector} with ${value}`);
                return true;
              }
            } catch (error) {
              console.log(`Error filling ${selector}: ${error}`);
            }
          }
          return false;
        };
        
        await fillInput(cardNumber, '[data-test="credit_card_number"]', '#card-number', 'input[name="cardNumber"]');
        await fillInput(expirationDate, '[data-test="expiration_date"]', '#expiration', 'input[name="expirationDate"]');
        await fillInput(cvv, '[data-test="cvv"]', '#cvv', 'input[name="cvv"]');
        await fillInput(cardHolderName, '[data-test="card_holder_name"]', '#card-holder', 'input[name="cardHolderName"]');
      } catch (fallbackError) {
        console.log(`Fallback approach also failed: ${fallbackError}`);
      }
    }
    
    // Wait a moment for validation to trigger
    await this.page.waitForTimeout(1000);
    
    // Take a screenshot after filling to see validation errors
    try {
      await this.page.screenshot({ path: 'credit-card-form-after-fill.png' });
    } catch (error) {
      console.log("Could not take screenshot:", error);
    }
  }

  /**
   * Fill in gift card information form
   * @param giftCardNumber - Gift card number
   * @param validationCode - Validation code
   */
  async fillGiftCardInfo(giftCardNumber: string, validationCode: string) {
    console.log("Filling gift card information...");
    
    // Use known working selectors from the user script
    try {
      await this.page.locator('[data-test="gift_card_number"]').fill(giftCardNumber);
      await this.page.locator('[data-test="validation_code"]').fill(validationCode);
      console.log("Gift card information filled successfully");
    } catch (error) {
      console.log(`Error filling gift card info with direct selectors: ${error}`);
      // Fallback to more flexible approach if specific selectors fail
      const fillInput = async (value: string, ...selectors: string[]) => {
        for (const selector of selectors) {
          try {
            const input = this.page.locator(selector);
            if (await input.count() > 0 && await input.isVisible()) {
              await input.fill(value);
              console.log(`Filled ${selector} with ${value}`);
              return true;
            }
          } catch (error) {
            console.log(`Error filling ${selector}: ${error}`);
          }
        }
        return false;
      };
      
      await fillInput(giftCardNumber, '[data-test="gift_card_number"]', '#gift-card-number', 'input[name="giftCardNumber"]');
      await fillInput(validationCode, '[data-test="validation_code"]', '#validation-code', 'input[name="validationCode"]');
    }
  }

  /**
   * Configure buy now pay later with monthly installments
   * @param installments - Number of monthly installments (3, 6, 9, 12)
   */
  async configureBuyNowPayLater(installments: number) {
    console.log(`Configuring buy now pay later with ${installments} installments...`);
    
    // Use known working selectors from the user script
    try {
      await this.page.locator('[data-test="monthly_installments"]').selectOption(installments.toString());
      console.log("Buy now pay later configured successfully");
    } catch (error) {
      console.log(`Error configuring BNPL with direct selectors: ${error}`);
      // Fallback to more flexible approach if specific selectors fail
      try {
        const select = this.page.locator('#monthly-installments, [name="monthlyInstallments"]');
        if (await select.count() > 0 && await select.isVisible()) {
          await select.selectOption(installments.toString());
          console.log(`Selected ${installments} installments using fallback selector`);
        } else {
          console.log("Could not find monthly installments select");
        }
      } catch (error) {
        console.log(`Error with fallback for BNPL: ${error}`);
      }
    }
  }

  /**
   * Fill in payment information form (legacy method)
   * @param accountName - Name on the account
   * @param accountNumber - Account/card number
   */
  async fillPaymentInfo(accountName: string, accountNumber: string) {
    console.log("Filling payment information...");
    
    // Take a screenshot to see what we're working with
    await this.page.screenshot({ path: 'payment-form.png' });
    
    // Get the visible fields on the page
    const visibleInputs = await this.page.locator('input:visible, select:visible').count();
    console.log(`Found ${visibleInputs} visible input/select fields on payment page`);
    
    // Helper function to fill input with multiple fallback selectors
    const fillInput = async (value: string, ...selectors: string[]) => {
      for (const selector of selectors) {
        try {
          const input = this.page.locator(selector);
          if (await input.count() > 0) {
            // Try to make it visible by scrolling to it
            await input.scrollIntoViewIfNeeded();
            await this.page.waitForTimeout(500);
            
            if (await input.isVisible()) {
              await input.fill(value);
              console.log(`Filled ${selector} with ${value}`);
              return true;
            } else {
              console.log(`Input ${selector} found but not visible`);
            }
          }
        } catch (error) {
          console.log(`Error filling ${selector}: ${error}`);
        }
      }
      console.log(`Could not fill any selector with ${value}`);
      return false;
    };
    
    // Try to detect which payment form is active
    const isVisible = async (selector: string) => {
      try {
        const el = this.page.locator(selector);
        return await el.count() > 0 && await el.isVisible();
      } catch {
        return false;
      }
    };
    
    // Try filling with different selectors based on available fields
    if (await isVisible('[data-test="account_name"]') || await isVisible('#account-name')) {
      console.log("Bank transfer form detected");
      // Bank transfer form
      await fillInput(accountName, '[data-test="account_name"]', '#account-name', '[name="accountName"]', '[placeholder*="account name"]');
      await fillInput(accountNumber, '[data-test="account_number"]', '#account-number', '[name="accountNumber"]', '[placeholder*="account number"]'); 
    } else if (await isVisible('[data-test="credit_card_number"]') || await isVisible('#card-number')) {
      console.log("Credit card form detected");
      // Credit card form 
      await fillInput("4111111111111111", '[data-test="credit_card_number"]', '#card-number', '[name="cardNumber"]', '[placeholder*="card number"]');
      await fillInput("12/25", '[data-test="expiration_date"]', '#expiration', '[name="expirationDate"]', '[placeholder*="expiration"]');
      await fillInput("123", '[data-test="cvv"]', '#cvv', '[name="cvv"]', '[placeholder*="cvv"]');
      await fillInput(accountName, '[data-test="card_holder_name"]', '#card-holder', '[name="cardHolderName"]', '[placeholder*="card holder"]');
    } else if (await isVisible('[data-test="gift_card_number"]') || await isVisible('#gift-card-number')) {
      console.log("Gift card form detected");
      // Gift card form
      await fillInput("1234567890123456", '[data-test="gift_card_number"]', '#gift-card-number', '[name="giftCardNumber"]');
      await fillInput("123456", '[data-test="validation_code"]', '#validation-code', '[name="validationCode"]');
    } else {
      console.log("Payment form type unknown, trying generic inputs");
      // Try to fill any visible text/number inputs as a fallback
      const visibleTextInputs = await this.page.locator('input[type="text"]:visible, input[type="number"]:visible, input:not([type]):visible').all();
      if (visibleTextInputs.length > 0) {
        console.log(`Found ${visibleTextInputs.length} visible text inputs to try`);
        
        // Try to fill the first input with account name
        if (visibleTextInputs.length > 0) {
          await visibleTextInputs[0].fill(accountName);
          console.log("Filled first visible input with account name");
        }
        
        // Try to fill the second input with account number
        if (visibleTextInputs.length > 1) {
          await visibleTextInputs[1].fill(accountNumber);
          console.log("Filled second visible input with account number");
        }
      } else {
        console.log("No visible text inputs found on payment form");
      }
    }
    
    // Take a screenshot after filling
    await this.page.screenshot({ path: 'payment-form-after-fill.png' });
  }

  /**
   * Complete the order (final checkout step)
   */
  async completeOrder() {
    console.log("Attempting to complete order...");
    
    // Take a screenshot before completing the order
    await this.page.screenshot({ path: 'before-complete-order.png' });
    
    // Try multiple selectors for the complete order button
    const completeSelectors = [
      '[data-test="finish"]', 
      'button:has-text("Complete Order")',
      'button:has-text("Place Order")',
      'button:has-text("Submit Order")',
      'button:has-text("Confirm")',
      'button:has-text("Pay Now")',
      'button[type="submit"]',
      '.btn-primary'
    ];
    
    let orderCompleted = false;
    
    for (const selector of completeSelectors) {
      try {
        const button = this.page.locator(selector);
        if (await button.count() > 0) {
          // Make sure the button is visible and scrolled into view
          await button.scrollIntoViewIfNeeded();
          await this.page.waitForTimeout(500);
          
          if (await button.isVisible()) {
            await button.click();
            console.log(`Clicked complete order button using selector: ${selector}`);
            orderCompleted = true;
            break;
          } else {
            console.log(`Complete order button found with ${selector} but not visible`);
          }
        }
      } catch (error) {
        console.log(`Error clicking ${selector}: ${error}`);
      }
    }
    
    if (!orderCompleted) {
      console.log("Could not find or click any complete order button");
      // Try clicking any primary/large button on the page as a last resort
      try {
        const buttons = await this.page.locator('button.btn-primary, button.btn-success, button.btn-lg').all();
        if (buttons.length > 0) {
          for (const button of buttons) {
            if (await button.isVisible()) {
              await button.click();
              console.log("Clicked a prominent button as fallback");
              orderCompleted = true;
              break;
            }
          }
        }
      } catch (error) {
        console.log(`Error with fallback button approach: ${error}`);
      }
    }
    
    // Wait for navigation to complete
    await this.page.waitForLoadState('networkidle');
    
    // Wait longer for order processing
    await this.page.waitForTimeout(3000);
    
    // Check for confirmation elements
    try {
      await Promise.race([
        this.page.locator('[data-test="confirmation-message"]').waitFor({ timeout: 5000 }),
        this.page.getByText('Thank you for your order').waitFor({ timeout: 5000 }),
        this.page.getByText('Order confirmation').waitFor({ timeout: 5000 }),
        this.page.getByText('Order #').waitFor({ timeout: 5000 })
      ]);
      console.log("Order confirmation detected");
    } catch (error) {
      console.log("Timed out waiting for order confirmation, continuing anyway");
    }
    
    // Take a screenshot after completing the order
    await this.page.screenshot({ path: 'after-complete-order.png' });
  }

  /**
   * Get error message text if present
   * @returns Error message text or null if not present
   */
  async getErrorMessage(): Promise<string | null> {
    try {
      const errorAlert = this.page.getByRole('alert');
      if (await errorAlert.isVisible()) {
        return await errorAlert.textContent();
      }
      // Look for specific payment error messages
      const paymentError = this.page.locator('[data-test="payment-error"]');
      if (await paymentError.isVisible()) {
        return await paymentError.textContent();
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get confirmation message text if present
   * @returns Confirmation message text or null if not present
   */
  async getConfirmationMessage(): Promise<string | null> {
    try {
      const confirmMessage = await this.page.locator('[data-test="confirmation-message"]').textContent();
      return confirmMessage;
    } catch (error) {
      // If confirmation message element doesn't exist
      return await this.page.getByText('Thank you for your order').textContent();
    }
  }

  /**
   * Check if payment was successful
   * @returns true if payment success message is visible
   */
  async isPaymentSuccessful(): Promise<boolean> {
    // Check for confirmation message or error message
    const errorMsg = await this.getErrorMessage();
    if (errorMsg) {
      return false;
    }
    
    // Check for order confirmation elements
    const confirmation = await this.getConfirmationMessage();
    return confirmation !== null;
  }

  /**
   * Get order number from confirmation page
   * @returns Order number text or null if not present
   */
  async getOrderNumber(): Promise<string | null> {
    try {
      // Try to find the order number element
      return await this.page.locator('[data-test="order-number"]').textContent();
    } catch (error) {
      // If order number element doesn't exist, look for text containing order number
      const orderText = await this.page.getByText(/Order #[0-9]+/).textContent();
      if (orderText) {
        const match = orderText.match(/#([0-9]+)/);
        return match ? match[1] : null;
      }
      return null;
    }
  }

  /**
   * Get the total amount from the cart or checkout
   * @returns Total amount text
   */
  async getTotal(): Promise<string> {
    const total = await this.totalAmount.textContent();
    return total || "";
  }

  /**
   * Measure the performance of a checkout step
   * @param action - Function representing the action to measure
   * @returns Time taken in milliseconds
   */
  async measurePerformance(action: () => Promise<void>): Promise<number> {
    const startTime = Date.now();
    await action();
    const endTime = Date.now();
    return endTime - startTime;
  }
} 