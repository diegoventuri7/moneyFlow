const express = require('express')
const config = require('../config/config.js')
const expressLoader = require('./express.js')

module.exports = class Server {
  constructor (database) {
    this.server = null
    this.app = express()
    this.database = database
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
  }

  async stop () {
    await this.database.disconnect()
    await this.server.close()
  }

  getApp () {
    return this.app
  }
}
