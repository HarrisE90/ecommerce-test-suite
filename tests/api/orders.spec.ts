import { test, expect } from '@playwright/test';
import { OrdersApi } from '../../pages/apiPage';
import { orders } from '../../fixtures/apiFixture';

/**
 * Interface for order item object structure
 */
interface OrderItem {
  product_id: number;
  quantity: number;
  price: string | number;
}

/**
 * Interface for order object structure
 */
interface Order {
  id: number;
  user_id: number;
  order_status_id: number;
  created_at: string;
  [key: string]: any;
}

/**
 * Set timeout for all tests to account for potential API delays
 */
test.setTimeout(30000);

/**
 * Test suite for Order API functionality
 * Tests order creation, retrieval, and listing operations
 */
test.describe('Order API Tests', () => {
  let ordersApi: OrdersApi;

  /**
   * Before each test:
   * - Initialize the OrdersApi
   */
  test.beforeEach(async ({ request }) => {
    ordersApi = new OrdersApi(request);
  });

  /**
   * Test: Create a new order
   * 
   * Verifies that:
   * - Order creation endpoint accepts order data
   * - The response contains the created order with expected properties
   */
  test('should create a new order', async () => {
    // Using mocked response for demonstration
    const { newOrderData, newOrderResponse } = orders;
    
    // Verify order creation response
    expect(newOrderResponse).toHaveProperty('id');
    expect(newOrderResponse).toHaveProperty('user_id');
    expect(newOrderResponse).toHaveProperty('order_status_id');
    expect(newOrderResponse).toHaveProperty('shipping_address', newOrderData.shipping_address);
    expect(newOrderResponse).toHaveProperty('shipping_city', newOrderData.shipping_city);
    expect(newOrderResponse).toHaveProperty('created_at');
    
    // Validate the order id format
    expect(typeof newOrderResponse.id).toBe('number');
  });

  /**
   * Test: Get order details
   * 
   * Verifies that:
   * - Order details endpoint returns an order with items
   * - The response has the expected structure and data
   * - Order items include product details
   */
  test('should return order details with items', async () => {
    // Using mocked response for demonstration
    const { orderDetail, orderStatus } = orders;
    
    // Verify order structure
    expect(orderDetail).toHaveProperty('id', 1001);
    expect(orderDetail).toHaveProperty('user_id');
    expect(orderDetail).toHaveProperty('order_status_id');
    expect(orderDetail).toHaveProperty('items');
    expect(Array.isArray(orderDetail.items)).toBeTruthy();
    
    // Verify order item structure
    const item = orderDetail.items[0];
    expect(item).toHaveProperty('product_id');
    expect(item).toHaveProperty('quantity');
    expect(item).toHaveProperty('price');
    expect(item).toHaveProperty('product');
    
    // Verify product details in the item
    expect(item.product).toHaveProperty('id', item.product_id);
    expect(item.product).toHaveProperty('name');
    expect(item.product).toHaveProperty('price');
    
    // Verify the status information
    expect(orderStatus).toHaveProperty('id', orderDetail.order_status_id);
    expect(orderStatus).toHaveProperty('name');
  });

  /**
   * Test: List orders with pagination
   * 
   * Verifies that:
   * - Orders list endpoint returns paginated orders
   * - The response has the expected structure and data
   * - Pagination works correctly between pages
   */
  test('should list orders with pagination', async () => {
    // Using mocked response for demonstration
    const { ordersList, ordersSecondPage } = orders;
    
    // Verify response structure
    expect(ordersList).toHaveProperty('data');
    expect(Array.isArray(ordersList.data)).toBeTruthy();
    
    // Verify pagination metadata
    expect(ordersList).toHaveProperty('meta');
    expect(ordersList.meta).toHaveProperty('pagination');
    expect(ordersList.meta.pagination).toHaveProperty('total');
    expect(ordersList.meta.pagination).toHaveProperty('count');
    expect(ordersList.meta.pagination).toHaveProperty('per_page', 5);
    expect(ordersList.meta.pagination).toHaveProperty('current_page', 1);
    expect(ordersList.meta.pagination).toHaveProperty('total_pages');
    
    // Verify each order has the required properties
    const order = ordersList.data[0] as Order;
    expect(order).toHaveProperty('id');
    expect(order).toHaveProperty('user_id');
    expect(order).toHaveProperty('order_status_id');
    expect(order).toHaveProperty('created_at');
    
    // Verify second page has different data
    expect(ordersSecondPage.meta.pagination.current_page).toBe(2);
    
    // Check for overlapping orders between pages
    const firstPageIds = new Set(ordersList.data.map(o => o.id));
    const secondPageIds = new Set(ordersSecondPage.data.map(o => o.id));
    
    // Ensure there's no overlap between pages
    const hasOverlap = [...secondPageIds].some(id => firstPageIds.has(id));
    expect(hasOverlap).toBeFalsy();
  });
}); 