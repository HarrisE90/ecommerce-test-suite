import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for the product browsing functionality
 * Handles interactions with the product listing page
 * including filtering, searching, and product selection
 */
export class ProductBrowsingPage {
  private page: Page;
  
  // Navigation elements
  private homeLink: Locator;
  private cartLink: Locator;
  
  // Product listing elements
  private productGrid: Locator;
  private productCards: Locator;
  private productTitle: Locator;
  private productPrice: Locator;
  
  // Filtering elements
  private categoryMenu: Locator;
  private brandMenu: Locator;
  private priceRangeFilter: Locator;
  
  // Search elements
  private searchInput: Locator;
  private searchButton: Locator;
  private sortDropdown: Locator;
  
  // Product details elements
  private productDetailTitle: Locator;
  private productDetailPrice: Locator;
  private productDetailDescription: Locator;
  private quantityInput: Locator;
  private increaseQuantityButton: Locator;
  private decreaseQuantityButton: Locator;
  private addToCartButton: Locator;

  // Alert and notifications
  private addedToCartAlert: Locator;

  /**
   * Initialize the ProductBrowsingPage with locators for key elements
   * @param page - Playwright page object
   */
  constructor(page: Page) {
    this.page = page;
    
    // Navigation elements
    this.homeLink = page.locator('[data-test="nav-home"]');
    this.cartLink = page.locator('[data-test="nav-cart"]');
    
    // Product listing elements
    this.productGrid = page.locator('.category-products');
    this.productCards = page.locator('.card');
    this.productTitle = page.locator('.card-title');
    this.productPrice = page.locator('[data-test="product-price"]');
    
    // Filtering elements
    this.categoryMenu = page.locator('.category-menu');
    this.brandMenu = page.locator('.brand-menu');
    this.priceRangeFilter = page.locator('#price-range');
    
    // Search elements
    this.searchInput = page.locator('[data-test="search-query"]');
    this.searchButton = page.locator('[data-test="search-submit"]');
    this.sortDropdown = page.locator('[data-test="sort"]');
    
    // Product details elements
    this.productDetailTitle = page.locator('.product-title');
    this.productDetailPrice = page.locator('.product-price');
    this.productDetailDescription = page.locator('.product-description');
    this.quantityInput = page.locator('[data-test="quantity"]');
    this.increaseQuantityButton = page.locator('[data-test="increase-quantity"]');
    this.decreaseQuantityButton = page.locator('[data-test="decrease-quantity"]');
    this.addToCartButton = page.locator('[data-test="add-to-cart"]');
    
    // Alert and notifications
    this.addedToCartAlert = page.getByRole('alert');
  }

