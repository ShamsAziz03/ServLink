const db = require("../../config/db");
// GET /api/provider/wallet/:provider_id
exports.getProviderWallet = async (req, res) => {
  const { provider_id } = req.params;

  try {
    const [rows] = await db.promise().query(
      `SELECT balance, debt
       FROM providerswallets
       WHERE owner_type='provider' AND owner_id=?`,
      [provider_id]
    );

    if (!rows.length) {
      return res.json({ balance: 0, debt: 0 });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// POST /api/provider/wallet/pay-debt
exports.payProviderDebt = async (req, res) => {
  const { provider_id, amount } = req.body;

  try {
    await db.promise().query("START TRANSACTION");

    // جلب المحفظة مع FOR UPDATE لمنع السباق
    const [[wallet]] = await db.promise().query(
      `SELECT balance, debt
       FROM providerswallets
       WHERE owner_type='provider' AND owner_id=?
       FOR UPDATE`,
      [provider_id]
    );

    if (!wallet) throw new Error("Wallet not found");
    if (amount > wallet.balance) throw new Error("Insufficient balance");
    if (amount > wallet.debt) throw new Error("Amount exceeds debt");

    // خصم من البروفايدر
    await db.promise().query(
      `UPDATE providerswallets
       SET balance = balance - ?, debt = debt - ?
       WHERE owner_type='provider' AND owner_id=?`,
      [amount, amount, provider_id]
    );

    // إضافة للتطبيق
    await db.promise().query(
      `UPDATE providerswallets
       SET balance = balance + ?
       WHERE owner_type='app' AND owner_id=0`,
      [amount]
    );

    // تسجيل الترانزاكشن
    await db.promise().query(
      `INSERT INTO WalletTransactions
       (from_type, from_id, to_type, to_id, amount, transaction_type, note)
       VALUES ('provider', ?, 'app', 0, ?, 'debt_payment', 'Provider paid debt')`,
      [provider_id, amount]
    );

    await db.promise().query("COMMIT");

    res.json({ success: true });

  } catch (err) {
    await db.promise().query("ROLLBACK");
    res.status(400).json({ error: err.message });
  }
};
