# Playwright SMS login - Mailisk

This is an example project for a blog post that demonstrates how to combine Mailisk with Playwright to verify SMS-based login flows. It contains a minimal full-stack Next.js application: a client-side login form, API routes that send OTPs through Mailisk virtual SMS, and a lightweight in-memory store so automated tests can walk through the entire flow end to end.

## Requirements

- Node.js 18+
- npm (included with Node)
- Mailisk account with an API key and a virtual number

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment variables:

   ```bash
   cp .env.example .env
   ```

   Update `.env` with your `MAILISK_API_KEY`, `MAILISK_FROM_NUMBER` (sender), `MAILISK_SMS_NUMBER` (the recipient number you will log in with), and (optionally) a custom `OTP_TTL_MINUTES`.

3. Start the development server:

   ```bash
   npm run dev
   ```

   Visit http://localhost:3000 to use the demo UI. Enter a phone number that belongs to a Mailisk inbox so you can read the SMS from the virtual device.

## Run tests

- Execute the Playwright spec (ensure `MAILISK_API_KEY` and `MAILISK_SMS_NUMBER` are configured first):

  ```bash
  npx playwright test
  ```

## How it works

- `app/api/login/send-code` uses the Mailisk Node SDK to deliver a randomly generated 6-digit OTP via virtual SMS to your phone number.
  - This is inplace of a SMS delivery service to keep the setup simple.
- `app/api/login/verify-code` checks the submitted OTP against a temporary store that expires codes after the configured TTL.
- The UI lives under `app/login` and `app/login/verify`, while integration tests go in `tests/`.

This repository is intentionally small so the accompanying blog post can focus on the Mailisk + Playwright testing story without extra noise. Feel free to adapt it as a starting point for your own automation scenarios.
