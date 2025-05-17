/**
 * Error Response Fixtures
 * Contains mock data for API error handling tests
 */

// User error fixtures
export const userErrors = {
  // Non-existent user error response
  nonExistentUser: {
    status: 404,
    data: {
      error: 'User not found',
      message: 'The requested user does not exist'
    }
  },
  
  // Invalid authentication error response
  invalidAuthentication: {
    status: 401,
    data: {
      error: 'Invalid credentials',
      message: 'Email or password is incorrect'
    }
  }
};

// Product error fixtures
export const productErrors = {
  // Non-existent product error response
  nonExistentProduct: {
    status: 404,
    data: {
      error: 'Product not found',
      message: 'The requested product does not exist'
    }
  }
};

// Order error fixtures
export const orderErrors = {
  // Invalid order creation error response
  invalidOrderData: {
    status: 400,
    data: {
      errors: [
        {
          field: 'shipping_address',
          message: 'Shipping address is required'
        },
        {
          field: 'shipping_city',
          message: 'Shipping city is required'
        },
        {
          field: 'items',
          message: 'At least one item is required'
        }
      ]
    }
  }
};

// Rate limiting error response
export const rateLimitError = {
  status: 429,
  data: {
    error: 'Too many requests',
    message: 'Rate limit exceeded'
  },
  headers: {
    'retry-after': '30'
  }
}; 