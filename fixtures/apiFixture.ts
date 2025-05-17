/**
 * API Test Fixtures
 * Contains mock data for API testing
 */

// User data fixtures
export const users = {
  mockUsers: [
    {
      id: 1,
      first_name: 'George',
      last_name: 'Bluth',
      email: 'george.bluth@reqres.in'
    },
    {
      id: 2,
      first_name: 'Janet',
      last_name: 'Weaver',
      email: 'janet.weaver@reqres.in'
    }
  ],
  newUserData: {
    name: 'Test User',
    job: 'Software Tester'
  },
  newUserResponse: {
    name: 'Test User',
    job: 'Software Tester',
    id: '123',
    createdAt: '2023-05-16T12:34:56.789Z'
  },
  loginData: {
    email: 'eve.holt@reqres.in',
    password: 'cityslicka'
  },
  loginResponse: {
    token: 'QpwL5tke4Pnpja7X4'
  },
  userResponse: {
    data: {
      id: 2,
      email: 'janet.weaver@reqres.in',
      first_name: 'Janet',
      last_name: 'Weaver',
      avatar: 'https://reqres.in/img/faces/2-image.jpg'
    }
  }
};

// Product data fixtures
export const products = {
  // Products list with pagination
  productsList: {
    data: [
      {
        id: 1,
        name: 'Premium Hammer',
        description: 'High quality steel hammer with ergonomic grip',
        price: '29.99',
        category_id: 1,
        brand_id: 2,
        image: 'hammer.jpg'
      },
      {
        id: 2,
        name: 'Professional Screwdriver Set',
        description: 'Set of 10 professional screwdrivers',
        price: '45.50',
        category_id: 1,
        brand_id: 3,
        image: 'screwdriver_set.jpg'
      }
    ],
    meta: {
      pagination: {
        total: 24,
        count: 2,
        per_page: 10,
        current_page: 1,
        total_pages: 3
      }
    }
  },
  
  // Single product with related data
  productDetail: {
    id: 1,
    name: 'Premium Hammer',
    description: 'High quality steel hammer with ergonomic grip',
    price: '29.99',
    category_id: 1,
    brand_id: 2,
    image: 'hammer.jpg',
    category: {
      id: 1,
      name: 'Hand Tools',
      slug: 'hand-tools'
    },
    brand: {
      id: 2,
      name: 'ToolMaster',
      slug: 'toolmaster'
    }
  },
  
  // Category data
  category: {
    id: 1,
    name: 'Hand Tools',
    slug: 'hand-tools'
  },
  
  // Brand data
  brand: {
    id: 2,
    name: 'ToolMaster',
    slug: 'toolmaster'
  },
  
  // Search results by name
  nameSearchResults: {
    data: [
      {
        id: 1,
        name: 'Premium Hammer',
        description: 'High quality steel hammer with ergonomic grip',
        price: '29.99',
        category_id: 1,
        brand_id: 2,
        image: 'hammer.jpg'
      },
      {
        id: 5,
        name: 'Framing Hammer',
        description: 'Heavy duty hammer perfect for framing',
        price: '35.99',
        category_id: 1,
        brand_id: 4,
        image: 'framing_hammer.jpg'
      }
    ],
    meta: {
      pagination: {
        total: 2,
        count: 2,
        per_page: 10,
        current_page: 1,
        total_pages: 1
      }
    }
  },
  
  // Search results by price range
  priceRangeResults: {
    data: [
      {
        id: 3,
        name: 'Tape Measure',
        description: '25-foot tape measure with magnetic hook',
        price: '12.99',
        category_id: 1,
        brand_id: 2,
        image: 'tape_measure.jpg'
      },
      {
        id: 8,
        name: 'Safety Goggles',
        description: 'Anti-fog safety goggles',
        price: '15.49',
        category_id: 3,
        brand_id: 5,
        image: 'safety_goggles.jpg'
      }
    ],
    meta: {
      pagination: {
        total: 8,
        count: 2,
        per_page: 10,
        current_page: 1,
        total_pages: 1
      }
    }
  },
  
  // Search results by category
  categoryResults: {
    data: [
      {
        id: 12,
        name: 'Circular Saw',
        description: '7.25-inch circular saw with laser guide',
        price: '89.99',
        category_id: 2,
        brand_id: 4,
        image: 'circular_saw.jpg'
      },
      {
        id: 15,
        name: 'Drill Set',
        description: 'Cordless drill with 20V battery and accessories',
        price: '129.99',
        category_id: 2,
        brand_id: 2,
        image: 'drill_set.jpg'
      }
    ],
    meta: {
      pagination: {
        total: 6,
        count: 2,
        per_page: 10,
        current_page: 1,
        total_pages: 1
      }
    }
  }
};

