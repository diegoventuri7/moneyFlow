const moment = require('moment')
const transactionsRepository = require('../repositories/transactions-repository')
const recurringTransactionsService = require('./recurring-transactions-service.js')

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

      return transactions
    } catch (error) {
      throw error.message ? error.message : error
    }
  }
}()
