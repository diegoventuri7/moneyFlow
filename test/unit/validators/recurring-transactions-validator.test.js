
const recurringTransactionsValidator = require('../../../src/api/validators/recurring-transactions-validator.js')
const check = require('./checks-validators.js')

describe.only('recurring-transactions-validator', function () {
  it('Check Start Date is required', check.ifDateFieldIsRequired(recurringTransactionsValidator.create, base(), 'startDate'))
  it('Check Start Date with invalid values', check.invalidValues(recurringTransactionsValidator.create, base(), 'startDate', ['2020/55/66', '2021/01/01', '30/02/2021', '01-01-2020']))
  it('Check Start Date with valid values', check.allValidValues(recurringTransactionsValidator.create, base(), 'startDate', ['01/01/2020', '06/25/2021']))

  it('Check Type is required', check.ifStringFieldIsRequired(recurringTransactionsValidator.create, base(), 'type'))
  it('Check Type with invalid values', check.invalidValues(recurringTransactionsValidator.create, base(), 'type', ['FOO', 'income', 'expense', 'bar']))
  it('Check Type with valid values', check.allValidValues(recurringTransactionsValidator.create, base(), 'type', ['INCOME', 'EXPENSE']))

  it('Check Description is required', check.ifStringFieldIsRequired(recurringTransactionsValidator.create, base(), 'description'))
  it('Check Description with valid values', check.allValidValues(recurringTransactionsValidator.create, base(), 'description', ['Test description', '123456789']))

  it('Check Amount is required', check.ifNumberFieldIsRequired(recurringTransactionsValidator.create, base(), 'amount'))
  it('Check Amount min value', check.minValue(recurringTransactionsValidator.create, base(), 'amount', 0))

  it('Check Category is required', check.ifStringFieldIsRequired(recurringTransactionsValidator.create, base(), 'category'))
  it('Check Category with invalid values', check.invalidValues(recurringTransactionsValidator.create, base(), 'category', ['FOO', 'home', 'expense', 'INCOME', '545']))
  it('Check Category with valid values', check.allValidValues(recurringTransactionsValidator.create, base(), 'category', ['HOME', 'INVESTMENTS', 'DONATION', 'SERVICES', 'OTHERS']))

  it('Check Method is required', check.ifStringFieldIsRequired(recurringTransactionsValidator.create, base(), 'method'))
  it('Check Method with invalid values', check.invalidValues(recurringTransactionsValidator.create, base(), 'method', ['FOO', 'done', 'DONATION', '5456', 'cash']))
  it('Check Method with valid values', check.allValidValues(recurringTransactionsValidator.create, base(), 'method', ['NUBANK', 'ITAU', 'MERCADO PAGO', 'PIC PAY', 'CASH']))

  it('Check Each Amount is required', check.ifNumberFieldIsRequired(recurringTransactionsValidator.create, base(), 'eachAmount'))
  it('Check Each Amount min value', check.minValue(recurringTransactionsValidator.create, base(), 'eachAmount', 1))

  it('Check Each Period is required', check.ifStringFieldIsRequired(recurringTransactionsValidator.create, base(), 'eachPeriod'))
  it('Check Each Period with invalid values', check.invalidValues(recurringTransactionsValidator.create, base(), 'eachPeriod', ['FOO', 'done', 'MONTHS', 'INCOME', '545']))
  it('Check Each Period with valid values', check.allValidValues(recurringTransactionsValidator.create, base(), 'eachPeriod', ['days', 'weeks', 'months', 'quarters', 'years']))
})

function base () {
  return {
    startDate: '06/25/2021',
    type: 'INCOME',
    description: 'loan',
    amount: 26,
    category: 'OTHERS',
    method: 'ITAU',
    eachAmount: 1,
    eachPeriod: 'months'
  }
}
