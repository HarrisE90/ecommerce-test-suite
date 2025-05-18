/**
 * API Test Utilities
 * 
 * Helper functions for API testing
 */
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { expect } from '@playwright/test';
import { apiConfig } from '../config/apiConfig'; 


// Initialize Ajv with formats
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

/**
 * Validates response data against a JSON schema
 * 
 * @param data - The data to validate
 * @param schema - The JSON schema to validate against
 * @returns True if valid, throws an error with details if invalid
 */
export function validateSchema(data: any, schema: any): boolean {
  const validate = ajv.compile(schema);
  const valid = validate(data);
  
  if (!valid) {
    const errorDetails = ajv.errorsText(validate.errors, { separator: '\n' });
    throw new Error(`Schema validation failed: ${errorDetails}\nData: ${JSON.stringify(data, null, 2)}`);
  }
  
  return true;
}

/**
 * Times an async function and asserts that it completes within the expected time
 * 
 * @param fn - The async function to time
 * @param maxTime - Maximum allowed time in milliseconds (defaults to config value)
 * @returns The result of the function
 */
export async function assertResponseTime<T>(
  fn: () => Promise<T>,
  maxTime: number = apiConfig.maxResponseTimeMs
): Promise<T> {
  const startTime = Date.now();
  const result = await fn();
  const elapsed = Date.now() - startTime;
  
  expect(elapsed, `API response took too long: ${elapsed}ms`).toBeLessThanOrEqual(maxTime);
  
  return result;
}

/**
 * Generates a random email for testing
 * 
 * @returns A random email address
 */
export function generateRandomEmail(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `test-${timestamp}-${random}@example.com`;
}

/**
 * Error handling utility that retries a function on specific errors
 * 
 * @param fn - The function to retry
 * @param retries - Number of retries (defaults to config value)
 * @param retryableErrors - Array of error messages that should trigger a retry
 * @returns The result of the function
 */
export async function retryOnError<T>(
  fn: () => Promise<T>,
  retries: number = apiConfig.authRetryAttempts,
  retryableErrors: string[] = ['Token expired', 'Rate limit exceeded']
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      const shouldRetry = retryableErrors.some(errMsg => 
        lastError.message.includes(errMsg)
      );
      
      if (!shouldRetry || attempt === retries) {
        throw lastError;
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100));
    }
  }
  
  throw lastError!;
} 