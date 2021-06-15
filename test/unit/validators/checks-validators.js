const { validationResult } = require('express-validator')
const httpMocks = require('node-mocks-http')
const { expect } = require('chai')

module.exports = {
  ifStringFieldIsRequired: (validator, base, field) => async function () {
    const values = [null, '', undefined]

    for (let i = 0; i < values.length; i++) {
      const value = values[i]
      base[field] = value
      await checkErrorResponse(validator, base, field, value, 'Field is required')
    }
  },

  ifDateFieldIsRequired: (validator, base, field) => async function () {
    const values = [null, '', undefined]

    for (let i = 0; i < values.length; i++) {
      const value = values[i]
      base[field] = value
      await checkErrorResponse(validator, base, field, value, 'Invalid value')
    }
  },

  ifNumberFieldIsRequired: (validator, base, field) => async function () {
    const values = [null, undefined]

    for (let i = 0; i < values.length; i++) {
      const value = values[i]
      base[field] = value
      await checkErrorResponse(validator, base, field, value, 'Invalid value')
    }
  },

  minValue: (validator, base, field, minValue) => async function () {
    base[field] = minValue - 1
    await checkErrorResponse(validator, base, field, minValue - 1, 'Invalid value')

    base[field] = minValue
    await checkSuccessResponse(validator, base)

    base[field] = minValue + 1
    await checkSuccessResponse(validator, base)
  },

  invalidValues: (validator, base, field, values) => async function () {
    for (let i = 0; i < values.length; i++) {
      const value = values[i]
      base[field] = value
      await checkErrorResponse(validator, base, field, value, 'Invalid value')
    }
  },

  allValidValues: (validator, base, field, values) => async function () {
    for (let i = 0; i < values.length; i++) {
      const value = values[i]
      base[field] = value
      await checkSuccessResponse(validator, base)
    }
  }
}

const testExpressValidatorMiddleware = async (req, res, middlewares) => {
  await Promise.all(middlewares.map(async (middleware) => {
    await middleware(req, res, () => undefined)
  }))
}

async function checkErrorResponse (validator, body, field, value, msg) {
  const req = httpMocks.createRequest({ body: body })
  const res = httpMocks.createResponse()

  await testExpressValidatorMiddleware(req, res, validator)
  const result = validationResult(req)

  expect(result).to.have.property('errors').to.be.an('array').to.have.lengthOf(1)
  const error = result.errors[0]
  expect(error).to.have.property('value').to.equal(value)
  expect(error).to.have.property('msg').to.equal(msg)
  expect(error).to.have.property('param').to.equal(field)
  expect(error).to.have.property('location').to.equal('body')
}

async function checkSuccessResponse (validator, body) {
  const req = httpMocks.createRequest({ body: body })
  const res = httpMocks.createResponse()

  await testExpressValidatorMiddleware(req, res, validator)
  const result = validationResult(req)

  expect(result).to.have.property('errors').to.be.an('array').to.have.lengthOf(0)
}
