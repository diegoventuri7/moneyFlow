const moment = require('moment')
const transactionsRepository = require('../repositories/transactions-repository')
const recurringTransactionsService = require('./recurring-transactions-service.js')
const _ = require('lodash')
const enums = require('../../config/enums')
module.exports = new class DashboardService {
  async resume (params) {
    try {
      const startDate = moment(`01/${params.month}/${params.year}`, 'DD/MM/YYYY')
      const endDate = startDate.clone().endOf('month')

      await recurringTransactionsService.createNewTransactions(startDate, endDate)

      const filter = {
        date: { $gte: startDate, $lte: endDate }
      }
      const transactions = await transactionsRepository.list(filter, null, { date: 1 })

      const response = {
        transactions: transactions,
        balance: returnBalance(transactions)
      }

      return response
    } catch (error) {
      throw error.message ? error.message : error
    }
  }
}()

function returnBalance (transactions) {
  const balance = {
    totalIncome: _.sumBy(transactions, (el) => { return el.type === enums.TRANSACTIONS.TYPE.INCOME ? el.amount : 0 }),
    totalExpense: _.sumBy(transactions, (el) => { return el.type === enums.TRANSACTIONS.TYPE.EXPENSE ? el.amount : 0 }),
    totalPendingIncome: _.sumBy(transactions, (el) => { return el.type === enums.TRANSACTIONS.TYPE.INCOME && el.status === enums.TRANSACTIONS.STATUS.PENDING ? el.amount : 0 }),
    totalPendingExpense: _.sumBy(transactions, (el) => { return el.type === enums.TRANSACTIONS.TYPE.EXPENSE && el.status === enums.TRANSACTIONS.STATUS.PENDING ? el.amount : 0 })
  }
  return balance
}
