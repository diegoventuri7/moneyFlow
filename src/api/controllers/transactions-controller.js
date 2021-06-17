const transactionsService = require('../services/transactions-service.js')
const { validationResult } = require('express-validator')

exports.create = function (req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.statusCode = 422; res.json({ date: new Date(), errors: errors.array() })
  } else {
    transactionsService.create(req.body).then((ticker) => {
      res.statusCode = 201; res.json(ticker)
    }).catch(err => { res.statusCode = 400; res.json({ date: new Date(), errors: err }) })
  }
}

exports.update = function (req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.statusCode = 422; res.json({ date: new Date(), errors: errors.array() })
  } else {
    transactionsService.update(req.params.id, req.body).then((ticker) => {
      res.statusCode = 201; res.json(ticker)
    }).catch(err => { res.statusCode = 400; res.json({ date: new Date(), errors: err }) })
  }
}

exports.delete = function (req, res) {
  transactionsService.delete(req.params.id).then((data) => {
    res.statusCode = 201; res.json(data)
  }).catch(err => { res.statusCode = 400; res.json({ date: new Date(), errors: err }) })
}

exports.list = function (req, res) {
  transactionsService.list(req.query).then((tickers) => {
    res.json(tickers)
  }).catch(err => { res.statusCode = 400; res.json({ date: new Date(), errors: err }) })
}
