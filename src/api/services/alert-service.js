const moment = require('moment')
const transactionsRepository = require('../repositories/transactions-repository')
const enums = require('../../config/enums')
const slackService = require('./slack-service.js')

module.exports = new class AlertService {
  async run () {
    try {
      const filter = {
        date: { $lt: moment().add(1, 'days') },
        status: enums.TRANSACTIONS.STATUS.PENDING
      }
      const transactions = await transactionsRepository.list(filter, null, { date: 1 })

      if (transactions.length > 0) {
        for (let i = 0; i < transactions.length; i++) {
          await slackService.sendAlert(transactions[i])
        }
      }
    } catch (error) {
      throw error.message ? error.message : error
    }
  }
}()
