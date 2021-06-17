exports.resume = function (req, res) {
  res.render('layout.ejs', { page: 'resume' })
}

exports.transaction = function (req, res) {
  res.render('layout.ejs', { page: 'transaction' })
}
