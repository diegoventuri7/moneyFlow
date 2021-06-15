const { check } = require('express-validator')
const enums = require('../../config/enums.js')
const validators = module.exports

validators.create = [
  check('type').notEmpty().withMessage('Field is required')
    .trim()
    .bail() // Stops running validations if any of the previous ones have failed
    .isIn(Object.values(enums.TRANSACTIONS.TYPE)),
  check('description').notEmpty().withMessage('Field is required')
    .trim(),
  check('amount')
    .isInt({ min: 0 }),
  check('date')
    .isDate({ format: 'MM/DD/YYYY', strictMode: true }),
  check('category').notEmpty().withMessage('Field is required')
    .trim()
    .bail() // Stops running validations if any of the previous ones have failed
    .isIn(Object.values(enums.TRANSACTIONS.CATEGORY)),
  check('status').notEmpty().withMessage('Field is required')
    .trim()
    .bail() // Stops running validations if any of the previous ones have failed
    .isIn(Object.values(enums.TRANSACTIONS.STATUS)),
  check('method').notEmpty().withMessage('Field is required')
    .trim()
    .bail() // Stops running validations if any of the previous ones have failed
    .isIn(Object.values(enums.TRANSACTIONS.METHOD)),
  check('numberOfInstallments')
    .optional()
    .isInt({ min: 2 }),
  check('installmentsPeriod')
    .optional()
    .trim()
    .isIn(Object.values(enums.TRANSACTIONS.EACH_PERIOD))
]
