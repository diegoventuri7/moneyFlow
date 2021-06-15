const mongoose = require('mongoose')
const config = require('../config/config.js')

module.exports = class Database {
  constructor () {
    this.connection = null
    this.stringConnection = config.db.STRING_CONNECTION_DB
  }

  async connect () {
    this.connection = await mongoose.connect(this.stringConnection, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    })
  }

  async disconnect () {
    await mongoose.disconnect()
  }
}
