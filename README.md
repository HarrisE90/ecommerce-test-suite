# E‑Commerce Test Suite (Playwright + TypeScript)

## Overview

This project is a robust, production‑grade e‑commerce test suite built using Playwright (with TypeScript) for the "Practice Software Testing" demo site. It demonstrates advanced UI and API automation, integration scenarios, and follows best practices (Page Object Model, fixtures, stable selectors, and test isolation).

## Folder Structure

- **/tests**  
 – **/ui** – UI tests (e.g. user registration, login, product search, cart, checkout, order history)  
 – **/api** – API tests (e.g. user CRUD, product details, order data)  
 – **/integration** – Integration tests (combining UI and API flows)  
- **/pages** – Page Object Models (POM) for UI interactions (selectors, actions)  
- **/fixtures** – Test data (JSON or TS files) for dynamic test data (e.g. user, product, order fixtures)  
- **/utils** – Helper functions (e.g. API helpers, common assertions, logging)  
- **playwright.config.ts** – Playwright configuration (parallel runs, screenshots, video capture)  
- **tsconfig.json** (or **jsconfig.json**) – TypeScript (or JavaScript) configuration for type safety  
- **package.json** – Project dependencies and scripts (e.g. "npm run test")  
- **README.md** – This file (with setup, run instructions, and test coverage summary)

## Setup Instructions

1. Clone the repository (or download the scaffolded folder)  
2. Install dependencies (e.g. run `npm install`)  
3. (Optional) Update **playwright.config.ts** (or **tsconfig.json**) as needed  
4. Run tests (e.g. via `npm run test` or `npx playwright test`)  
 – (For example, run UI tests: `npx playwright test tests/ui/`)  
 – (For API tests: `npx playwright test tests/api/`)  
 – (For integration tests: `npx playwright test tests/integration/`)  
5. (Optional) Generate (or view) an HTML report (using Playwright's built‑in reporter or Allure)  

## Test Coverage

### UI Automation  
– User registration, login, product search, cart (add/update/remove), checkout (address, payment, order confirmation), and order history.  
– Negative tests (e.g. invalid login, out‑of‑stock products, form validation) are also included.

### API Automation  
– Tests (or helpers) to create, update, and delete users (or orders) via the API.  
– Validation of product details (or order data) fetched from the API against the UI.

### Integration Scenarios  
– Combines UI and API tests (e.g. create test data via API, then perform actions in the UI and vice versa).  
– Ensures data consistency (e.g. order details in the UI match the API's response).

## Advanced Features

- **Page Object Model (POM)** – Encapsulates UI interactions (selectors, actions) for reusability and maintainability.  
- **(Optional) Fixtures** – Generate dynamic test data (e.g. via JSON or TS files in /fixtures).  
- **(Optional) Reporting** – Integrate a reporting tool (like Allure or Playwright's built‑in HTML report) for clear, shareable test results.  
- **(Optional) Mock API Responses** – Use Playwright's network interception (or "mocking") for edge cases.

## Best Practices

- Use stable selectors (e.g. "data‑test‑id" attributes) and clear, explicit assertions.  
- Ensure test isolation (e.g. clean up test data after each test).  
- Write descriptive test names (and comments) so that the output is easy to understand.  
- (Optional) Add a README (with setup, run instructions, and a summary of test coverage) so that anyone (or any CI agent) can clone and run the suite.

---

*Happy Testing!* 