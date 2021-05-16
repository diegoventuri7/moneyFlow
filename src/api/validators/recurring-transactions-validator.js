// const { check } = require('express-validator')

const validators = module.exports

validators.create = [
  // check('ticker').notEmpty().withMessage('Campo obrigatório')
  //   .trim()
  //   .bail() // Stops running validations if any of the previous ones have failed
  //   .isUppercase()
  //   .custom(async value => {
  //     if (await tickersRepository.getCount({ ticker: value }) > 0) { return Promise.reject('Ticker já cadastrado') }
  //   }),
  // check('tickerName').notEmpty().withMessage('Campo obrigatório').trim(),
  // check('exchange').notEmpty().withMessage('Campo obrigatório').trim()
  //   .isIn(['Nasdaq', 'B3', 'NYSE']),
  // check('yahooTicker').notEmpty().withMessage('Campo obrigatório')
  //   .trim()
  //   .bail() // Stops running validations if any of the previous ones have failed
  //   .isUppercase()
  //   .custom(async value => {
  //     if (await tickersRepository.getCount({ yahooTicker: value }) > 0) { return Promise.reject('yahooTicker já cadastrado') }
  //   }),
  // check('type').notEmpty().withMessage('Campo obrigatório').trim()
  //   .isIn(['ETF', 'FII', 'STOCK', 'REIT']),
  // check('currency').notEmpty().withMessage('Campo obrigatório').trim()
  //   .isIn(['BRL', 'USD']),
  // check('sector').notEmpty().withMessage('Campo obrigatório').trim()
]
