const chai = require('chai')
chai.use(require('chai-http'))
const expect = chai.expect
const Server = require('../../src/loaders/server.js')
const DatabaseMock = require('../utils/database-mock.js')
const { createGenericTransaction, updateTransaction } = require('./transactions-support-test.js')

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
    const expected = {
      transactions: transaction,
      balance: {
        totalIncome: 26,
        totalExpense: 0,
        totalPendingIncome: 26,
        totalPendingExpense: 0
      }
    }

    await checkResponseEmpty({ month: '01', year: '2021' })
    await checkResponse({ month: '05', year: '2021' }, expected)
  })

  it('Happy day: Create a spot expense, update and resume', async function () {
    const transaction = await createGenericTransaction(app, { type: 'EXPENSE', amount: 100, date: '08/15/2021' })
    let expected = {
      transactions: transaction,
      balance: {
        totalIncome: 0,
        totalExpense: 100,
        totalPendingIncome: 0,
        totalPendingExpense: 100
      }
    }

    await checkResponseEmpty({ month: '07', year: '2021' })
    await checkResponse({ month: '08', year: '2021' }, expected)

    await updateTransaction(app, transaction[0]._id, { status: 'DONE' })

    expected = {
      transactions: [{ ...transaction, status: 'DONE' }],
      balance: {
        totalIncome: 0,
        totalExpense: 100,
        totalPendingIncome: 0,
        totalPendingExpense: 0
      }
    }
    await checkResponse({ month: '08', year: '2021' }, expected)
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

    await checkResponseEmpty({ month: '05', year: '2021' })

    let expected = {
      transactions: [{
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
      }],
      balance: {
        totalIncome: 0,
        totalExpense: 450,
        totalPendingIncome: 0,
        totalPendingExpense: 450
      }
    }

    await checkResponse({ month: '07', year: '2021' }, expected)

    expected = {
      transactions: [{
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
      }],
      balance: {
        totalIncome: 0,
        totalExpense: 360,
        totalPendingIncome: 0,
        totalPendingExpense: 360
      }
    }
    await checkResponse({ month: '09', year: '2021' }, expected)
    await checkResponse({ month: '09', year: '2021' }, expected)
  })

  async function checkResponse (params, expected) {
    const res = await chai.request(app).get('/api/resume').query(params)
    expect(res).to.have.status(200)
    expect(res.body).to.have.property('transactions').to.have.lengthOf(expected.transactions.length)
    expect(res.body).to.have.property('balance')
    expect(res.body.balance).to.have.property('totalIncome').to.equal(expected.balance.totalIncome)
    expect(res.body.balance).to.have.property('totalExpense').to.equal(expected.balance.totalExpense)
    expect(res.body.balance).to.have.property('totalPendingIncome').to.equal(expected.balance.totalPendingIncome)
    expect(res.body.balance).to.have.property('totalPendingExpense').to.equal(expected.balance.totalPendingExpense)

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

  async function checkResponseEmpty (params) {
    const res = await chai.request(app).get('/api/resume').query(params)
    expect(res).to.have.status(200)
    expect(res.body).to.have.property('transactions').to.have.lengthOf(0)
    expect(res.body).to.have.property('balance')
    expect(res.body.balance).to.have.property('totalIncome').to.equal(0)
    expect(res.body.balance).to.have.property('totalExpense').to.equal(0)
    expect(res.body.balance).to.have.property('totalPendingIncome').to.equal(0)
    expect(res.body.balance).to.have.property('totalPendingExpense').to.equal(0)
  }
})