  /**
   * Navigate to the product listing page
   */
  async goto() {
    await this.page.goto('https://practicesoftwaretesting.com/');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Search for products by keyword
   * @param keyword - Search term
   */
  async search(keyword: string) {
    await this.searchInput.fill(keyword);
    await this.searchButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Search for products by keyword (alias of search method for backward compatibility)
   * @param keyword - Search term
   */
  async searchProducts(keyword: string) {
    return this.search(keyword);
  }

  /**
   * Filter products by category
   * @param category - Category name or ID
   */
  async filterByCategory(category: string) {
    try {
      // Try first approach - select category checkbox directly
      const categoryCheckbox = this.page.locator(`[data-test="category-${category}"]`);
      if (await categoryCheckbox.count() > 0) {
        await categoryCheckbox.check();
        await this.page.waitForLoadState('networkidle');
        return;
      }
      
      // Second approach - find category by text
      const formCheckLabel = this.page.locator('.form-check-label', { hasText: category }).first();
      if (await formCheckLabel.count() > 0) {
        await formCheckLabel.click();
        await this.page.waitForLoadState('networkidle');
        return;
      }
      
      // Third approach - generic category link
      const categoryItem = this.page.locator(`:text("${category}")`).first();
      if (await categoryItem.count() > 0) {
        await categoryItem.click();
        await this.page.waitForLoadState('networkidle');
      }
    } catch (error) {
      console.log(`Error filtering by category ${category}: ${error}`);
    }
  }

  /**
   * Filter products by brand
   * @param brand - Brand name
   */
  async filterByBrand(brand: string) {
    const brandItem = this.brandMenu.locator('li').filter({ hasText: brand });
    await brandItem.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Sort the product listing
   * @param sortOption - Sort option (e.g., 'price-asc', 'price-desc', 'name-asc', 'name-desc')
   */
  async sortBy(sortOption: string) {
    const optionMap: Record<string, string> = {
      'price-asc': 'price,asc',
      'price-desc': 'price,desc', 
      'name-asc': 'name,asc',
      'name-desc': 'name,desc'
    };
    
    const actualOption = optionMap[sortOption] || sortOption;
    await this.sortDropdown.selectOption(actualOption);
    await this.page.waitForTimeout(500);
  }

  /**
   * Sort products (alias of sortBy method for backward compatibility)
   * @param sortOption - Sort option
   */
  async sortProductsBy(sortOption: string) {
    return this.sortBy(sortOption);
  }

  /**
   * Get all product names from the current listing
   * @returns Array of product names
   */
  async getProductNames(): Promise<string[]> {
    try {
      const products = await this.page.locator('[data-test^="product-"] [data-test="product-name"]').all();
    const names: string[] = [];
    
      for (const product of products) {
        const text = await product.textContent();
        if (text !== null) {
          names.push(text);
        }
      }
      
      // If names array is empty, try alternative selectors
      if (names.length === 0) {
        const count = await this.productTitle.count();
    for (let i = 0; i < count; i++) {
          const text = await this.productTitle.nth(i).textContent();
          if (text) {
            names.push(text.trim());
          }
        }
    }
    
    return names;
    } catch (error) {
      console.log(`Error getting product names: ${error}`);
      return [];
    }
  }

  /**
   * Get all product prices from the current listing
   * @returns Array of product prices
   */
  async getProductPrices(): Promise<string[]> {
    try {
      const prices = await this.productPrice.allTextContents();
      return prices.map(price => price.trim());
    } catch (error) {
      console.log(`Error getting product prices: ${error}`);
      return [];
    }
  }

  /**
   * Get the count of products displayed on the page
   * @returns Number of products
   */
  async getProductCount(): Promise<number> {
    try {
      return await this.page.locator('[data-test^="product-"]').count();
    } catch (error) {
      console.log(`Error getting product count: ${error}`);
      return 0;
    }
  }

  /**
   * Navigate to a specific product's detail page by name
   * @param productName - Name of the product to view
   */
  async viewProductDetailsByName(productName: string) {
    await this.productTitle.filter({ hasText: productName }).first().click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get the current product's details
   * @returns Object containing product details
   */
  async getProductDetails() {
    const title = await this.productDetailTitle.textContent() || '';
    const price = await this.productDetailPrice.textContent() || '';
    const description = await this.productDetailDescription.textContent() || '';
    
    return {
      title: title.trim(),
      price: price.trim(),
      description: description.trim()
    };
  }

  /**
   * Set the quantity for the current product
   * @param quantity - Quantity to set
   */
  async setQuantity(quantity: number) {
    await this.quantityInput.fill(quantity.toString());
  }

  /**
   * Increase the quantity for the current product
   * @param times - Number of times to increase
   */
  async increaseQuantity(times: number = 1) {
    for (let i = 0; i < times; i++) {
      await this.increaseQuantityButton.click();
    }
  }

  /**
   * Decrease the quantity for the current product
   * @param times - Number of times to decrease
   */
  async decreaseQuantity(times: number = 1) {
    for (let i = 0; i < times; i++) {
      await this.decreaseQuantityButton.click();
    }
  }

  /**
   * Add a product to the cart by its name or data-test attribute
   * @param productId - Product name or data-test ID
   */
  async addProductToCart(productId: string) {
    try {
      // If we have a specific product ID, use it directly
      if (productId.startsWith('01')) {
        await this.page.locator(`[data-test="product-${productId}"]`).click();
      } else {
        // Otherwise find a product with matching title
        await this.page.locator('.card-title', { hasText: productId }).click();
      }
      
      // Wait for navigation and click add to cart
      await this.page.waitForLoadState('networkidle');
      await this.page.locator('[data-test="add-to-cart"]').click();
      
      // Wait for success message
      try {
        await this.page.waitForSelector('[role="alert"]', { timeout: 3000 });
      } catch (e) {
        // Continue if alert doesn't appear
      }
      
      // Return to home page
      await this.page.locator('[data-test="nav-home"]').click();
      await this.page.waitForLoadState('networkidle');
    } catch (error) {
      console.log(`Error adding product to cart: ${error}`);
    }
  }

  /**
   * Check if a product was added to cart
   * @returns true if the added to cart alert is visible
   */
  async isProductAddedToCart(): Promise<boolean> {
    try {
      // Use the same specific selector as in addProductToCart
      await this.page.getByRole('alert', { name: /Product added to shopping/ }).waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Navigate to the cart page
   */
  async goToCart() {
    await this.cartLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get the current count of items in the cart
   * @returns Number of items in cart
   */
  async getCartCount(): Promise<number> {
    try {
      // First make sure we're on a page where the cart is visible
      if (!await this.page.locator('[data-test="nav-cart"]').isVisible()) {
        await this.page.locator('[data-test="nav-home"]').click();
        await this.page.waitForLoadState('networkidle');
      }
      
      // Check for cart count badge first
      const badge = this.page.locator('[data-test="nav-cart"] .badge');
      if (await badge.isVisible()) {
        const text = await badge.textContent() || '0';
        return parseInt(text);
      }
      
      // If no badge visible, check cart page
      await this.page.locator('[data-test="nav-cart"]').click();
      await this.page.waitForLoadState('networkidle');
      
      const cartItems = this.page.locator('table tbody tr');
      const itemCount = await cartItems.count();
      
      // Return to home page
      await this.page.locator('[data-test="nav-home"]').click();
      await this.page.waitForLoadState('networkidle');
      
      return itemCount;
    } catch (error) {
      console.log(`Error getting cart count: ${error}`);
      return 0;
    }
  }

  /**
   * View detailed product page by product ID
   * @param productId - ID of the product to view
   */
  async viewProductDetails(productId: string) {
    await this.page.locator(`[data-test="product-${productId}"]`).click();
    await this.page.waitForLoadState('networkidle');
  }
} 