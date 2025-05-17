import { APIRequestContext, expect } from '@playwright/test';

/**
 * ApiPage - Base class for API testing
 * 
 * Provides common functionality for making API requests
 * and handling responses for all API endpoints.
 */
export class ApiPage {
  private apiContext: APIRequestContext;
  
  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }
  
  /**
   * Makes a GET request to the specified endpoint
   * 
   * @param endpoint - The API endpoint to request
   * @param params - Optional query parameters
   * @returns The response data
   */
  async get(endpoint: string, params?: Record<string, any>) {
    const response = await this.apiContext.get(endpoint, { params });
    expect(response.ok()).toBeTruthy();
    return await response.json();
  }
  
  /**
   * Makes a POST request to the specified endpoint
   * 
   * @param endpoint - The API endpoint to request
   * @param data - The request body data
   * @returns The response data
   */
  async post(endpoint: string, data: Record<string, any>) {
    const response = await this.apiContext.post(endpoint, {
      data,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(response.ok()).toBeTruthy();
    return await response.json();
  }
  
  /**
   * Makes a PUT request to the specified endpoint
   * 
   * @param endpoint - The API endpoint to request
   * @param data - The request body data
   * @returns The response data
   */
  async put(endpoint: string, data: Record<string, any>) {
    const response = await this.apiContext.put(endpoint, {
      data,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(response.ok()).toBeTruthy();
    return await response.json();
  }
  
  /**
   * Makes a DELETE request to the specified endpoint
   * 
   * @param endpoint - The API endpoint to request
   * @returns The response status
   */
  async delete(endpoint: string) {
    const response = await this.apiContext.delete(endpoint);
    expect(response.ok()).toBeTruthy();
    return response.status();
  }
}

/**
 * UsersApi - Handles user-specific API operations
 */
export class UsersApi extends ApiPage {
  /**
   * Gets a list of users
   * 
   * @param page - Optional page number for pagination
   * @returns List of users
   */
  async getUsers(page?: number) {
    return this.get('/users', page ? { page } : undefined);
  }
  
  /**
   * Gets a specific user by ID
   * 
   * @param userId - The ID of the user to retrieve
   * @returns User data
   */
  async getUser(userId: number) {
    return this.get(`/users/${userId}`);
  }
  
  /**
   * Creates a new user
   * 
   * @param userData - User data to create
   * @returns Created user data
   */
  async createUser(userData: Record<string, any>) {
    return this.post('/users', userData);
  }
  
  /**
   * Authenticates a user
   * 
   * @param email - User email
   * @param password - User password
   * @returns Authentication token
   */
  async login(email: string, password: string) {
    return this.post('/login', { email, password });
  }
}

/**
 * ProductsApi - Handles product-specific API operations
 */
export class ProductsApi extends ApiPage {
  /**
   * Gets a list of products
   * 
   * @param params - Optional parameters for filtering and pagination
   * @returns List of products
   */
  async getProducts(params?: Record<string, any>) {
    return this.get('/products', params);
  }
  
  /**
   * Gets a specific product by ID
   * 
   * @param productId - The ID of the product to retrieve
   * @returns Product data
   */
  async getProduct(productId: number) {
    return this.get(`/products/${productId}`);
  }
  
  /**
   * Searches for products
   * 
   * @param searchTerm - The search term
   * @returns Search results
   */
  async searchProducts(searchTerm: string) {
    return this.get('/products/search', { q: searchTerm });
  }
  
  /**
   * Filters products by price range
   * 
   * @param minPrice - Minimum price
   * @param maxPrice - Maximum price
   * @returns Filtered products
   */
  async filterByPrice(minPrice: number, maxPrice: number) {
    return this.get('/products', { min_price: minPrice, max_price: maxPrice });
  }
  
  /**
   * Filters products by category
   * 
   * @param categoryId - Category ID to filter by
   * @returns Filtered products
   */
  async filterByCategory(categoryId: number) {
    return this.get('/products', { category_id: categoryId });
  }
}

/**
 * OrdersApi - Handles order-specific API operations
 */
export class OrdersApi extends ApiPage {
  /**
   * Gets a list of orders
   * 
   * @param params - Optional parameters for filtering and pagination
   * @returns List of orders
   */
  async getOrders(params?: Record<string, any>) {
    return this.get('/orders', params);
  }
  
  /**
   * Gets a specific order by ID
   * 
   * @param orderId - The ID of the order to retrieve
   * @returns Order data
   */
  async getOrder(orderId: number) {
    return this.get(`/orders/${orderId}`);
  }
  
  /**
   * Creates a new order
   * 
   * @param orderData - Order data to create
   * @returns Created order data
   */
  async createOrder(orderData: Record<string, any>) {
    return this.post('/orders', orderData);
  }
  
  /**
   * Updates an order's status
   * 
   * @param orderId - The ID of the order to update
   * @param statusId - The new status ID
   * @returns Updated order data
   */
  async updateOrderStatus(orderId: number, statusId: number) {
    return this.put(`/orders/${orderId}`, { order_status_id: statusId });
  }
} 