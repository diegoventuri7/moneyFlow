const chai = require('chai')
chai.use(require('chai-http'))
const expect = chai.expect
const Server = require('../../src/loaders/server.js')
const DatabaseMock = require('../utils/database-mock.js')
const { createGenericTransaction } = require('./transactions-support-test.js')

describe('Endpoint-dashboard', function () {
  this.timeout(5000)
  let app

  before(async function () {
    this.database = new DatabaseMock()
    this.server = new Server(this.database)

    await this.server.start()
    app = this.server.getApp()
  })

  afterEach(async function () {
    await this.database.clean()
  })

  after('Close server', async function () {
    await this.server.stop()
  })

  it('Happy day: Create a spot income and resume', async function () {
    const transaction = await createGenericTransaction(app)

    await checkResponse({ month: '01', year: '2021' }, [])
    await checkResponse({ month: '05', year: '2021' }, transaction)
  })

  it('Happy day: Create a recurring expense and resume', async function () {
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

    const res = await chai.request(app).post('/api/recurring-transactions').send(body)
    expect(res).to.have.status(201)

    await checkResponse({ month: '05', year: '2021' }, [])

    let expected = [{
      type: 'EXPENSE',
      description: 'Clean - 07/21',
      amount: 90,
      date: '2021-07-02T03:00:00.000Z',
      category: 'HOME',
      method: 'CASH',
      recurringTransactionId: '60c8ef291ded5016b4543f3c',
      status: 'PENDING'
    },
    {
      type: 'EXPENSE',
      description: 'Clean - 07/21',
      amount: 90,
      date: '2021-07-09T03:00:00.000Z',
      category: 'HOME',
      method: 'CASH',
      recurringTransactionId: '60c8ef291ded5016b4543f3c',
      status: 'PENDING'
    },
    {
      type: 'EXPENSE',
      description: 'Clean - 07/21',
      amount: 90,
      date: '2021-07-16T03:00:00.000Z',
      category: 'HOME',
      method: 'CASH',
      recurringTransactionId: '60c8ef291ded5016b4543f3c',
      status: 'PENDING'
    },
    {
      type: 'EXPENSE',
      description: 'Clean - 07/21',
      amount: 90,
      date: '2021-07-23T03:00:00.000Z',
      category: 'HOME',
      method: 'CASH',
      recurringTransactionId: '60c8ef291ded5016b4543f3c',
      status: 'PENDING'
    },
    {
      type: 'EXPENSE',
      description: 'Clean - 07/21',
      amount: 90,
      date: '2021-07-30T03:00:00.000Z',
      category: 'HOME',
      method: 'CASH',
      recurringTransactionId: '60c8ef291ded5016b4543f3c',
      status: 'PENDING'
    }]

    await checkResponse({ month: '07', year: '2021' }, expected)

    expected = [{
      type: 'EXPENSE',
      description: 'Clean - 09/21',
      amount: 90,
      date: '2021-09-03T03:00:00.000Z',
      category: 'HOME',
      method: 'CASH',
      recurringTransactionId: '60c8ef291ded5016b4543f3c',
      status: 'PENDING'
    },
    {
      type: 'EXPENSE',
      description: 'Clean - 09/21',
      amount: 90,
      date: '2021-09-10T03:00:00.000Z',
      category: 'HOME',
      method: 'CASH',
      recurringTransactionId: '60c8ef291ded5016b4543f3c',
      status: 'PENDING'
    },
    {
      type: 'EXPENSE',
      description: 'Clean - 09/21',
      amount: 90,
      date: '2021-09-17T03:00:00.000Z',
      category: 'HOME',
      method: 'CASH',
      recurringTransactionId: '60c8ef291ded5016b4543f3c',
      status: 'PENDING'
    },
    {
      type: 'EXPENSE',
      description: 'Clean - 09/21',
      amount: 90,
      date: '2021-09-24T03:00:00.000Z',
      category: 'HOME',
      method: 'CASH',
      recurringTransactionId: '60c8ef291ded5016b4543f3c',
      status: 'PENDING'
    }]
    await checkResponse({ month: '09', year: '2021' }, expected)
    await checkResponse({ month: '09', year: '2021' }, expected)
  })

  async function checkResponse (params, expected) {
    const res = await chai.request(app).get('/api/resume').query(params)
    expect(res).to.have.status(200)
    expect(res.body).to.be.an('array').to.have.lengthOf(expected.length)

    for (let i = 0; i < expected.length; i++) {
      expect(res.body[i]).to.have.property('type').to.equal(expected[i].type)
      expect(res.body[i]).to.have.property('description').to.equal(expected[i].description)
      expect(res.body[i]).to.have.property('amount').to.equal(expected[i].amount)
      expect(res.body[i]).to.have.property('date').to.equal(expected[i].date)
      expect(res.body[i]).to.have.property('category').to.equal(expected[i].category)
      expect(res.body[i]).to.have.property('status').to.equal(expected[i].status)
      expect(res.body[i]).to.have.property('method').to.equal(expected[i].method)
    }
  }
})
