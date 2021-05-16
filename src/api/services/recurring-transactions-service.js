const aqp = require('api-query-params')
const recurringTransactionsRepository = require('../repositories/recurring-transactions-repository')

module.exports = new class RecurringTransactionsService {
  async create (body) {
    try {
      const newRecurringTransaction = {
        startDate: body.startDate,
        nextDate: body.startDate,
        type: body.type,
        description: body.description,
        amount: body.amount,
        category: body.category,
        paymentMethod: body.paymentMethod,
        eachAmount: body.eachAmount,
        eachPeriod: body.eachPeriod
      }

      const ticker = await recurringTransactionsRepository.create(newRecurringTransaction)

      return ticker
    } catch (error) {
      throw new Error(error)
    }
  }

  async list (query) {
    try {
      let { filter, skip = 0, limit = 50, sort = { ticker: 1 }, projection } = aqp(query, {
        skipKey: 'offset',
        whitelist: ['startDate', 'nextDate', 'endDate', 'type', 'description', 'amount', 'category', 'paymentMethod', 'eachAmount', 'eachPeriod']
      })

      if (limit > 100) limit = 100

      return await recurringTransactionsRepository.list(filter, projection, sort, skip, limit)
    } catch (error) {
      throw new Error(error)
    }
  }
}()
