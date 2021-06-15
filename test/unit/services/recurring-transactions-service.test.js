
const recurringTransactionsService = require('../../../src/api/services/recurring-transactions-service.js')
const DatabaseMock = require('../../utils/database-mock.js')
const transactionsRepository = require('../../../src/api/repositories/transactions-repository.js')
const recurringTransactionsRepository = require('../../../src/api/repositories/recurring-transactions-repository.js')
const chai = require('chai')
chai.use(require('chai-datetime'))
const { expect } = require('chai')

describe('recurring-transactions-service', function () {
  this.timeout(3000)
  before(async function () {
    this.database = new DatabaseMock()
    await this.database.connect()
  })

  afterEach(async function () {
    await this.database.clean()
  })

  after(async function () {
    await this.database.disconnect()
  })

  it('Happy day: createNewTransactions', async function () {
    const recurring = [
      {
        startDate: new Date('2021-06-02T03:00:00Z'),
        nextDate: new Date('2021-06-02T03:00:00Z'),
        type: 'EXPENSE',
        description: 'Diarista',
        amount: 90,
        category: 'HOME',
        method: 'CASH',
        eachAmount: 1,
        eachPeriod: 'weeks'
      },
      {
        startDate: new Date('2021-06-05T03:00:00Z'),
        nextDate: new Date('2021-06-05T03:00:00Z'),
        type: 'INCOME',
        description: 'Salário',
        amount: 5670.32,
        category: 'OTHERS',
        method: 'ITAU',
        eachAmount: 1,
        eachPeriod: 'months'
      }
    ]
    await recurringTransactionsRepository.insertMany(recurring)
    await recurringTransactionsService.createNewTransactions(new Date('2021-06-01T03:00:00Z'), new Date('2021-06-30T03:00:00Z'))

    const checkExpense = await recurringTransactionsRepository.getOne({ type: 'EXPENSE' })
    expect(new Date(checkExpense.startDate)).to.equalDate(new Date('2021-06-02T03:00:00.000Z'))
    expect(new Date(checkExpense.nextDate)).to.equalDate(new Date('2021-07-07T03:00:00.000Z'))
    expect(checkExpense.type).to.equal('EXPENSE')
    expect(checkExpense.description).to.equal('Diarista')
    expect(checkExpense.amount).to.equal(90)
    expect(checkExpense.category).to.equal('HOME')
    expect(checkExpense.method).to.equal('CASH')
    expect(checkExpense.eachAmount).to.equal(1)
    expect(checkExpense.eachPeriod).to.equal('weeks')

    const checkExpenseTransactions = await transactionsRepository.list({ type: 'EXPENSE' })
    expect(checkExpenseTransactions).to.be.an('array').to.lengthOf(5)
    expect(new Date(checkExpenseTransactions[0].date)).to.equalDate(new Date('2021-06-02T03:00:00.000Z'))
    expect(new Date(checkExpenseTransactions[1].date)).to.equalDate(new Date('2021-06-09T03:00:00.000Z'))
    expect(new Date(checkExpenseTransactions[2].date)).to.equalDate(new Date('2021-06-16T03:00:00.000Z'))
    expect(new Date(checkExpenseTransactions[3].date)).to.equalDate(new Date('2021-06-23T03:00:00.000Z'))
    expect(new Date(checkExpenseTransactions[4].date)).to.equalDate(new Date('2021-06-30T03:00:00.000Z'))

    const checkIncome = await recurringTransactionsRepository.getOne({ type: 'INCOME' })
    expect(new Date(checkIncome.startDate)).to.equalDate(new Date('2021-06-05T03:00:00.000Z'))
    expect(new Date(checkIncome.nextDate)).to.equalDate(new Date('2021-07-05T03:00:00.000Z'))
    expect(checkIncome.type).to.equal('INCOME')
    expect(checkIncome.description).to.equal('Salário')
    expect(checkIncome.amount).to.equal(5670.32)
    expect(checkIncome.category).to.equal('OTHERS')
    expect(checkIncome.method).to.equal('ITAU')
    expect(checkIncome.eachAmount).to.equal(1)
    expect(checkIncome.eachPeriod).to.equal('months')

    const checkIncomeTransactions = await transactionsRepository.list({ type: 'INCOME' })
    expect(checkIncomeTransactions).to.be.an('array').to.lengthOf(1)
    expect(new Date(checkIncomeTransactions[0].date)).to.equalDate(new Date('2021-06-05T03:00:00.000Z'))
  })
})
