const express = require('express')
const appController = require('../api/controllers/app-controller')

const router = express.Router()

router.get('/resume', appController.resume)
router.get('/transaction', appController.transaction)
router.get('/recurring_transaction', appController.recurringTransaction)

module.exports = router
