# Automated E2E Web Test Suite

A working end-to-end test automation framework built with **Playwright + TypeScript**, using the **Page Object Model** pattern. It exercises a real, publicly hosted e-commerce demo site ([saucedemo.com](https://www.saucedemo.com)) end-to-end — login, cart, checkout — plus a separate API test layer and automated accessibility checks. Runs locally and in CI (GitHub Actions) out of the box.

## Why this stack

| Choice | Reason |
|---|---|
| **Playwright** | Industry-standard modern E2E tool (auto-waiting, network interception, multi-browser, trace viewer). Widely listed in QA/SDET job postings. |
| **TypeScript** | Type safety catches locator/fixture mistakes at compile time; also the most common pairing with Playwright in real codebases. |
| **Page Object Model** | Separates *how to interact with a page* (`pages/`) from *what a test asserts* (`tests/`), so UI changes touch one file, not every spec. |
| **saucedemo.com** | Purpose-built by Sauce Labs for test automation practice — stable, free, no account needed, includes intentionally broken states (`problem_user`, `locked_out_user`) to test against. |
| **reqres.in** | Free hosted mock REST API, used to demonstrate API-layer testing independent of the UI. |

## Project structure

```
e2e-test-suite/
├── pages/                  # Page Object Model — one class per page/component
│   ├── BasePage.ts
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── fixtures/
│   ├── testData.ts         # Centralized users/products/test data
│   └── pageFixtures.ts     # Custom Playwright fixtures (injects page objects, pre-auth session)
├── tests/
│   ├── ui/
│   │   ├── login.spec.ts         # Auth: happy path + 4 negative cases
│   │   ├── checkout.spec.ts      # Core E2E flow: cart, checkout, sorting, math validation
│   │   └── accessibility.spec.ts # axe-core WCAG2A/AA scans
│   └── api/
│       └── users.spec.ts         # GET/POST/DELETE + status code + schema checks
├── .github/workflows/
│   └── playwright.yml      # CI: runs on push/PR + nightly cron, uploads HTML + JUnit reports
├── playwright.config.ts    # Multi-browser projects, retries, tracing, reporters
└── tsconfig.json
```

## How to run it

**Prerequisites:** Node.js 20+ installed.

```bash
# 1. Install dependencies
npm install

# 2. Install browser binaries (one-time)
npx playwright install --with-deps

# 3. Run the full suite (all browsers)
npm test

# Or run a subset:
npm run test:ui           # only UI specs
npm run test:api          # only API specs
npm run test:chromium     # only Chromium
npm run test:headed       # watch the browser while it runs
npm run test:debug        # step through with Playwright Inspector

# 4. View the HTML report (opens automatically-collected traces/screenshots on failure)
npm run report
```

To point the suite at a different environment, copy `.env.example` to `.env` and change `BASE_URL`.

### What you'll see

- **login.spec.ts** — valid login, locked-out user, invalid credentials, empty-field validation.
- **checkout.spec.ts** — the full purchase journey (add to cart → remove item → checkout → verify subtotal + tax = total → complete order), plus required-field validation and price-sorting checks.
- **accessibility.spec.ts** — automated WCAG 2A/AA scans on key pages via axe-core.
- **users.spec.ts** — API tests against a live REST API: GET single/list/paginated, POST create, 404 handling, DELETE.

On failure, Playwright automatically captures a screenshot, video, and trace — open the HTML report and click "trace" to get a full timeline replay with DOM snapshots and network calls, which is very useful to show in an interview.

## CI

`.github/workflows/playwright.yml` runs the suite on every push/PR to `main`, plus a nightly scheduled run (useful to demonstrate you understand *flake detection over time*, not just one-off green runs). Reports are uploaded as artifacts. Push this repo to GitHub and the badge/Actions tab will populate automatically — great for a CV link.

## What I'd extend first

Roughly in priority order if you want to keep building this out:

1. **Visual regression testing** — add `expect(page).toHaveScreenshot()` snapshots on key pages; Playwright has this built in, just needs baseline images committed.
2. **Test tagging & smoke suite** — tag critical-path tests (`@smoke`) and add an `npm run test:smoke` script that runs a fast subset on every PR, saving the full suite for nightly/merge.
3. **Parallel sharding in CI** — split `playwright.yml` into a matrix (`shard: [1/4, 2/4, 3/4, 4/4]`) to cut CI time as the suite grows.
4. **Docker container** — wrap the suite in the official `mcr.microsoft.com/playwright` image so "works on my machine" issues disappear and it's portable to any CI system.
5. **Allure or a hosted report** — swap/add Allure reporting for richer historical trend charts, or publish the HTML report to GitHub Pages after each CI run.
6. **Data-driven tests** — parametrize login/checkout specs over multiple user types (`problem_user`, `performance_glitch_user`) using `test.describe.parametrize`-style loops to multiply coverage without duplicating code.
7. **Contract/schema validation on the API layer** — add `zod` or `ajv` schema checks instead of `toMatchObject`, so API tests fail loudly on breaking schema changes.
8. **Environment matrix** — run the same suite against staging/prod URLs via `BASE_URL`, with environment-specific credentials pulled from CI secrets.

## Notes for adapting this to your own app

- Swap `baseURL` in `playwright.config.ts` and the page objects' selectors for your target app.
- `fixtures/pageFixtures.ts` is the main place to add new page objects so they're auto-injected into every test.
- Credentials/test data belong in `fixtures/testData.ts`, not hardcoded in specs — keeps specs readable and data reusable.
