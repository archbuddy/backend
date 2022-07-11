require('dotenv').config()

const { connectMongo, disconnectMongo } = require('../services/repository/db.js')
const build = require('./app')
const log = require('../util/log')
// Run the server!
const start = async () => {
  try {
    const app = await build()
    log.info('Connecting to mongo')
    await connectMongo()
    const port = 3000
    log.info(`Starting server on port ${port}`)
    await app.listen({ port })
    log.info('Server Started')
  } catch (err) {
    await disconnectMongo()
    log.error(err)
    log.error(err.message)
    process.exit(1)
  }
}

start()
