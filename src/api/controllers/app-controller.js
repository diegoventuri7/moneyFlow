exports.resume = function (req, res) {
  res.render('layout.ejs', { page: 'resume' })
}

exports.transaction = function (req, res) {
  res.render('layout.ejs', { page: 'transaction' })
}

exports.recurringTransaction = function (req, res) {
  res.render('layout.ejs', { page: 'recurring_transaction' })
}
