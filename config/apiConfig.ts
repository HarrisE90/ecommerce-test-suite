/**
 * API Configuration
 * 
 * Central configuration for API testing with environment support
 */

export type Environment = 'local' | 'dev' | 'staging' | 'production';

// Get environment from environment variable or default to 'dev'
const currentEnv = (process.env.API_ENV || 'dev') as Environment;

interface EnvironmentConfig {
  baseUrl: string;
  timeoutMs: number;
  maxResponseTimeMs: number;
  authRetryAttempts: number;
}

// Configuration per environment
const environments: Record<Environment, EnvironmentConfig> = {
  local: {
    baseUrl: 'http://localhost:3000/api',
    timeoutMs: 5000,
    maxResponseTimeMs: 1000,
    authRetryAttempts: 1
  },
  dev: {
    baseUrl: 'https://dev-api.example.com',
    timeoutMs: 10000,
    maxResponseTimeMs: 2000,
    authRetryAttempts: 2
  },
  staging: {
    baseUrl: 'https://staging-api.example.com',
    timeoutMs: 10000,
    maxResponseTimeMs: 2000,
    authRetryAttempts: 2
  },
  production: {
    baseUrl: 'https://api.example.com',
    timeoutMs: 15000,
    maxResponseTimeMs: 3000,
    authRetryAttempts: 3
  }
};

// Export the configuration for the current environment
export const apiConfig = environments[currentEnv];

// API Endpoints
export const endpoints = {
  users: {
    base: '/users',
    details: (id: number | string) => `/users/${id}`,
    login: '/login'
  },
  products: {
    base: '/products',
    details: (id: number | string) => `/products/${id}`,
    search: '/products/search',
  },
  orders: {
    base: '/orders',
    details: (id: number | string) => `/orders/${id}`,
  }
}; 