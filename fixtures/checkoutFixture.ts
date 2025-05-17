/**
 * Payment method types with their specific properties
 */

export interface CreditCardPayment {
  method: string;
  cardNumber: string;
  expirationDate: string;
  cvv: string;
  cardHolderName: string;
}

export interface GiftCardPayment {
  method: string;
  giftCardNumber: string;
  validationCode: string;
}

export interface BuyNowPayLaterPayment {
  method: string;
  installments: number;
}

export interface BankTransferPayment {
  method: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
}

/**
 * Test data for different payment methods
 */
export const paymentMethods = {
  creditCard: {
    method: 'credit-card',
    cardNumber: '4111111111111111',
    expirationDate: '12/25',
    cvv: '123',
    cardHolderName: 'Test User'
  } as CreditCardPayment,
  
  giftCard: {
    method: 'gift-card',
    giftCardNumber: 'GC12345678',
    validationCode: '123456'
  } as GiftCardPayment,
  
  buyNowPayLater: {
    method: 'buy-now-pay-later',
    installments: 3
  } as BuyNowPayLaterPayment,
  
  bankTransfer: {
    method: 'bank-transfer',
    bankName: 'Test Bank',
    accountName: 'Test User',
    accountNumber: '1234567890'
  } as BankTransferPayment
};

/**
 * Invalid payment data for negative testing scenarios
 */
export const invalidPaymentMethods = {
  invalidCreditCard: {
    method: 'credit-card',
    cardNumber: '1123131',       // Invalid: too short
    expirationDate: '1215',      // Invalid: wrong format (should be MM/YYYY)
    cvv: '12354',                // Invalid: too many digits
    cardHolderName: 'n ame'      // Problematic: odd spacing
  } as CreditCardPayment,
  
  invalidGiftCard: {
    method: 'gift-card',
    giftCardNumber: '123',       // Invalid: too short
    validationCode: 'ABC'        // Invalid: non-numeric
  } as GiftCardPayment,
  
  invalidBankTransfer: {
    method: 'bank-transfer',
    bankName: '',                // Invalid: empty
    accountName: '',             // Invalid: empty
    accountNumber: 'ABC123'      // Invalid: non-numeric
  } as BankTransferPayment
};

/**
 * Performance thresholds for checkout steps in milliseconds
 */
export const performanceThresholds = {
  cartLoad: 5000,
  checkoutLoad: 10000,
  billingForm: 10000,
  paymentForm: 10000,
  orderCompletion: 15000
}; 