/**
 * API JSON Schemas
 * 
 * Contains JSON schemas for validating API responses
 */

// User schema
export const userSchema = {
  type: 'object',
  required: ['id', 'first_name', 'last_name', 'email'],
  properties: {
    id: { type: 'number' },
    first_name: { type: 'string' },
    last_name: { type: 'string' },
    email: { type: 'string', format: 'email' },
    avatar: { type: 'string', nullable: true }
  },
  additionalProperties: false
};

// Users list schema
export const usersListSchema = {
  type: 'array',
  items: userSchema
};

// User creation response schema
export const userCreationSchema = {
  type: 'object',
  required: ['name', 'job', 'id', 'createdAt'],
  properties: {
    name: { type: 'string' },
    job: { type: 'string' },
    id: { type: ['string', 'number'] },
    createdAt: { type: 'string', format: 'date-time' }
  }
};

// Authentication response schema
export const authResponseSchema = {
  type: 'object',
  required: ['token'],
  properties: {
    token: { type: 'string' }
  }
};

// Product schema
export const productSchema = {
  type: 'object',
  required: ['id', 'name', 'description', 'price', 'category_id'],
  properties: {
    id: { type: 'number' },
    name: { type: 'string' },
    description: { type: 'string' },
    price: { type: ['string', 'number'] },
    category_id: { type: ['number', 'string'] },
    brand_id: { type: ['number', 'string'], nullable: true },
    image: { type: 'string', nullable: true },
    category: { 
      type: 'object',
      nullable: true,
      properties: {
        id: { type: 'number' },
        name: { type: 'string' },
        slug: { type: 'string' }
      }
    },
    brand: {
      type: 'object',
      nullable: true,
      properties: {
        id: { type: 'number' },
        name: { type: 'string' },
        slug: { type: 'string' }
      }
    }
  }
};

// Products list schema with pagination
export const productsListSchema = {
  type: 'object',
  required: ['data', 'meta'],
  properties: {
    data: {
      type: 'array',
      items: productSchema
    },
    meta: {
      type: 'object',
      required: ['pagination'],
      properties: {
        pagination: {
          type: 'object',
          required: ['total', 'count', 'per_page', 'current_page', 'total_pages'],
          properties: {
            total: { type: 'number' },
            count: { type: 'number' },
            per_page: { type: 'number' },
            current_page: { type: 'number' },
            total_pages: { type: 'number' }
          }
        }
      }
    }
  }
};

// Order item schema
export const orderItemSchema = {
  type: 'object',
  required: ['product_id', 'quantity', 'price'],
  properties: {
    id: { type: 'number' },
    order_id: { type: 'number' },
    product_id: { type: 'number' },
    quantity: { type: 'number' },
    price: { type: ['string', 'number'] },
    product: { type: 'object', nullable: true }
  }
};

// Order schema
export const orderSchema = {
  type: 'object',
  required: ['id', 'user_id', 'order_status_id', 'created_at'],
  properties: {
    id: { type: 'number' },
    user_id: { type: 'number' },
    order_status_id: { type: 'number' },
    shipping_address: { type: 'string' },
    shipping_city: { type: 'string' },
    shipping_state: { type: 'string' },
    shipping_zip: { type: 'string' },
    shipping_country: { type: 'string' },
    payment_type: { type: 'string' },
    created_at: { type: 'string' },
    updated_at: { type: 'string' },
    items: {
      type: 'array',
      items: orderItemSchema,
      nullable: true
    }
  }
};

// Orders list schema with pagination
export const ordersListSchema = {
  type: 'object',
  required: ['data', 'meta'],
  properties: {
    data: {
      type: 'array',
      items: orderSchema
    },
    meta: {
      type: 'object',
      required: ['pagination'],
      properties: {
        pagination: {
          type: 'object',
          required: ['total', 'count', 'per_page', 'current_page', 'total_pages'],
          properties: {
            total: { type: 'number' },
            count: { type: 'number' },
            per_page: { type: 'number' },
            current_page: { type: 'number' },
            total_pages: { type: 'number' }
          }
        }
      }
    }
  }
}; 