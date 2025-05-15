import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for the product browsing functionality
 * Handles interactions with the product listing, searching, filtering, and cart operations
 */
export class ProductBrowsingPage {
  private page: Page;
  private productContainer: Locator;
  private searchInput: Locator;
  private searchButton: Locator;
  private sortDropdown: Locator;
  private filterControls: Locator;
  private productItems: Locator;
  private productTitle: Locator;
  private productPrice: Locator;
  private addToCartButton: Locator;
  private categoryCheckboxes: Locator;
  private priceSlider: Locator;
  private cartBadge: Locator;

  /**
   * Initialize the ProductBrowsingPage with locators for key elements
   * @param page - Playwright page object
   */
  constructor(page: Page) {
    this.page = page;
    // Main elements
    this.productContainer = page.locator('app-overview');
    this.productItems = page.locator('[data-test^="product-"]');
    
    // Product details
    this.productTitle = page.locator('.card-title');
    this.productPrice = page.locator('[data-test="product-price"]');
    
    // Search elements
    this.searchInput = page.locator('[data-test="search-query"]');
    this.searchButton = page.locator('[data-test="search-submit"]');
    
    // Filter and sort elements
    this.sortDropdown = page.locator('[data-test="sort"]');
    this.filterControls = page.locator('.card-body .form-check');
    this.categoryCheckboxes = page.locator('[data-test^="category-"]');
    this.priceSlider = page.locator('input[type="range"]');
    
    // Cart elements
    this.addToCartButton = page.locator('[data-test="add-to-cart"]');
    this.cartBadge = page.locator('[data-test="nav-cart"] .badge');
  }

  /**
   * Navigate to the product browsing page
   */
  async goto() {
    await this.page.goto('https://practicesoftwaretesting.com');
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Search for products using the search functionality
   * @param keyword - The search term to enter
   */
  async search(keyword: string) {
    await this.searchInput.fill(keyword);
    await this.searchButton.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Sort products by a specified criteria
   * @param option - Sorting option (price-asc, price-desc, name-asc, name-desc)
   */
  async sortBy(option: string) {
    const optionMap: Record<string, string> = {
      'price-asc': 'price,asc',
      'price-desc': 'price,desc', 
      'name-asc': 'name,asc',
      'name-desc': 'name,desc'
    };
    
    const actualOption = optionMap[option] || option;
    await this.sortDropdown.selectOption(actualOption);
    await this.page.waitForTimeout(500);
  }
  
  /**
   * Filter products by category
   * @param categoryId - Category ID or text to filter by
   */
  async filterByCategory(categoryId: string) {
    // If we have a full category ID, use it directly
    if (categoryId.startsWith('01')) {
      await this.page.locator(`[data-test="category-${categoryId}"]`).check();
    } else {
      // Otherwise find a category with matching text
      const checkbox = this.page.locator('.form-check-label', { hasText: categoryId })
        .locator('..')
        .locator('input[type="checkbox"]')
        .first();
      
      await checkbox.click();
    }
    await this.page.waitForTimeout(500);
  }

  /**
   * Filter products by price range
   * @param min - Minimum price
   * @param max - Maximum price
   */
  async filterByPriceRange(min: number, max: number) {
    const minSlider = this.page.locator('input[type="range"]').first();
    const maxSlider = this.page.locator('input[type="range"]').last();
    
    await minSlider.fill(min.toString());
    await maxSlider.fill(max.toString());
    await this.page.waitForTimeout(500);
  }

  /**
   * Get the count of products displayed on the page
   * @returns Number of products
   */
  async getProductCount() {
    return await this.productItems.count();
  }

  /**
   * Get the names of all products displayed on the page
   * @returns Array of product names
   */
  async getProductNames() {
    try {
      const count = await this.productTitle.count();
      const names: string[] = [];
      
      for (let i = 0; i < count; i++) {
        names.push(await this.productTitle.nth(i).textContent() || '');
      }
      
      return names;
    } catch (e) {
      return [];
    }
  }

  /**
   * Get the prices of all products displayed on the page
   * @returns Array of product prices as strings
   */
  async getProductPrices() {
    try {
      const prices = await this.productPrice.allTextContents();
      return prices.map(price => price.trim());
    } catch (e) {
      return [];
    }
  }

  /**
   * Add a product to the cart
   * @param productId - Product ID or title to add to cart
   */
  async addProductToCart(productId: string) {
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
  }

  /**
   * Navigate to a product's detail page
   * @param productId - Product ID or title to view
   */
  async clickOnProduct(productId: string) {
    // If we have a specific product ID, use it directly
    if (productId.startsWith('01')) {
      await this.page.locator(`[data-test="product-${productId}"]`).click();
    } else {
      // Otherwise find a product with matching title
      await this.page.locator('.card-title', { hasText: productId }).click();
    }
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Get the current count of items in the cart
   * @returns Number of items in cart
   */
  async getCartCount() {
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
  }
} 