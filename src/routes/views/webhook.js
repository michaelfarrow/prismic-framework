var secret = process.env.PRISMIC_WEBHOOK_SECRET

module.exports = function (req, res) {
  if (!secret) return res.err(new Error('webhook secret not set'))
  if (!req.body || req.body.secret !== secret) return res.err(new Error('webhook secret does not match'))
  res.send('done')
}
