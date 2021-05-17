const uuid = require('uuid').v4
const aqp = require('api-query-params')
const transactionsRepository = require('../repositories/transactions-repository')
const moment = require('moment')

module.exports = new class TransactionsService {
  async create (body) {
    try {
      const newTransactions = []

      if (body.numberOfInstallments > 1) {
        const amountPerInstallment = Number((body.amount / body.numberOfInstallments).toFixed(2))

        for (let i = 0; i < body.numberOfInstallments; i++) {
          const newTransaction = {
            type: body.type,
            description: `${body.description} (${i + 1}/${body.numberOfInstallments})`,
            amount: amountPerInstallment,
            date: i === 0 ? body.date : moment(body.date, 'MM/DD/YYYY').add(i, body.installmentsPeriod),
            category: body.category,
            status: body.status,
            method: body.method,
            installmentsId: uuid(),
            numberOfInstallments: body.numberOfInstallments,
            installmentsTotal: body.amount
          }
          newTransactions.push(newTransaction)
        }
        const total = amountPerInstallment * body.numberOfInstallments
        if (total !== body.amount) {
          newTransactions[0].amount += Number((body.amount - total).toFixed(2))
        }
      } else {
        const newTransaction = {
          type: body.type,
          description: body.description,
          amount: body.amount,
          date: body.date,
          category: body.category,
          status: body.status,
          method: body.method
        }
        newTransactions.push(newTransaction)
      }

      const ticker = await transactionsRepository.insertMany(newTransactions)

      return ticker
    } catch (error) {
      throw error.message ? error.message : error
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
