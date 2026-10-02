import { checkRateLimit } from "../utils/rateLimit";
import { getBakongTransaction } from "../utils/bakongTransactions";

export default defineEventHandler((event) => {
  // Rate limit status polling (max 120 polls per minute per client)
  checkRateLimit(event, { key: "check_payment", maxRequests: 120, windowMs: 60000 });

  const query = getQuery(event);
  const md5 = String(query.md5 || "");
  const expectedAmount = query.amount !== undefined ? Number(query.amount) : undefined;
  const expectedCurrency = query.currency ? String(query.currency).toUpperCase() : undefined;

  const tx = getBakongTransaction(md5);

  if (!tx) {
    return {
      status: "WAITING",
      success: true,
    };
  }

  // Strict verification: ensure paid amount and currency match order amount
  if (expectedAmount !== undefined && Math.abs(Number(tx.amount) - expectedAmount) > 0.01) {
    return {
      status: "AMOUNT_MISMATCH",
      expected: expectedAmount,
      received: tx.amount,
      success: false,
      message: "Paid amount does not match required product order amount",
    };
  }

  if (expectedCurrency && tx.currency && tx.currency.toUpperCase() !== expectedCurrency) {
    return {
      status: "CURRENCY_MISMATCH",
      expected: expectedCurrency,
      received: tx.currency,
      success: false,
      message: "Paid currency does not match order currency",
    };
  }

  return {
    status: tx.status || "WAITING",
    transaction: tx,
  };
});
