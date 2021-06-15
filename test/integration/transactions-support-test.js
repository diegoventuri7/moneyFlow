const chai = require('chai')
chai.use(require('chai-datetime'))
const expect = chai.expect

const transactionsRepository = require('../../src/api/repositories/transactions-repository.js')

async function createGenericTransaction (app, base = {}) {
  const body = {
    type: base.hasOwnProperty('type') ? base.type : 'INCOME',
    description: base.hasOwnProperty('description') ? base.description : 'loan',
    amount: base.hasOwnProperty('amount') ? base.amount : 26,
    date: base.hasOwnProperty('date') ? base.date : '05/13/2021',
    category: base.hasOwnProperty('category') ? base.category : 'OTHERS',
    status: base.hasOwnProperty('status') ? base.status : 'PENDING',
    method: base.hasOwnProperty('method') ? base.method : 'ITAU'
  }
  const transaction = await chai.request(app).post('/api/transactions').send(body)
  return transaction.body
}

async function updateTransaction (app, transaciontId, updated) {
  const transaction = await chai.request(app).put('/api/transactions/' + transaciontId).send(updated)
  return transaction.body
}

async function checkTransactionDatabase (transaction) {
  const base = await transactionsRepository.getById(transaction._id)
  expect(base).to.be.a('object')
  expect(base.type).is.equal(transaction.type)
  expect(base.description).is.equal(transaction.description)
  expect(base.amount).is.equal(transaction.amount)
  expect(base.date).to.equalDate(new Date(transaction.date))
  expect(base.category).is.equal(transaction.category)
  expect(base.status).is.equal(transaction.status)
  expect(base.method).is.equal(transaction.method)
}

module.exports = { createGenericTransaction, updateTransaction, checkTransactionDatabase }
