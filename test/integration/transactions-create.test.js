const chai = require('chai')
chai.use(require('chai-http'))
chai.use(require('chai-datetime'))
const expect = chai.expect
const _ = require('lodash')
const Server = require('../../src/loaders/server.js')
const DatabaseMock = require('../utils/database-mock.js')
const { checkTransactionDatabase } = require('./transactions-support-test.js')

describe('Endpoint-transactions-create', function () {
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

  it('Happy day: Create a spot income', async function () {
    const body = {
      type: 'INCOME',
      description: 'loan',
      amount: 26,
      date: '05/13/2021',
      category: 'OTHERS',
      status: 'PENDING',
      method: 'ITAU'
    }

    const res = await chai.request(this.app).post('/api/transactions').send(body)
    expect(res).to.have.status(201)
    expect(res.body).to.be.an('array').to.have.lengthOf(1)
    await checkTransactionResponse(res.body[0], body)
  })

  it('Happy day: Create a spot expense', async function () {
    const body = {
      type: 'EXPENSE',
      description: 'Energy bill',
      amount: 199.65,
      date: '09/25/2021',
      category: 'HOME',
      status: 'DONE',
      method: 'MERCADO PAGO'
    }

    const res = await chai.request(this.app).post('/api/transactions').send(body)
    expect(res).to.have.status(201)
    expect(res.body).to.be.an('array').to.have.lengthOf(1)
    await checkTransactionResponse(res.body[0], body)
  })

  it('Happy day: Create a installment income', async function () {
    const body = {
      type: 'INCOME',
      description: 'loan 3x',
      amount: 100,
      date: '06/18/2021',
      category: 'SERVICES',
      status: 'PENDING',
      method: 'NUBANK',
      numberOfInstallments: 3,
      installmentsPeriod: 'months'
    }

    const res = await chai.request(this.app).post('/api/transactions').send(body)
    expect(res).to.have.status(201)
    expect(res.body).to.be.an('array').to.have.lengthOf(3)
    expect(Object.values(_.countBy(res.body, 'installmentsId'))[0]).to.equal(3)
    await checkTransactionResponse(res.body[0], { ...body, description: 'loan 3x (1/3)', amount: 33.34, installmentsTotal: body.amount })
    await checkTransactionResponse(res.body[1], { ...body, date: '07/18/2021', description: 'loan 3x (2/3)', amount: 33.33, installmentsTotal: body.amount })
    await checkTransactionResponse(res.body[2], { ...body, date: '08/18/2021', description: 'loan 3x (3/3)', amount: 33.33, installmentsTotal: body.amount })
  })

  it('Happy day: Create a installment expense', async function () {
    const body = {
      type: 'EXPENSE',
      description: 'Fly Tickets',
      amount: 4444,
      date: '11/05/2021',
      category: 'OTHERS',
      status: 'PENDING',
      method: 'ITAU',
      numberOfInstallments: 5,
      installmentsPeriod: 'months'
    }

    const res = await chai.request(this.app).post('/api/transactions').send(body)
    expect(res).to.have.status(201)
    expect(res.body).to.be.an('array').to.have.lengthOf(5)
    expect(Object.values(_.countBy(res.body, 'installmentsId'))[0]).to.equal(5)
    await checkTransactionResponse(res.body[0], { ...body, description: 'Fly Tickets (1/5)', amount: 888.80, installmentsTotal: body.amount })
    await checkTransactionResponse(res.body[1], { ...body, date: '12-05-2021', description: 'Fly Tickets (2/5)', amount: 888.80, installmentsTotal: body.amount })
    await checkTransactionResponse(res.body[2], { ...body, date: '01-05-2022', description: 'Fly Tickets (3/5)', amount: 888.80, installmentsTotal: body.amount })
    await checkTransactionResponse(res.body[3], { ...body, date: '02-05-2022', description: 'Fly Tickets (4/5)', amount: 888.80, installmentsTotal: body.amount })
    await checkTransactionResponse(res.body[4], { ...body, date: '03-05-2022', description: 'Fly Tickets (5/5)', amount: 888.80, installmentsTotal: body.amount })
  })

  async function checkTransactionResponse (response, check) {
    expect(response.type).is.equal(check.type)
    expect(response.description).is.equal(check.description)
    expect(response.amount).is.equal(check.amount)
    expect(new Date(response.date)).to.equalDate(new Date(check.date))
    expect(response.category).is.equal(check.category)
    expect(response.status).is.equal(check.status)
    expect(response.method).is.equal(check.method)

    if (check.numberOfInstallments > 0) {
      expect(response.numberOfInstallments).is.equal(check.numberOfInstallments)
      expect(response.installmentsTotal).is.equal(check.installmentsTotal)
    }
    await checkTransactionDatabase(response)
  }
})
