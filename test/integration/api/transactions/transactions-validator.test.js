const chai = require('chai')
chai.use(require('chai-http'))
chai.use(require('chai-datetime'))
const expect = chai.expect
const _ = require('lodash')
const Server = require('../../../../src/loaders/server.js')
const DatabaseMock = require('../../../utils/database-mock.js')

describe.only('Endpoint-transactions-validator', function () {
  this.timeout(5000)

  before(async function () {
    const database = new DatabaseMock()
    this.server = new Server(database)

    await this.server.start()
    this.app = this.server.getApp()
  })

  after('Close server', async function () {
    // TODO check if database is empty
    await this.server.stop()
  })

  const checkValidator = (body, field, value, msg) => async function () {
    body[field] = value

    const res = await chai.request(this.app).post('/api/transactions').send(body)
    expect(res).to.have.status(422)
    expect(res.body).to.be.an('object')
    expect(new Date(res.body.date)).to.closeToTime(new Date(), 1)
    expect(res.body.errors).to.be.an('array').to.have.lengthOf(1)
    const expected = { msg, param: field, location: 'body' }
    if (value !== undefined) {
      expected.value = value
    }

    expect(res.body.errors[0]).to.include(expected)
  }

  it('Check empty Type', checkValidator(base(), 'type', '', 'Field is required'))
  it('Check null Type', checkValidator(base(), 'type', null, 'Field is required'))
  it('Check undefined Type', checkValidator(base(), 'type', undefined, 'Field is required'))
  it('Check invalid Type', checkValidator(base(), 'type', 'FOO', 'Invalid value'))
  it('Check invalid lowercase Type', checkValidator(base(), 'type', 'income', 'Invalid value'))

  function base () {
    return {
      type: 'INCOME',
      description: 'loan',
      amount: 26,
      date: '05-13-2021',
      category: 'OTHERS',
      status: 'PENDING',
      method: 'ITAU'
    }
  }
})
