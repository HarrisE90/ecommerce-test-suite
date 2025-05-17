/**
 * Test data for product browsing and checkout tests
 */

export const products = {
  popular: [
    {
      name: 'Combination Pliers',
      price: '$14.15',
      description: 'Heavy-duty combination pliers for various gripping and cutting tasks.'
    },
    {
      name: 'Pliers',
      price: '$12.01',
      description: 'Standard pliers for general use in DIY and professional settings.'
    },
    {
      name: 'Bolt Cutters',
      price: '$48.41',
      description: 'High-leverage bolt cutters capable of cutting through chains and bolts.'
    },
    {
      name: 'Long Nose Pliers',
      price: '$14.24',
      description: 'Precision long nose pliers for working in tight spaces and with small components.'
    },
    {
      name: 'Slip Joint Pliers',
      price: '$9.17',
      description: 'Versatile slip joint pliers with adjustable jaw positions for various applications.'
    },
    {
      name: 'Claw Hammer with Shock Reduction Grip',
      price: '$13.41',
      description: 'Ergonomic claw hammer with shock-reducing grip for comfortable use.'
    }
  ],
  sortOptions: [
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'price-asc', label: 'Price (low to high)' },
    { value: 'price-desc', label: 'Price (high to low)' }
  ],
  categories: [
    'Hand Tools',
    'Power Tools',
    'Other'
  ],
  subcategories: {
    'Hand Tools': [
      'Hammer',
      'Hand Saw',
      'Wrench',
      'Screwdriver',
      'Pliers',
      'Chisels',
      'Measures'
    ],
    'Power Tools': [
      'Grinder',
      'Sander',
      'Saw',
      'Drill'
    ],
    'Other': [
      'Tool Belts',
      'Storage Solutions',
      'Workbench',
      'Safety Gear',
      'Fasteners'
    ]
  },
  // Product with known ID from the codegen
  combinationPliers: {
    id: '01JVAASNQCT1J5QG7X8PD489S7',
    name: 'Combination Pliers',
    category: 'Pliers',
    price: '14.15'
  },
  pliers: {
    id: '01JVAASNQRNZX4Z4YMG36WFKRQ',
    name: 'Pliers',
    category: 'Pliers',
    price: '9.99'
  }
};

export const userInfo = {
  validCheckout: {
    firstName: 'Test',
    lastName: 'User',
    address: '123 Test St',
    city: 'Test City',
    state: 'Test State',
    postcode: '12345',
    country: 'US',
    bankName: 'Test Bank',
    accountName: 'Test User',
    accountNumber: '1234567890'
  },
  invalidCheckout: {
    firstName: 'Test',
    lastName: 'User',
    address: '123 Test St',
    city: 'Test City',
    state: 'Test State',
    postcode: '12345',
    country: 'US',
    bankName: 'Invalid Bank',
    accountName: 'Invalid',
    accountNumber: '000000'
  }
}; 