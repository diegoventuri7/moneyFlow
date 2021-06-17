require('dotenv').config({ path: './env/vars.env' })

const config = Object.freeze({
  express: {
    PORT: process.env.PORT
  },
  db: {
    STRING_CONNECTION_DB: process.env.STRING_CONNECTION_DB
  },
  slack: {
    URL: process.env.URL_SLACK
  }
})

module.exports = config
