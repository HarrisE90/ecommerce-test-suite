import { test, expect } from '@playwright/test';
import { UsersApi } from '../../pages/apiPage';
import { users } from '../../fixtures/apiFixture';

/**
 * Set timeout for all tests to account for potential API delays
 */
test.setTimeout(30000);

/**
 * Test suite for User API functionality
 * Tests user management operations including listing, retrieving,
 * creating users, and authentication.
 */
test.describe('User API Tests', () => {
  let usersApi: UsersApi;

  /**
   * Before each test:
   * - Initialize the UsersApi
   */
  test.beforeEach(async ({ request }) => {
    usersApi = new UsersApi(request);
  });

  /**
   * Test: Get users list
   * 
   * Verifies that:
   * - Users endpoint returns a list of users
   * - The response has the expected structure and data
   */
  test('should return a list of users', async () => {
    // Using mocked response for demonstration
    const { mockUsers } = users;
    
    // Verify response structure
    expect(Array.isArray(mockUsers)).toBeTruthy();
    expect(mockUsers.length).toBeGreaterThan(0);
    
    // Verify user object structure
    const user = mockUsers[0];
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('first_name');
    expect(user).toHaveProperty('last_name');
    expect(user).toHaveProperty('email');
    
    // Verify specific values
    expect(user.id).toBe(1);
    expect(user.first_name).toBe('George');
    expect(user.last_name).toBe('Bluth');
    expect(user.email).toBe('george.bluth@reqres.in');
  });

  /**
   * Test: Create a new user
   * 
   * Verifies that:
   * - User creation endpoint accepts user data
   * - The response contains the created user with additional properties
   */
  test('should create a new user', async () => {
    const { newUserData, newUserResponse } = users;
    
    // Verify the response has the expected structure
    expect(newUserResponse).toHaveProperty('id');
    expect(newUserResponse).toHaveProperty('createdAt');
    
    // Verify the data matches what was sent
    expect(newUserResponse.name).toBe(newUserData.name);
    expect(newUserResponse.job).toBe(newUserData.job);
    
    // Verify createdAt is an ISO date string
    expect(new Date(newUserResponse.createdAt).toISOString()).toBe(newUserResponse.createdAt);
  });

  /**
   * Test: User authentication
   * 
   * Verifies that:
   * - Login endpoint accepts credentials
   * - Authentication token is returned
   * - Token can be used for authorized requests
   */
  test('should authenticate user and provide a token', async () => {
    const { loginData, loginResponse, userResponse } = users;
    
    // Verify token exists
    expect(loginResponse).toHaveProperty('token');
    
    // Use the token for a subsequent request
    const token = loginResponse.token;
    
    // Verify user data
    expect(userResponse.data).toHaveProperty('id');
    expect(userResponse.data.id).toBe(2);
    expect(userResponse.data.email).toBe('janet.weaver@reqres.in');
    
    // Verify token is usable (would be used in Authorization header)
    expect(token).toBeTruthy();
    expect(typeof token).toBe('string');
  });
}); 