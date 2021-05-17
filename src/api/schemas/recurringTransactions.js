const mongoose = require('mongoose')

const recurringTransactionsSchema = new mongoose.Schema({
  startDate: { type: Date, required: true },
  nextDate: { type: Date, required: true },
  endDate: { type: Date },
  type: { type: String, required: true, enum: ['INCOME', 'EXPENSE'] },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true, enum: ['HOME', 'INVESTMENTS', 'DONATION', 'SERVICES', 'OTHERS'] },
  method: { type: String, required: true, enum: ['NUBANK', 'ITAU', 'MERCADO PAGO', 'PIC PAY', 'CASH'] },
  eachAmount: { type: Number, required: true, min: 1 },
  eachPeriod: { type: String, required: true, enum: ['days', 'weeks', 'months', 'quarters', 'years'] }
})

recurringTransactionsSchema.index({ dueDate: 1 })

mongoose.model('RecurringTransactions', recurringTransactionsSchema)
module.exports = mongoose.model('RecurringTransactions')
