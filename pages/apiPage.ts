import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { apiConfig, endpoints } from '../../config/apiConfig';
import { validateSchema, assertResponseTime, retryOnError } from '../utils/apiTestUtils';

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
   * @param options - Additional options for the request
   * @returns The response data
   */
  async get(endpoint: string, params?: Record<string, any>, options: RequestOptions = {}) {
    const { validateStatus = true, schema, maxResponseTime } = options;
    
    const requestFn = async () => {
      const response = await this.apiContext.get(this.getFullUrl(endpoint), { 
        params,
        timeout: apiConfig.timeoutMs,
        headers: this.getHeaders(options.headers)
      });
      
      if (validateStatus) {
        await this.validateResponse(response);
      }
      
      const data = await response.json();
      
      if (schema) {
        validateSchema(data, schema);
      }
      
      return {
        data,
        status: response.status(),
        headers: response.headers()
      };
    };
    
    return maxResponseTime 
      ? assertResponseTime(requestFn, maxResponseTime)
      : requestFn();
  }
  
  /**
   * Makes a POST request to the specified endpoint
   * 
   * @param endpoint - The API endpoint to request
   * @param data - The request body data
   * @param options - Additional options for the request
   * @returns The response data
   */
  async post(endpoint: string, data: Record<string, any>, options: RequestOptions = {}) {
    const { validateStatus = true, schema, maxResponseTime } = options;
    
    const requestFn = async () => {
      const response = await this.apiContext.post(this.getFullUrl(endpoint), {
        data,
        timeout: apiConfig.timeoutMs,
        headers: this.getHeaders(options.headers)
      });
      
      if (validateStatus) {
        await this.validateResponse(response);
      }
      
      const responseData = await response.json();
      
      if (schema) {
        validateSchema(responseData, schema);
      }
      
      return {
        data: responseData,
        status: response.status(),
        headers: response.headers()
      };
    };
    
    return maxResponseTime 
      ? assertResponseTime(requestFn, maxResponseTime)
      : requestFn();
  }
  
  /**
   * Makes a PUT request to the specified endpoint
   * 
   * @param endpoint - The API endpoint to request
   * @param data - The request body data
   * @param options - Additional options for the request
   * @returns The response data
   */
  async put(endpoint: string, data: Record<string, any>, options: RequestOptions = {}) {
    const { validateStatus = true, schema, maxResponseTime } = options;
    
    const requestFn = async () => {
      const response = await this.apiContext.put(this.getFullUrl(endpoint), {
        data,
        timeout: apiConfig.timeoutMs,
        headers: this.getHeaders(options.headers)
      });
      
      if (validateStatus) {
        await this.validateResponse(response);
      }
      
      const responseData = await response.json();
      
      if (schema) {
        validateSchema(responseData, schema);
      }
      
      return {
        data: responseData,
        status: response.status(),
        headers: response.headers()
      };
    };
    
    return maxResponseTime 
      ? assertResponseTime(requestFn, maxResponseTime)
      : requestFn();
  }
  
  /**
   * Makes a DELETE request to the specified endpoint
   * 
   * @param endpoint - The API endpoint to request
   * @param options - Additional options for the request
   * @returns The response status and any data
   */
  async delete(endpoint: string, options: RequestOptions = {}) {
    const { validateStatus = true, schema, maxResponseTime } = options;
    
    const requestFn = async () => {
      const response = await this.apiContext.delete(this.getFullUrl(endpoint), {
        timeout: apiConfig.timeoutMs,
        headers: this.getHeaders(options.headers)
      });
      
      if (validateStatus) {
        await this.validateResponse(response);
      }
      
      let responseData = null;
      
      try {
        responseData = await response.json();
        
        if (schema) {
          validateSchema(responseData, schema);
        }
      } catch (error) {
        // DELETE responses may not return JSON
      }
      
      return {
        data: responseData,
        status: response.status(),
        headers: response.headers()
      };
    };
    
    return maxResponseTime 
      ? assertResponseTime(requestFn, maxResponseTime)
      : requestFn();
  }
  
  /**
   * Validates that an API response has a successful status code
   * 
   * @param response - The API response to validate
   */
  private async validateResponse(response: APIResponse) {
    const statusCode = response.status();
    
    if (statusCode < 200 || statusCode >= 300) {
      let errorMessage: string;
      
      try {
        const errorBody = await response.json();
        errorMessage = `API Error (${statusCode}): ${JSON.stringify(errorBody)}`;
      } catch (e) {
        const errorText = await response.text();
        errorMessage = `API Error (${statusCode}): ${errorText || 'No response body'}`;
      }
      
      throw new Error(errorMessage);
    }
  }
  
  /**
   * Builds the full URL for an API endpoint
   * 
   * @param endpoint - The API endpoint path
   * @returns The full URL
   */
  private getFullUrl(endpoint: string): string {
    // Handle if the endpoint already has the base URL
    if (endpoint.startsWith('http')) {
      return endpoint;
    }
    
    return `${apiConfig.baseUrl}${endpoint}`;
  }
  
  /**
   * Builds headers for an API request
   * 
   * @param customHeaders - Additional headers to include
   * @returns The complete headers object
   */
  private getHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    return { ...defaultHeaders, ...customHeaders };
  }
}

/**
 * Request options interface for API calls
 */
