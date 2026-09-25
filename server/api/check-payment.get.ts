export default defineEventHandler((event) => {
  const query = getQuery(event);
  const md5 = String(query.md5 || "");

  const globalStore = globalThis as any;
  const transactions = globalStore.__BAKONG_TRANSACTIONS__ || new Map();
  const tx = transactions.get(md5);

  if (!tx) {
    return {
      status: "WAITING",
      success: true,
    };
  }

  return {
    status: tx.status || "WAITING",
    transaction: tx,
  };
});