// Order data fixtures
export const orders = {
  // New order data
  newOrderData: {
    shipping_address: '123 Test Street',
    shipping_city: 'Test City',
    shipping_state: 'TS',
    shipping_zip: '12345',
    shipping_country: 'US',
    payment_type: 'credit_card',
    items: [
      {
        product_id: 1,
        quantity: 2,
        price: '29.99'
      }
    ]
  },
  
  // Mock order creation response
  newOrderResponse: {
    id: 1001,
    user_id: 42,
    order_status_id: 1,
    shipping_address: '123 Test Street',
    shipping_city: 'Test City',
    shipping_state: 'TS',
    shipping_zip: '12345',
    shipping_country: 'US',
    payment_type: 'credit_card',
    created_at: '2023-05-16T15:30:45.000Z',
    updated_at: '2023-05-16T15:30:45.000Z'
  },
  
  // Order details with items
  orderDetail: {
    id: 1001,
    user_id: 42,
    order_status_id: 1,
    shipping_address: '123 Test Street',
    shipping_city: 'Test City',
    shipping_state: 'TS',
    shipping_zip: '12345',
    shipping_country: 'US',
    payment_type: 'credit_card',
    created_at: '2023-05-16T15:30:45.000Z',
    updated_at: '2023-05-16T15:30:45.000Z',
    items: [
      {
        id: 2001,
        order_id: 1001,
        product_id: 1,
        quantity: 2,
        price: '29.99',
        product: {
          id: 1,
          name: 'Premium Hammer',
          description: 'High quality steel hammer with ergonomic grip',
          price: '29.99',
          category_id: 1,
          brand_id: 2,
          image: 'hammer.jpg'
        }
      }
    ]
  },
  
  // Order status
  orderStatus: {
    id: 1,
    name: 'Pending',
    description: 'Order has been placed but not yet processed'
  },
  
  // Orders list with pagination
  ordersList: {
    data: [
      {
        id: 1001,
        user_id: 42,
        order_status_id: 1,
        shipping_address: '123 Test Street',
        shipping_city: 'Test City',
        shipping_state: 'TS',
        shipping_zip: '12345',
        shipping_country: 'US',
        payment_type: 'credit_card',
        created_at: '2023-05-16T15:30:45.000Z',
        updated_at: '2023-05-16T15:30:45.000Z'
      },
      {
        id: 1002,
        user_id: 42,
        order_status_id: 2,
        shipping_address: '456 Other Street',
        shipping_city: 'Other City',
        shipping_state: 'OS',
        shipping_zip: '67890',
        shipping_country: 'US',
        payment_type: 'paypal',
        created_at: '2023-05-15T10:22:30.000Z',
        updated_at: '2023-05-15T10:22:30.000Z'
      }
    ],
    meta: {
      pagination: {
        total: 12,
        count: 2,
        per_page: 5,
        current_page: 1,
        total_pages: 3
      }
    }
  },
  
  // Second page of orders
  ordersSecondPage: {
    data: [
      {
        id: 1003,
        user_id: 42,
        order_status_id: 3,
        shipping_address: '789 New Street',
        shipping_city: 'New City',
        shipping_state: 'NS',
        shipping_zip: '11223',
        shipping_country: 'US',
        payment_type: 'credit_card',
        created_at: '2023-05-14T08:15:10.000Z',
        updated_at: '2023-05-14T08:15:10.000Z'
      },
      {
        id: 1004,
        user_id: 42,
        order_status_id: 4,
        shipping_address: '321 First Avenue',
        shipping_city: 'First City',
        shipping_state: 'FC',
        shipping_zip: '33445',
        shipping_country: 'US',
        payment_type: 'credit_card',
        created_at: '2023-05-13T14:40:22.000Z',
        updated_at: '2023-05-13T14:40:22.000Z'
      }
    ],
    meta: {
      pagination: {
        total: 12,
        count: 2,
        per_page: 5,
        current_page: 2,
        total_pages: 3
      }
    }
  }
}; 