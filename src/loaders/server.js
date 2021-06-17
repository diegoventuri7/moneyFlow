const express = require('express')
const config = require('../config/config.js')
const expressLoader = require('./express.js')

module.exports = class Server {
  constructor (database, schedule) {
    this.server = null
    this.app = express()
    this.database = database
    this.schedule = schedule
  }

  async start () {
    await this.database.connect()
    expressLoader({ app: this.app })

    this.app.disable('x-powered-by')

    this.server = this.app.listen(config.express.PORT, err => {
      if (err) {
        console.log(err)
        return
      }
      console.log(`Server started on ${config.express.PORT} port`)
    })
    if (this.schedule) {
      await this.schedule.start()
    }
  }

  async stop () {
    if (this.schedule) {
      await this.schedule.stop()
    }
    await this.database.disconnect()
    await this.server.close()
  }

  getApp () {
    return this.app
  }
}
