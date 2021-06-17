const Server = require('./src/loaders/server.js')
const Database = require('./src/loaders/database.js')
const Schedule = require('./src/loaders/schedule.js')

const database = new Database()
const schedule = new Schedule()
const server = new Server(database, schedule)

server.start()
