const chai = require('chai')
chai.use(require('chai-datetime'))
const expect = chai.expect

const transactionsRepository = require('../../../../src/api/repositories/transactions-repository.js')

function createGenericTransaction (base = {}) {
  const transaction = {

  }
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

module.exports = { createGenericTransaction, checkTransactionDatabase }
