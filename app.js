const Server = require('./src/loaders/server.js')
const Database = require('./src/loaders/database.js')

const database = new Database()
const server = new Server(database)

server.start()
