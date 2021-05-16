const chai = require('chai')
const chaiHttp = require('chai-http')
const Server = require('../../../../src/loaders/server.js')
const DatabaseMock = require('../../../utils/database-mock.js')
const expect = chai.expect
chai.use(chaiHttp)

describe('Endpoint-transactions-create', function () {
  this.timeout(5000)
  let app, server

  before(async function () {
    const database = new DatabaseMock()
    server = new Server(database)

    await server.start()
    app = server.getApp()
  })

  it('Happy day: Create a transaction', function (done) {
    const body = {
      type: 'INCOME',
      description: 'Salário',
      amount: 1815,
      dueDate: '05-02-2021',
      category: 'OTHERS',
      status: 'PENDING',
      paymentDate: '05-02-2021',
      paymentMethod: 'ITAU',
      recurringTransactionId: null
    }

    chai.request(app)
      .post('/api/transactions')
      .send(body)
      .end(function (err, res) {
        expect(err).is.equal(null)
        expect(res).to.have.status(201)
        console.log(res.body)
        done()
      })
  })

  // it('Happy day: Get a ticker', function (done) {
  //   chai.request(app)
  //     .get('/api/tickers')
  //     .query({ ticker: TICKERS[0].ticker })
  //     .end(function (err, res) {
  //       expect(err).is.equal(null)
  //       expect(res).to.have.status(200)
  //       console.log(JSON.stringify(res, null, 3))
  //       done()
  //     })
  // })

  // it('Happy day: Quote a ticker', function (done) {
  //   chai.request(app)
  //     .get('/api/tickers/quote')
  //     .query({ tickers: 'IAU' })
  //     .end(function (err, res) {
  //       expect(err).is.equal(null)
  //       expect(res).to.have.status(200)
  //       const body = JSON.parse(res.text)
  //       console.log(JSON.stringify(body, null, 3))
  //       done()
  //     })
  // })

  after('Close server', async function () {
    await server.stop()
  })
})
