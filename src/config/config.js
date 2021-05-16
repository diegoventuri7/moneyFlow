require('dotenv').config({ path: './env/vars.env' })
const config = module.exports

config.express = {
  PORT: process.env.PORT
}

config.db = {
  STRING_CONNECTION_DB: process.env.STRING_CONNECTION_DB
}
