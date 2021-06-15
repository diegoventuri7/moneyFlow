const chai = require('chai')
chai.use(require('chai-http'))
const expect = chai.expect
const Server = require('../../src/loaders/server.js')
const DatabaseMock = require('../utils/database-mock.js')

describe('Endpoint-recurring-transactions-create', function () {
  this.timeout(5000)

  before(async function () {
    const database = new DatabaseMock()
    this.server = new Server(database)

    await this.server.start()
    this.app = this.server.getApp()
  })

  after('Close server', async function () {
    await this.server.stop()
  })

  it('Happy day: Create a recurring income', async function () {
    const body = {
      startDate: '07/05/2021',
      type: 'INCOME',
      description: 'Salary',
      amount: 1000.59,
      category: 'OTHERS',
      method: 'ITAU',
      eachAmount: 1,
      eachPeriod: 'months'
    }

    const res = await chai.request(this.app).post('/api/recurring-transactions').send(body)
    expect(res).to.have.status(201)
    await checkTransactionResponse(res.body, { ...body, startDate: '2021-07-05T03:00:00.000Z' })
  })

  it('Happy day: Create a recurring expense', async function () {
    const body = {
      startDate: '07/02/2021',
      type: 'EXPENSE',
      description: 'Clean',
      amount: 90,
      category: 'HOME',
      method: 'CASH',
      eachAmount: 1,
      eachPeriod: 'weeks'
    }

    const res = await chai.request(this.app).post('/api/recurring-transactions').send(body)
    expect(res).to.have.status(201)
    await checkTransactionResponse(res.body, { ...body, startDate: '2021-07-02T03:00:00.000Z' })
  })

  async function checkTransactionResponse (response, check) {
    expect(response.startDate).to.equal(check.startDate)
    expect(response.nextDate).to.equal(check.startDate)
    expect(response.type).is.equal(check.type)
    expect(response.description).is.equal(check.description)
    expect(response.amount).is.equal(check.amount)
    expect(response.category).is.equal(check.category)
    expect(response.method).is.equal(check.method)
    expect(response.eachAmount).is.equal(check.eachAmount)
    expect(response.eachPeriod).is.equal(check.eachPeriod)
  }
})
