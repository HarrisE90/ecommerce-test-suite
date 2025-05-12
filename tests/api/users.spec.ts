import { test, expect } from '@playwright/test';
import { userFixture } from '../../fixtures/userFixture';

test.describe('User API Tests', () => {
  const baseUrl = 'https://practice-software-testing.com/api';

  test('get users', async ({ request }) => {
    const response = await request.get(`${baseUrl}/users`);
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
  });

  test('create user', async ({ request }) => {
    const { newUser } = userFixture;
    const response = await request.post(`${baseUrl}/users`, {
      data: newUser
    });
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.id).toBeDefined();
  });
}); 