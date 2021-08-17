const cron = require('node-cron')
const alertService = require('../api/services/alert-service.js')

module.exports = class Schedule {
  constructor () {
    this.tasks = []
  }

  async start () {
    console.log('Starting cronjobs...')

    this.tasks.push(
      cron.schedule('0 7 * * *', () => {
        console.log(new Date() + ' - Running alertService task - 0 7 * * *')
        alertService.run().catch(error => console.log(error))
      })
    )

    this.tasks.push(
      cron.schedule('0 14 * * *', () => {
        console.log(new Date() + ' - Running alertService task - 0 14 * * *')
        alertService.run().catch(error => console.log(error))
      })
    )
  }

  async stop () {
    this.tasks.forEach(task => {
      task.stop()
    })
  }
}
