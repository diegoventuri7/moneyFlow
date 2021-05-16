const mongoose = require('mongoose')
const recurringTransactions = require('../schemas/recurringTransactions.js')

module.exports = new class RecurringTransactionsRepository {
  getById (id) {
    return recurringTransactions.findById(id).lean()
  }

  getOne (filters) {
    return recurringTransactions.findOne(filters).lean()
  }

  list (filters, selectFields, sort, offset, limit) {
    return recurringTransactions.find(filters).select(selectFields).sort(sort).skip(offset).limit(limit).lean()
  }

  getCount (filters) {
    return recurringTransactions.find(filters).countDocuments()
  }

  create (recurringTransaction) {
    return recurringTransactions.create(recurringTransaction)
  }

  insertMany (recurringTransactionsNew) {
    return recurringTransactions.insertMany(recurringTransactionsNew)
  }

  update (id, recurringTransaction) {
    return recurringTransactions.findByIdAndUpdate(id, recurringTransaction, { new: true })
  }

  updateOneByFilter (filters, recurringTransaction) {
    return recurringTransactions.findOneAndUpdate(filters, recurringTransaction, { lean: true })
  }

  updateByFilter (filters, updated) {
    return recurringTransactions.updateMany(filters, updated, { lean: true, multi: true })
  }

  deleteOne (id) {
    return recurringTransactions.deleteOne({ _id: id }).exec()
  }

  deleteMany (filters) {
    return recurringTransactions.deleteMany(filters)
  }
}()
