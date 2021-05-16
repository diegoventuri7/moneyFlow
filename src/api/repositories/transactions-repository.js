const mongoose = require('mongoose')
const transactions = require('../schemas/transactions.js')

module.exports = new class TransactionsRepository {
  getById (id) {
    return transactions.findById(id).lean()
  }

  getOne (filters) {
    return transactions.findOne(filters).lean()
  }

  list (filters, selectFields, sort, offset, limit) {
    return transactions.find(filters).select(selectFields).sort(sort).skip(offset).limit(limit).lean()
  }

  getCount (filters) {
    return transactions.find(filters).countDocuments()
  }

  create (transaction) {
    return transactions.create(transaction)
  }

  insertMany (transactionsNew) {
    return transactions.insertMany(transactionsNew)
  }

  update (id, transaction) {
    return transactions.findByIdAndUpdate(id, transaction, { new: true })
  }

  updateOneByFilter (filters, transaction) {
    return transactions.findOneAndUpdate(filters, transaction, { lean: true })
  }

  updateByFilter (filters, updated) {
    return transactions.updateMany(filters, updated, { lean: true, multi: true })
  }

  deleteOne (id) {
    return transactions.deleteOne({ _id: id }).exec()
  }

  deleteMany (filters) {
    return transactions.deleteMany(filters)
  }
}()
