const winston = require('winston')
const newrelicFormatter = require('@newrelic/winston-enricher')
const additionalInfo = {
  lifecycle: 'experimental',
  type: 'service',
  team: '',
  system: '',
  domain: ''
}

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
      format: winston.format.combine(
        winston.format.label({ label: JSON.stringify(additionalInfo) }),
        newrelicFormatter()
      ),
      level: process.env.LOG_LEVEL_ENABLED || 'error'
    })
  ]
})

module.exports = logger
