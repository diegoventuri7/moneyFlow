const mongoose = require('mongoose')
const transactionsEnum = require('../../config/enums.js').TRANSACTIONS

const recurringTransactionsSchema = new mongoose.Schema({
  startDate: { type: Date, required: true },
  nextDate: { type: Date, required: true },
  endDate: { type: Date },
  type: { type: String, required: true, enum: Object.values(transactionsEnum.TYPE) },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true, enum: Object.values(transactionsEnum.CATEGORY) },
  method: { type: String, required: true, enum: Object.values(transactionsEnum.METHOD) },
  eachAmount: { type: Number, required: true, min: 1 },
  eachPeriod: { type: String, required: true, enum: Object.values(transactionsEnum.EACH_PERIOD) }
}, { versionKey: false })

recurringTransactionsSchema.index({ dueDate: 1 })

mongoose.model('RecurringTransactions', recurringTransactionsSchema)
module.exports = mongoose.model('RecurringTransactions')
