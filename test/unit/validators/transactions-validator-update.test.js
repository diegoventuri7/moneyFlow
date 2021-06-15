
const transactionsValidator = require('../../../src/api/validators/transactions-validator.js')
const check = require('./checks-validators.js')

describe('transactions-validator-update', function () {
  it('Check Type with invalid values', check.invalidValues(transactionsValidator.update, base(), 'type', ['FOO', 'income', 'expense', 'bar']))
  it('Check Type with valid values', check.allValidValues(transactionsValidator.update, base(), 'type', ['INCOME', 'EXPENSE']))

  it('Check Amount min value', check.minValue(transactionsValidator.update, base(), 'amount', 0))

  it('Check Date with invalid values', check.invalidValues(transactionsValidator.update, base(), 'date', ['2020/55/66', '2021/01/01', '30/02/2021', '01-01-2020']))
  it('Check Date with valid values', check.allValidValues(transactionsValidator.update, base(), 'date', ['01/01/2020', '06/25/2021']))

  it('Check Category with invalid values', check.invalidValues(transactionsValidator.update, base(), 'category', ['FOO', 'home', 'expense', 'INCOME', '545']))
  it('Check Category with valid values', check.allValidValues(transactionsValidator.update, base(), 'category', ['HOME', 'INVESTMENTS', 'DONATION', 'SERVICES', 'OTHERS']))

  it('Check Status with invalid values', check.invalidValues(transactionsValidator.update, base(), 'status', ['FOO', 'done', 'DONATION', 'INCOME', '545']))
  it('Check Status with valid values', check.allValidValues(transactionsValidator.update, base(), 'status', ['PENDING', 'DONE']))

  it('Check Method with invalid values', check.invalidValues(transactionsValidator.update, base(), 'method', ['FOO', 'done', 'DONATION', '5456', 'cash']))
  it('Check Method with valid values', check.allValidValues(transactionsValidator.update, base(), 'method', ['NUBANK', 'ITAU', 'MERCADO PAGO', 'PIC PAY', 'CASH']))
})

function base () {
  return {
    type: 'INCOME',
    description: 'loan',
    amount: 26,
    date: '06/25/2021',
    category: 'OTHERS',
    status: 'PENDING',
    method: 'ITAU'
  }
}
