const chai = require('chai')
chai.use(require('chai-http'))
chai.use(require('chai-datetime'))
const expect = chai.expect
const _ = require('lodash')
const Server = require('../../src/loaders/server.js')
const DatabaseMock = require('../utils/database-mock.js')
const { checkTransactionDatabase, createGenericTransaction } = require('./transactions-support-test.js')

describe('Endpoint-dashboard', function () {
  this.timeout(5000)
  let app

  before(async function () {
    const database = new DatabaseMock()
    this.server = new Server(database)

    await this.server.start()
    app = this.server.getApp()
  })

  after('Close server', async function () {
    await this.server.stop()
  })

  it('Happy day: Create a spot income', async function () {
    const transaction = await createGenericTransaction(app)

    await checkResponse({ month: '01', year: '2021' }, [])
    await checkResponse({ month: '05', year: '2021' }, transaction)
  })

  async function checkResponse (params, expected) {
    const res = await chai.request(app).get('/api/resume').query(params)
    expect(res).to.have.status(200)
    expect(res.body).to.be.an('array').to.have.lengthOf(expected.length)

    if (expected.length > 0) {
      expect(res.body[0]).to.have.property('_id').to.equal(expected[0]._id)
      expect(res.body[0]).to.have.property('type').to.equal(expected[0].type)
      expect(res.body[0]).to.have.property('description').to.equal(expected[0].description)
      expect(res.body[0]).to.have.property('amount').to.equal(expected[0].amount)
      expect(res.body[0]).to.have.property('date').to.equal(expected[0].date)
      expect(res.body[0]).to.have.property('category').to.equal(expected[0].category)
      expect(res.body[0]).to.have.property('status').to.equal(expected[0].status)
      expect(res.body[0]).to.have.property('method').to.equal(expected[0].method)
    }
  }
})
