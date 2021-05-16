const express = require('express')
const transactionsController = require('../api/controllers/transactions-controller')
const transactionsValidator = require('../api/validators/transactions-validator')
const recurringTransactionsController = require('../api/controllers/recurring-transactions-controller')
const recurringTransactionsValidator = require('../api/validators/recurring-transactions-validator')

const router = express.Router()

router.post('/transactions', transactionsValidator.create, transactionsController.create)
router.get('/transactions', transactionsController.list)

router.post('/recurring-transactions', recurringTransactionsValidator.create, recurringTransactionsController.create)
router.get('/recurring-transactions', recurringTransactionsController.list)

module.exports = router
