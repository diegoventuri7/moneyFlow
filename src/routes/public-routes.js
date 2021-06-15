const express = require('express')
const dashboardController = require('../api/controllers/dashboard-controller')
const transactionsController = require('../api/controllers/transactions-controller')
const transactionsValidator = require('../api/validators/transactions-validator')
const recurringTransactionsController = require('../api/controllers/recurring-transactions-controller')
const recurringTransactionsValidator = require('../api/validators/recurring-transactions-validator')

const router = express.Router()

router.post('/transactions', transactionsValidator.create, transactionsController.create)
router.put('/transactions/:id', transactionsValidator.update, transactionsController.update)
router.get('/transactions', transactionsController.list)

router.post('/recurring-transactions', recurringTransactionsValidator.create, recurringTransactionsController.create)
router.get('/recurring-transactions', recurringTransactionsController.list)

router.get('/resume', dashboardController.resume)

module.exports = router
