# Catalyst Playwright

[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

This repository provides additional end-to-end tests built with [Playwright](https://playwright.dev/) for the [Catalyst](https://www.catalyst.dev/) stack of BigCommerce, complementing the core test suite with additional behavioural tests and multilanguage support.

## Getting Started

### Prerequisites

- Ensure you have a working Catalyst environment set up

### Installation

1. Clone the repository inside `/packages/`:

   ```bash
   cd /path/to/catalyst
   git clone https://github.com/thebigrick/catalyst-e2e-tests ./packages/catalyst-e2e-tests
   ```

2. Install project dependencies:

   ```bash
   cd /path/to/catalyst
   pnpm install
   ```

3. Add BIGCOMMERCE_AUTH_TOKEN to `.env`:

   ```bash
   BIGCOMMERCE_AUTH_TOKEN=your-auth-token
   ```

   Required for BigCommerce API test data like test customers.
   Skip this step to bypass BigCommerce API-dependent tests.

   **IMPORTANT:** Only provide `BIGCOMMERCE_AUTH_TOKEN` in non-production environments.

## Usage

Start your Catalyst environment:

```bash
cd /path/to/catalyst
pnpm run dev
```

This launches the Playwright test environment alongside Catalyst.

## Contributing

Contributions welcome via pull requests or issues.
Made with ❤️ by The Big Rick for Catalyst.
