const aqp = require('api-query-params')
const moment = require('moment')
const recurringTransactionsRepository = require('../repositories/recurring-transactions-repository')
const transactionsRepository = require('../repositories/transactions-repository')
module.exports = new class RecurringTransactionsService {
  async create (body) {
    try {
      const newRecurringTransaction = {
        startDate: moment(body.startDate, 'MM/DD/YYYY'),
        nextDate: moment(body.startDate, 'MM/DD/YYYY'),
        type: body.type,
        description: body.description,
        amount: body.amount,
        category: body.category,
        method: body.method,
        eachAmount: body.eachAmount,
        eachPeriod: body.eachPeriod
      }

      const ticker = await recurringTransactionsRepository.create(newRecurringTransaction)

      return ticker
    } catch (error) {
      throw error.message ? error.message : error
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
      throw error.message ? error.message : error
    }
  }

  async createNewTransactions (startDate, endDate) {
    const filter = {
      nextDate: { $lte: endDate },
      $or: [{ endDate: { $exists: false } }, { endDate: { $gt: startDate } }]
    }
    const recurringTransactions = await recurringTransactionsRepository.list(filter, null, { nextDate: 1 })

    for (let i = 0; i < recurringTransactions.length; i++) {
      const el = recurringTransactions[i]
      const newTransactions = []

      while (el.nextDate <= endDate) {
        const newTransaction = {
          type: el.type,
          description: `${el.description} - ${moment(el.nextDate).format('MM/YY')}`,
          amount: el.amount,
          date: el.nextDate,
          category: el.category,
          method: el.method,
          recurringTransactionId: el._id,
          status: 'PENDING'
        }
        newTransactions.push(newTransaction)
        el.nextDate = moment(el.nextDate).add(el.eachAmount, el.eachPeriod)
      }

      await transactionsRepository.insertMany(newTransactions)
      await recurringTransactionsRepository.update(el._id, { nextDate: el.nextDate })
    }
  }
}()
