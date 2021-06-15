const mongoose = require('mongoose')
const transactionsEnum = require('../../config/enums.js').TRANSACTIONS

const transactionsSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: Object.values(transactionsEnum.TYPE) },
  description: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  date: { type: Date, required: true },
  category: { type: String, required: true, enum: Object.values(transactionsEnum.CATEGORY) },
  status: { type: String, required: true, enum: Object.values(transactionsEnum.STATUS) },
  method: { type: String, required: true, enum: Object.values(transactionsEnum.METHOD) },
  recurringTransactionId: { type: String },
  installmentsId: { type: String },
  numberOfInstallments: { type: Number, min: 2 },
  installmentsTotal: { type: Number }
}, { versionKey: false })

transactionsSchema.index({ dueDate: 1 })

mongoose.model('Transactions', transactionsSchema)
module.exports = mongoose.model('Transactions')
