module.exports = Object.freeze({
  TRANSACTIONS: {
    TYPE: {
      INCOME: 'INCOME',
      EXPENSE: 'EXPENSE'
    },
    CATEGORY: {
      HOME: 'HOME',
      INVESTMENTS: 'INVESTMENTS',
      DONATION: 'DONATION',
      SERVICES: 'SERVICES',
      OTHERS: 'OTHERS'
    },
    STATUS: {
      PENDING: 'PENDING',
      DONE: 'DONE'
    },
    METHOD: {
      NUBANK: 'NUBANK',
      ITAU: 'ITAU',
      MERCADO_PAGO: 'MERCADO PAGO',
      PIC_PAY: 'PIC PAY',
      CASH: 'CASH'
    },
    EACH_PERIOD: {
      DAYS: 'days',
      WEEKS: 'weeks',
      MONTHS: 'months',
      QUARTERS: 'quarters',
      YEARS: 'years'
    }
  }
})
