const bodyParser = require('body-parser')
const apiPublicRoutes = require('../routes/api-public-routes.js')
const appPublicRoutes = require('../routes/app-public-routes.js')
const express = require('express')
const path = require('path')

module.exports = async ({ app }) => {
  app.use(bodyParser.urlencoded({ limit: '1mb', extended: false }))
  app.use(bodyParser.json({ limit: '1mb' }))

  app.set('views', path.join(__dirname, '../views'))
  app.set('view engine', 'ejs')
  app.use(express.static(path.join(__dirname, '../../public')))

  app.use('/ping', (req, res) => { res.send('pong') })
  app.use('/api', apiPublicRoutes)
  app.use('/app', appPublicRoutes)

  app.use(function (err, req, res, next) {
    const error = {
      body: req && req.body ? req.body : null,
      headers: req && req.headers ? req.headers : null,
      query: req && req.query ? req.query : null,
      error: err.message ? err.message : err
    }
    JSON.stringify(error)

    res.status(err.status || 500)
    res.json({ error: err.message ? err.message : err })
  })

  return app
}
