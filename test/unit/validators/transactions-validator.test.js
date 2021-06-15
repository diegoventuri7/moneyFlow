
const transactionsValidator = require('../../../src/api/validators/transactions-validator.js')
const check = require('./checks-validators.js')

describe('transactions-validator', function () {
  it('Check Type is required', check.ifStringFieldIsRequired(transactionsValidator.create, base(), 'type'))
  it('Check Type with invalid values', check.invalidValues(transactionsValidator.create, base(), 'type', ['FOO', 'income', 'expense', 'bar']))
  it('Check Type with valid values', check.allValidValues(transactionsValidator.create, base(), 'type', ['INCOME', 'EXPENSE']))

  it('Check Description is required', check.ifStringFieldIsRequired(transactionsValidator.create, base(), 'description'))
  it('Check Description with valid values', check.allValidValues(transactionsValidator.create, base(), 'description', ['Test description', '123456789']))

  it('Check Amount is required', check.ifNumberFieldIsRequired(transactionsValidator.create, base(), 'amount'))
  it('Check Amount min value', check.minValue(transactionsValidator.create, base(), 'amount', 0))

  it('Check Date is required', check.ifDateFieldIsRequired(transactionsValidator.create, base(), 'date'))
  it('Check Date with invalid values', check.invalidValues(transactionsValidator.create, base(), 'date', ['2020/55/66', '2021/01/01', '30/02/2021', '01-01-2020']))
  it('Check Date with valid values', check.allValidValues(transactionsValidator.create, base(), 'date', ['01/01/2020', '06/25/2021']))

  it('Check Category is required', check.ifStringFieldIsRequired(transactionsValidator.create, base(), 'category'))
  it('Check Category with invalid values', check.invalidValues(transactionsValidator.create, base(), 'category', ['FOO', 'home', 'expense', 'INCOME', '545']))
  it('Check Category with valid values', check.allValidValues(transactionsValidator.create, base(), 'category', ['HOME', 'INVESTMENTS', 'DONATION', 'SERVICES', 'OTHERS']))

  it('Check Status is required', check.ifStringFieldIsRequired(transactionsValidator.create, base(), 'status'))
  it('Check Status with invalid values', check.invalidValues(transactionsValidator.create, base(), 'status', ['FOO', 'done', 'DONATION', 'INCOME', '545']))
  it('Check Status with valid values', check.allValidValues(transactionsValidator.create, base(), 'status', ['PENDING', 'DONE']))

  it('Check Method is required', check.ifStringFieldIsRequired(transactionsValidator.create, base(), 'method'))
  it('Check Method with invalid values', check.invalidValues(transactionsValidator.create, base(), 'method', ['FOO', 'done', 'DONATION', '5456', 'cash']))
  it('Check Method with valid values', check.allValidValues(transactionsValidator.create, base(), 'method', ['NUBANK', 'ITAU', 'MERCADO PAGO', 'PIC PAY', 'CASH']))

  it('Check Number of Installments min value', check.minValue(transactionsValidator.create, base(), 'numberOfInstallments', 2))

  it('Check Installments Period with invalid values', check.invalidValues(transactionsValidator.create, base(), 'installmentsPeriod', ['FOO', 'done', 'MONTHS', 'INCOME', '545']))
  it('Check Installments Period with valid values', check.allValidValues(transactionsValidator.create, base(), 'installmentsPeriod', ['days', 'weeks', 'months', 'quarters', 'years']))
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
