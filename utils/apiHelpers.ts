import { APIRequestContext } from '@playwright/test';

export class ApiHelpers {
  private request: APIRequestContext;
  private baseUrl = 'https://practice-software-testing.com/api';

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async createUser(userData: any) {
    const response = await this.request.post(`${this.baseUrl}/users`, {
      data: userData
    });
    return response.ok() ? await response.json() : null;
  }

  async getUser(userId: number) {
    const response = await this.request.get(`${this.baseUrl}/users/${userId}`);
    return response.ok() ? await response.json() : null;
  }

  async deleteUser(userId: number) {
    const response = await this.request.delete(`${this.baseUrl}/users/${userId}`);
    return response.ok();
  }

  async getProducts() {
    const response = await this.request.get(`${this.baseUrl}/products`);
    return response.ok() ? await response.json() : [];
  }

  async getProduct(productId: number) {
    const response = await this.request.get(`${this.baseUrl}/products/${productId}`);
    return response.ok() ? await response.json() : null;
  }

  async getOrder(orderId: number) {
    const response = await this.request.get(`${this.baseUrl}/orders/${orderId}`);
    return response.ok() ? await response.json() : null;
  }
} 