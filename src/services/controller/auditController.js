const { auditModel } = require('../model/audit')
const log = require('../../util/log')

const isAuthDisable = () => {
  if (process.env.DISABLE_AUTH === 'true') {
    log.warn('Audit is not working because auth is disable')
    return true
  }
  return false
}

const getUserInfo = (request) => {
  return `${request.user.provider}-${request.user.email ?? request.user.id}`
}

async function insert (request, description, object) {
  if (isAuthDisable()) {
    return
  }
  const body = { action: 'INSERT', description, user: getUserInfo(request), object }
  await auditModel().create(body)
}

async function update (request, description, object) {
  if (isAuthDisable) {
    return
  }
  const body = { action: 'UPDATE', description, user: getUserInfo(request), object }
  await auditModel().create(body)
}

async function remove (request, description, object) {
  if (isAuthDisable) {
    return
  }
  const body = { action: 'DELETE', description, user: getUserInfo(request), object }
  await auditModel().create(body)
}

async function login (user, description, object) {
  if (isAuthDisable) {
    return
  }
  const body = { action: 'LOGIN', description, user, object }
  await auditModel().create(body)
}

module.exports = {
  insert,
  update,
  remove,
  login
}
