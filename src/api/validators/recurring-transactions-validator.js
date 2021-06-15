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
    .isDecimal({ decimal_digits: '0,2' })
    .bail()
    .isFloat({ min: 0 }),
  check('startDate')
    .isDate({ format: 'MM/DD/YYYY', strictMode: true }),
  check('category').notEmpty().withMessage('Field is required')
    .trim()
    .bail() // Stops running validations if any of the previous ones have failed
    .isIn(Object.values(enums.TRANSACTIONS.CATEGORY)),
  check('method').notEmpty().withMessage('Field is required')
    .trim()
    .bail() // Stops running validations if any of the previous ones have failed
    .isIn(Object.values(enums.TRANSACTIONS.METHOD)),
  check('eachAmount')
    .isInt({ min: 1 }),
  check('eachPeriod').notEmpty().withMessage('Field is required')
    .trim()
    .bail() // Stops running validations if any of the previous ones have failed
    .isIn(Object.values(enums.TRANSACTIONS.EACH_PERIOD))
]
