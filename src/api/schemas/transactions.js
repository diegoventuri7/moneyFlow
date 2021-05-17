const mongoose = require('mongoose')

const transactionsSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ['INCOME', 'EXPENSE'] },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  category: { type: String, required: true, enum: ['HOME', 'INVESTMENTS', 'DONATION', 'SERVICES', 'OTHERS'] },
  status: { type: String, required: true, enum: ['PENDING', 'DONE'] },
  method: { type: String, required: true, enum: ['NUBANK', 'ITAU', 'MERCADO PAGO', 'PIC PAY', 'CASH'] },
  recurringTransactionId: { type: String },
  installmentsId: { type: String },
  numberOfInstallments: { type: Number, min: 1 },
  installmentsTotal: { type: Number }
})

transactionsSchema.index({ dueDate: 1 })

mongoose.model('Transactions', transactionsSchema)
module.exports = mongoose.model('Transactions')
