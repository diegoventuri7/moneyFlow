const mongoose = require('mongoose')
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer
const transactionsRepository = require('../../src/api/repositories/transactions-repository.js')
const recurringTransactionsRepository = require('../../src/api/repositories/recurring-transactions-repository.js')

module.exports = class DatabaseMock {
  constructor () {
    this.mongoServer = new MongoMemoryServer()
  }

  async connect () {
    const stringConnection = await this.mongoServer.getUri()

    await mongoose.connect(stringConnection, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    })
  }

  async disconnect () {
    await mongoose.disconnect()
    await this.mongoServer.stop()
  }

  async clean () {
    await transactionsRepository.deleteMany()
    await recurringTransactionsRepository.deleteMany()
  }
}
