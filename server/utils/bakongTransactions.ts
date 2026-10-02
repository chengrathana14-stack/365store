/**
 * Memory-safe Bakong Transactions Store
 *
 * Implements:
 * 1. Automatic 20-minute TTL cleanup so stale transactions are freed from RAM
 * 2. Hard capacity cap (500 items max) to prevent memory leaks / exhaustion
 * 3. Safe lookup and status updates
 */

export interface BakongTransaction {
  bill_number: string;
  amount: number;
  currency: string;
  description: string;
  status: "UNPAID" | "PAID" | "EXPIRED" | "CANCELLED";
  created_at: number;
  paid_at?: number;
}

const TTL_MS = 20 * 60 * 1000; // 20 minutes expiration
const MAX_TRANSACTIONS = 500;

const getGlobalTransactionsMap = (): Map<string, BakongTransaction> => {
  const g = globalThis as any;
  if (!g.__BAKONG_TRANSACTIONS_MAP__) {
    g.__BAKONG_TRANSACTIONS_MAP__ = new Map<string, BakongTransaction>();
  }
  return g.__BAKONG_TRANSACTIONS_MAP__;
};

// Periodic prune to prevent memory growth
let lastSweep = Date.now();
const sweepExpired = () => {
  const now = Date.now();
  if (now - lastSweep < 60000) return;
  lastSweep = now;

  const map = getGlobalTransactionsMap();
  for (const [md5, tx] of map.entries()) {
    if (now - tx.created_at > TTL_MS) {
      map.delete(md5);
    }
  }

  // Cap size if still over limit
  if (map.size > MAX_TRANSACTIONS) {
    const keysToDelete = Array.from(map.keys()).slice(
      0,
      map.size - MAX_TRANSACTIONS
    );
    for (const k of keysToDelete) {
      map.delete(k);
    }
  }
};

export const saveBakongTransaction = (
  md5: string,
  tx: Omit<BakongTransaction, "created_at">
) => {
  sweepExpired();
  const map = getGlobalTransactionsMap();

  map.set(md5, {
    ...tx,
    created_at: Date.now(),
  });
};

export const getBakongTransaction = (
  md5: string
): BakongTransaction | undefined => {
  sweepExpired();
  const map = getGlobalTransactionsMap();
  const tx = map.get(md5);

  if (tx && Date.now() - tx.created_at > TTL_MS) {
    map.delete(md5);
    return undefined;
  }

  return tx;
};

export const updateBakongTransaction = (
  md5: string,
  update: Partial<BakongTransaction>
): boolean => {
  const map = getGlobalTransactionsMap();
  const existing = map.get(md5);
  if (!existing) return false;

  Object.assign(existing, update);
  return true;
};
