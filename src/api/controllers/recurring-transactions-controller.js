const recurringTransactionsService = require('../services/recurring-transactions-service.js')
const { validationResult } = require('express-validator')

exports.create = function (req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.statusCode = 422; res.json({ date: new Date(), errors: errors.array() })
  } else {
    recurringTransactionsService.create(req.body).then((ticker) => {
      res.statusCode = 201; res.json(ticker)
    }).catch(err => { res.statusCode = 400; res.json({ date: new Date(), errors: err }) })
  }
}

exports.list = function (req, res) {
  recurringTransactionsService.list(req.query).then((tickers) => {
    res.json(tickers)
  }).catch(err => { res.statusCode = 400; res.json({ date: new Date(), errors: err }) })
}
