export const userFixture = {
  newUser: {
    firstName: 'Test',
    lastName: 'User',
    email: `test${Date.now()}@example.com`,
    password: 'Password123!',
    address: '123 Test St',
    city: 'Test City',
    state: 'TS',
    zip: '12345',
    country: 'US'
  },
  existingUser: {
    id: 1,
    firstName: 'Existing',
    lastName: 'User',
    email: 'existing@example.com'
  }
}; 