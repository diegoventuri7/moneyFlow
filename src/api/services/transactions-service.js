const aqp = require('api-query-params')
const transactionsRepository = require('../repositories/transactions-repository')

module.exports = new class TransactionsService {
  async create (body) {
    try {
      const newTransaction = {
        type: body.type,
        description: body.description,
        amount: body.amount,
        dueDate: body.dueDate,
        category: body.category,
        status: body.status,
        paymentDate: body.paymentDate,
        paymentMethod: body.paymentMethod,
        recurringTransactionId: body.recurringTransactionId
      }

      const ticker = await transactionsRepository.create(newTransaction)

      return ticker
    } catch (error) {
      throw new Error(error)
    }
  }

  async list (query) {
    try {
      let { filter, skip = 0, limit = 50, sort = { ticker: 1 }, projection } = aqp(query, {
        skipKey: 'offset',
        whitelist: ['type', 'description', 'amount', 'dueDate', 'category', 'status', 'paymentDate', 'paymentMethod', 'recurringTransactionId']
      })

      if (limit > 100) limit = 100

      return await transactionsRepository.list(filter, projection, sort, skip, limit)
    } catch (error) {
      throw new Error(error)
    }
  }
}()
