import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import { ProductBrowsingPage } from '../../pages/productBrowsingPage';
import { products } from '../../fixtures/productFixture';
import { users } from '../../fixtures/loginFixture';

test.describe('Product Browsing', () => {
  let productPage: ProductBrowsingPage;

  test.beforeEach(async ({ page }) => {
    productPage = new ProductBrowsingPage(page);
    await productPage.goto();
  });

  test('should display products on the homepage', async ({ page }) => {
    // Verify multiple products are displayed
    const productCount = await productPage.getProductCount();
    expect(productCount).toBeGreaterThan(0);
    
    // Verify product names and prices are visible
    const productNames = await productPage.getProductNames();
    expect(productNames.length).toBeGreaterThan(0);
    
    const productPrices = await productPage.getProductPrices();
    expect(productPrices.length).toBeGreaterThan(0);
  });

  test('should sort products by different criteria', async ({ page }) => {
    // Test price sorting (low to high)
    await productPage.sortBy('price-asc');
    const pricesLowToHigh = await productPage.getProductPrices();
    
    // Extract numeric prices for comparison
    const numericPricesLowToHigh = pricesLowToHigh.map(price => 
      parseFloat(price.replace('$', ''))
    );
    
    // Verify prices are in ascending order (or at least non-decreasing)
    for (let i = 0; i < numericPricesLowToHigh.length - 1; i++) {
      expect(numericPricesLowToHigh[i]).toBeLessThanOrEqual(numericPricesLowToHigh[i + 1]);
    }
    
    // Test name sorting (A to Z)
    await productPage.sortBy('name-asc');
    const namesAtoZ = await productPage.getProductNames();
    
    // Verify names are in alphabetical order
    const sortedNamesAtoZ = [...namesAtoZ].sort();
    expect(namesAtoZ.join()).toEqual(sortedNamesAtoZ.join());
  });

  test('should filter products by category', async ({ page }) => {
    // Count initial products
    const initialCount = await productPage.getProductCount();
    
    // Apply a category filter - choose Pliers since we know there are multiple
    await productPage.filterByCategory('Pliers');
    
    // Wait for page to update
    await page.waitForTimeout(500);
    
    // Get filtered products
    const filteredCount = await productPage.getProductCount();
    const filteredNames = await productPage.getProductNames();
    
    // Expect at least one product, but fewer than the total
    expect(filteredCount).toBeGreaterThan(0);
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
    
    // Verify filtered products contain the word "Pliers"
    for (const name of filteredNames) {
      expect(name.toLowerCase()).toContain('pliers');
    }
  });

  test('should be able to search for products', async ({ page }) => {
    // Search for a specific product type
    await productPage.search('hammer');
    
    // Get search results
    const searchResultNames = await productPage.getProductNames();
    
    // There should be results and they should all contain "hammer"
    expect(searchResultNames.length).toBeGreaterThan(0);
    for (const name of searchResultNames) {
      expect(name.toLowerCase()).toContain('hammer');
    }
  });

  test('should be able to add products to cart', async ({ page }) => {
    // Get available products
    const productNames = await productPage.getProductNames();
    
    // Ensure we have a product to add to cart
    expect(productNames.length).toBeGreaterThan(0);
    
    // Add the first product to cart
    const productToAdd = productNames[0];
    await productPage.addProductToCart(productToAdd);
    
    // Verify cart badge updates
    await page.waitForTimeout(500); // Wait for cart to update
    const cartCount = await productPage.getCartCount();
    expect(cartCount).toBe(1);
  });
}); 