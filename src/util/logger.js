const winston = require('winston')
const level = process.env.LOG_LEVEL || 'info'

console.log(`Starting winston with ${level}`)

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level
    })
  ]
})

module.exports = logger
