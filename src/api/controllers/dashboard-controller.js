const dashboardService = require('../services/dashboard-service.js')

exports.resume = function (req, res) {
  dashboardService.resume(req.query).then((resume) => {
    res.json(resume)
  }).catch(err => { res.statusCode = 400; res.json({ date: new Date(), errors: err }) })
}
