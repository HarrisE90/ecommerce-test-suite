export const loginFixture = {
  valid: {
    username: 'customer@practicesoftwaretesting.com',
    password: 'welcome01'
  },
  invalid: {
    username: 'invalid@example.com',
    password: 'wrongpassword'
  },
  locked: {
    username: 'locked@practicesoftwaretesting.com',
    password: 'welcome01'
  }
}; 