// const mongoose = require("mongoose");

// const transactionSchema = new mongoose.Schema({
//   paymentIntentId: String,
//   amount: Number,
//   currency: String,
//   status: String,
//   email: String,
//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model("Transaction", transactionSchema);

const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  sessionId: String,
  email: String,
  amount: Number,
  currency: String,
  status: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Transaction", schema);
