# Loanwise

A standalone loan comparison app for Indian rupee loans. Open the hosted site or serve the `dist` folder with any static web server.

## Run locally

With Node.js installed, run `node server.cjs` from this folder, then open `http://127.0.0.1:4174`. No dependencies need installing. Press Ctrl+C to stop the server.

Run the calculation checks with `node tests/calculator.test.mjs`.

## Features

- Compare two to four editable loan offers.
- Change the common principal, annual rate, tenure, processing fee in rupees or percent, and other upfront charges.
- Compare monthly EMI, interest, upfront fees, all payments, and total borrowing cost.
- See the lowest total cost separately from the lowest monthly EMI, with tie handling.
- Inspect the cost breakdown and calculation assumptions.
- No accounts, external requests for calculation, tracking, or persistent storage.

## Calculation model

For principal P, monthly rate r = annual percentage / 1200, and n monthly payments:

`EMI = P * r / (1 - (1+r)^(-n))`

The implementation uses `log1p` and `expm1` for numerical stability, with `P/n` when the rate is zero. Fees are paid separately at disbursement, so they do not change EMI. Total repayment is `EMI*n + processing fee + other charges`. The displayed estimates are rounded to whole rupees; calculations retain precision.

Assumptions: fixed rate, monthly reducing balance, payment at each month end, no prepayment or moratorium, and only the upfront fees explicitly entered. This is not a lender quote or an APR calculator.

## Files

- `dist/index.html`: page structure and calculation notes
- `dist/styles.css`: responsive styling
- `dist/app.js`: interactive interface and browser tool support
- `dist/calculator.mjs`: input validation and pure financial calculations

No package installation or build step is required.
