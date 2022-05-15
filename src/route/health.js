const healthController = require('../controller/health.js')

const check = {
  handler: healthController.check,
  schema: {
    tags: ['Health Check']
  }
}
const complete = {
  handler: healthController.complete,
  schema: {
    tags: ['Health Check']
  }
}

module.exports = { check, complete }
