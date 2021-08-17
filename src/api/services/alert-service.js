const moment = require('moment')
const transactionsRepository = require('../repositories/transactions-repository')
const enums = require('../../config/enums')
const slackService = require('./slack-service.js')
const sleep = require('../../utils/sleep.js')

module.exports = new class AlertService {
  async run () {
    try {
      const filter = {
        date: { $lt: moment().add(1, 'days').hour(0).minutes(0).seconds(0).milliseconds(0).toISOString() },
        status: enums.TRANSACTIONS.STATUS.PENDING
      }

      const transactions = await transactionsRepository.list(filter, null, { date: 1 })

      if (transactions.length > 0) {
        for (let i = 0; i < transactions.length; i++) {
          await slackService.sendAlert(transactions[i])
          await sleep(5)
        }
      }
    } catch (error) {
      throw error.message ? error.message : error
    }
  }
}()
