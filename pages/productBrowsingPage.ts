import { Page, Locator, expect } from '@playwright/test';

export class ProductBrowsingPage {
  private page: Page;
  private productGrid: Locator;
  private searchInput: Locator;
  private sortDropdown: Locator;
  private filterControls: Locator;
  private productItems: Locator;
  private productTitle: Locator;
  private productPrice: Locator;
  private addToCartButton: Locator;
  private categoryCheckboxes: Locator;
  private priceSlider: Locator;
  private cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productGrid = page.locator('.products');
    this.searchInput = page.locator('input[name="query"]');
    this.sortDropdown = page.locator('select.form-select');
    this.filterControls = page.locator('.filters');
    this.productItems = page.locator('.card.h-100');
    this.productTitle = page.locator('.card-title');
    this.productPrice = page.locator('.card-text.price');
    this.addToCartButton = page.locator('button.btn-primary');
    this.categoryCheckboxes = page.locator('input[type="checkbox"]');
    this.priceSlider = page.locator('input[type="range"]');
    this.cartBadge = page.locator('.badge.bg-dark');
  }

  async goto() {
    await this.page.goto('https://practicesoftwaretesting.com');
    await expect(this.productGrid).toBeVisible();
  }

  async search(keyword: string) {
    await this.searchInput.fill(keyword);
    // Search button next to the input
    await this.page.locator('button.btn-primary').filter({ hasText: 'Search' }).click();
  }

  async sortBy(option: string) {
    await this.sortDropdown.selectOption(option);
  }
  
  async filterByCategory(category: string) {
    // Find the checkbox with the label matching the category
    await this.page.getByText(category).first().click();
  }

  async filterByPriceRange(min: number, max: number) {
    // Implement price filtering using the sliders
    // This is a simplified implementation
    const minSlider = this.page.locator('input[type="range"]').first();
    const maxSlider = this.page.locator('input[type="range"]').last();
    
    // Set min and max values
    await minSlider.fill(min.toString());
    await maxSlider.fill(max.toString());
  }

  async getProductCount() {
    return await this.productItems.count();
  }

  async getProductNames() {
    const count = await this.productTitle.count();
    const names: string[] = [];
    
    for (let i = 0; i < count; i++) {
      names.push(await this.productTitle.nth(i).textContent() || '');
    }
    
    return names;
  }

  async getProductPrices() {
    const count = await this.productPrice.count();
    const prices: string[] = [];
    
    for (let i = 0; i < count; i++) {
      prices.push(await this.productPrice.nth(i).textContent() || '');
    }
    
    return prices;
  }

  async addProductToCart(productName: string) {
    // Find the product card containing the product name
    const productCard = this.page.locator('.card.h-100')
      .filter({ hasText: productName });
      
    // Click the Add to Cart button within this product card
    await productCard.locator('button.btn-primary').click();
  }

  async clickOnProduct(productName: string) {
    await this.page.locator('.card-title')
      .filter({ hasText: productName })
      .click();
  }

  async getCartCount() {
    const badge = this.cartBadge;
    if (await badge.isVisible()) {
      return parseInt(await badge.textContent() || '0');
    }
    return 0;
  }
} 