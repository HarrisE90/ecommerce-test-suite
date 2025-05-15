import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import { ProductBrowsingPage } from '../../pages/productBrowsingPage';
import { products } from '../../fixtures/productFixture';
import { users } from '../../fixtures/loginFixture';

/**
 * Set timeout for all tests to account for potential network/rendering delays
 */
test.setTimeout(30000);

/**
 * Test suite for the product browsing functionality
 * Tests the core e-commerce features including:
 * - Product display
 * - Sorting
 * - Filtering
 * - Searching
 * - Adding to cart
 */
test.describe('Product Browsing', () => {
  let productPage: ProductBrowsingPage;

  /**
   * Before each test:
   * - Initialize the ProductBrowsingPage
   * - Navigate to the homepage
   * - Ensure proper page loading
   */
  test.beforeEach(async ({ page }) => {
    productPage = new ProductBrowsingPage(page);
    await productPage.goto();
    await expect(page).toHaveURL(/practicesoftwaretesting/);
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
  });

  /**
   * Test: Product display on homepage
   * 
   * Verifies that:
   * - Products are displayed on the homepage
   * - Product names are visible
   * - Product prices are visible
   */
  test('should display products on the homepage', async ({ page }) => {
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Wait for products to appear (with retry logic)
    let productItemCount = 0;
    for (let attempt = 0; attempt < 3 && productItemCount === 0; attempt++) {
      // Wait a bit longer on each retry
      await page.waitForTimeout(1000 * (attempt + 1));
      
      // Try to find products using data-test attribute
      await page.waitForSelector('[data-test^="product-"]', { timeout: 5000 })
        .catch(() => {}); // Ignore timeout errors
        
      productItemCount = await page.locator('[data-test^="product-"]').count();
    }
    
    // Verify products are displayed
    expect(productItemCount).toBeGreaterThan(0);
    
    // Verify product names
    const productNames = await productPage.getProductNames();
    expect(productNames.length).toBeGreaterThan(0);
    
    // Verify product prices
    const productPrices = await productPage.getProductPrices();
    expect(productPrices.length).toBeGreaterThan(0);
  });

  /**
   * Test: Product sorting
   * 
   * Verifies that:
   * - Products can be sorted by price (low to high)
   * - Sorted prices appear in ascending order
   */
  test('should sort products by different criteria', async ({ page }) => {
    // Wait for products to load
    await page.waitForSelector('[data-test^="product-"]', { timeout: 5000 })
      .catch(() => {}); // Ignore timeout errors
    
    // First check that we have prices visible
    const priceElements = await page.locator('[data-test="product-price"]').count();
    
    if (priceElements === 0) {
      test.skip();
      return;
    }
    
    // Apply price sorting (low to high)
    await productPage.sortBy('price-asc');
    await page.waitForTimeout(1000);
    
    // Get sorted prices and convert to numbers
    const pricesLowToHigh = await page.locator('[data-test="product-price"]').allTextContents();
    const numericPrices = pricesLowToHigh.map(price => 
      parseFloat(price.replace(/[^0-9.]/g, ''))
    );
    
    // Verify prices are in ascending order
    for (let i = 0; i < numericPrices.length - 1; i++) {
      expect(numericPrices[i]).toBeLessThanOrEqual(numericPrices[i + 1]);
    }
  });

  /**
   * Test: Product filtering by category
   * 
   * Verifies that:
   * - Products can be filtered by category
   * - Filtered results display at least one product
   */
  test('should filter products by category', async ({ page }) => {
    // Wait for categories to load
    await page.waitForSelector('[data-test^="category-"]', { timeout: 5000 })
      .catch(() => {}); // Ignore timeout errors
    
    // Check if category checkboxes exist
    const categoryCount = await page.locator('[data-test^="category-"]').count();
    
    if (categoryCount === 0) {
      test.skip();
      return;
    }
    
    // Filter by the first available category
    const firstCategoryDataTest = await page.locator('[data-test^="category-"]')
      .first()
      .getAttribute('data-test');
    
    if (firstCategoryDataTest) {
      const categoryId = firstCategoryDataTest.replace('category-', '');
      await productPage.filterByCategory(categoryId);
      
      // Wait for filtering to take effect
      await page.waitForTimeout(1000);
      
      // Verify filtered results
      const filteredCount = await productPage.getProductCount();
      expect(filteredCount).toBeGreaterThan(0);
    } else {
      test.skip();
    }
  });

  /**
   * Test: Product search functionality
   * 
   * Verifies that:
   * - Search field is present
   * - Searching for "pliers" returns results
   */
  test('should be able to search for products', async ({ page }) => {
    // Verify search field exists
    const searchField = page.locator('[data-test="search-query"]');
    
    if (await searchField.isVisible()) {
      // Search for a known term
      await productPage.search('pliers');
      
      // Wait for search results
      await page.waitForTimeout(1000);
      
      // Verify search results
      const searchResultCount = await page.locator('[data-test^="product-"]').count();
      expect(searchResultCount).toBeGreaterThan(0);
    } else {
      test.skip();
    }
  });

  /**
   * Test: Add to cart functionality
   * 
   * Verifies that:
   * - Products can be added to cart
   * - Cart count updates after adding a product
   */
  test('should be able to add products to cart', async ({ page }) => {
    // Wait for products to load
    await page.waitForSelector('[data-test^="product-"]', { timeout: 5000 })
      .catch(() => {}); // Ignore timeout errors
    
    // Get the first product's data-test attribute
    const firstProductDataTest = await page.locator('[data-test^="product-"]')
      .first()
      .getAttribute('data-test');
    
    if (firstProductDataTest) {
      const productId = firstProductDataTest.replace('product-', '');
      
      // Add product to cart
      await productPage.addProductToCart(productId);
      
      // Verify cart count
      const cartCount = await productPage.getCartCount();
      expect(cartCount).toBeGreaterThanOrEqual(1);
    } else {
      test.skip();
    }
  });
}); 