// const { use } = require("react");
// const db = require("../config/db");

// class PaymentModel {
//   static async getUserWallet(userId) {
//     const query = `select * from wallet where user_id= ? ;`;
//     const [result] = await db.promise().execute(query, [userId]);
//     return result;
//   }

//   static async createWallet(userId, customerId) {
//     const query = `
//       INSERT INTO wallet (user_id, amount, stripe_customer_id)
//       VALUES (?, 0.00, ?)
//     `;
//     const [result] = await db.promise().execute(query, [userId, customerId]);
//     return result;
//   }

//   static async updatePaymentMethodByCustomerId(customerId, paymentMethodId) {
//     const query = `
//       UPDATE wallet 
//       SET stripe_payment_method_id = ?
//       WHERE stripe_customer_id = ?
//     `;
//     const [result] = await db
//       .promise()
//       .execute(query, [paymentMethodId, customerId]);
//     return result;
//   }

//   static async updateAmongWallet(userId, among) {
//     const query = `
//     UPDATE wallet
// SET amount = amount + ?
// WHERE user_id = ? ;
//     `;
//     const [result] = await db.promise().execute(query, [among, userId]);
//     return result;
//   }
// }
// module.exports = PaymentModel;