interface RequestOptions {
  validateStatus?: boolean;
  schema?: any;
  maxResponseTime?: number;
  headers?: Record<string, string>;
}

/**
 * UsersApi - Handles user-specific API operations
 */
export class UsersApi extends ApiPage {
  /**
   * Gets a list of users
   * 
   * @param page - Optional page number for pagination
   * @param options - Additional request options
   * @returns List of users
   */
  async getUsers(page?: number, options: RequestOptions = {}) {
    return this.get(endpoints.users.base, page ? { page } : undefined, options);
  }
  
  /**
   * Gets a specific user by ID
   * 
   * @param userId - The ID of the user to retrieve
   * @param options - Additional request options
   * @returns User data
   */
  async getUser(userId: number, options: RequestOptions = {}) {
    return this.get(endpoints.users.details(userId), undefined, options);
  }
  
  /**
   * Creates a new user
   * 
   * @param userData - User data to create
   * @param options - Additional request options
   * @returns Created user data
   */
  async createUser(userData: Record<string, any>, options: RequestOptions = {}) {
    return this.post(endpoints.users.base, userData, options);
  }
  
  /**
   * Authenticates a user
   * 
   * @param email - User email
   * @param password - User password
   * @param options - Additional request options
   * @returns Authentication token
   */
  async login(email: string, password: string, options: RequestOptions = {}) {
    return retryOnError(() => 
      this.post(endpoints.users.login, { email, password }, options)
    );
  }
  
  /**
   * Test negative case: attempts to get a non-existent user
   * 
   * @param options - Additional request options
   * @returns Error response
   */
  async getNonExistentUser(options: RequestOptions = {}) {
    return this.get(endpoints.users.details(99999), undefined, {
      ...options,
      validateStatus: false
    });
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
   * @param options - Additional request options
   * @returns List of products
   */
  async getProducts(params?: Record<string, any>, options: RequestOptions = {}) {
    return this.get(endpoints.products.base, params, options);
  }
  
  /**
   * Gets a specific product by ID
   * 
   * @param productId - The ID of the product to retrieve
   * @param options - Additional request options
   * @returns Product data
   */
  async getProduct(productId: number, options: RequestOptions = {}) {
    return this.get(endpoints.products.details(productId), undefined, options);
  }
  
  /**
   * Searches for products
   * 
   * @param searchTerm - The search term
   * @param options - Additional request options
   * @returns Search results
   */
  async searchProducts(searchTerm: string, options: RequestOptions = {}) {
    return this.get(endpoints.products.search, { q: searchTerm }, options);
  }
  
  /**
   * Filters products by price range
   * 
   * @param minPrice - Minimum price
   * @param maxPrice - Maximum price
   * @param options - Additional request options
   * @returns Filtered products
   */
  async filterByPrice(minPrice: number, maxPrice: number, options: RequestOptions = {}) {
    return this.get(
      endpoints.products.base, 
      { min_price: minPrice, max_price: maxPrice }, 
      options
    );
  }
  
  /**
   * Filters products by category
   * 
   * @param categoryId - Category ID to filter by
   * @param options - Additional request options
   * @returns Filtered products
   */
  async filterByCategory(categoryId: number, options: RequestOptions = {}) {
    return this.get(
      endpoints.products.base, 
      { category_id: categoryId }, 
      options
    );
  }
  
  /**
   * Test negative case: attempts to get a non-existent product
   * 
   * @param options - Additional request options
   * @returns Error response
   */
  async getNonExistentProduct(options: RequestOptions = {}) {
    return this.get(endpoints.products.details(99999), undefined, {
      ...options,
      validateStatus: false
    });
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
   * @param options - Additional request options
   * @returns List of orders
   */
  async getOrders(params?: Record<string, any>, options: RequestOptions = {}) {
    return this.get(endpoints.orders.base, params, options);
  }
  
  /**
   * Gets a specific order by ID
   * 
   * @param orderId - The ID of the order to retrieve
   * @param options - Additional request options
   * @returns Order data
   */
  async getOrder(orderId: number, options: RequestOptions = {}) {
    return this.get(endpoints.orders.details(orderId), undefined, options);
  }
  
  /**
   * Creates a new order
   * 
   * @param orderData - Order data to create
   * @param options - Additional request options
   * @returns Created order data
   */
  async createOrder(orderData: Record<string, any>, options: RequestOptions = {}) {
    return this.post(endpoints.orders.base, orderData, {
      ...options,
      headers: {
        ...options.headers,
        'x-expected-status': '201' // Expecting 201 Created status
      }
    });
  }
  
  /**
   * Updates an order's status
   * 
   * @param orderId - The ID of the order to update
   * @param statusId - The new status ID
   * @param options - Additional request options
   * @returns Updated order data
   */
  async updateOrderStatus(orderId: number, statusId: number, options: RequestOptions = {}) {
    return this.put(
      endpoints.orders.details(orderId), 
      { order_status_id: statusId }, 
      options
    );
  }
  
  /**
   * Test negative case: attempts to create an order with invalid data
   * 
   * @param invalidOrderData - Invalid order data
   * @param options - Additional request options
   * @returns Error response
   */
  async createInvalidOrder(invalidOrderData: Record<string, any>, options: RequestOptions = {}) {
    return this.post(endpoints.orders.base, invalidOrderData, {
      ...options,
      validateStatus: false
    });
  }
} 