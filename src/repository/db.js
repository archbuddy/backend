const mongoose = require('mongoose')
const config = require('../config/environment.js')
const { readFileSync } = require('fs')
const { join } = require('path')

async function connectMongo () {
  const options = {
    dbName: config.MONGO_DBNAME,
    ssl: config.MONGO_SSL,
    useNewUrlParser: true,
    useUnifiedTopology: true
  }

  if (!areWeTestingWithJest()) {
    options.auth = {
      username: config.MONGO_USER,
      password: config.MONGO_PWD
    }

    if (config.MONGO_CERT_FILE_NAME && config.MONGO_CERT_FILE_NAME !== '') {
      options.sslCA = readFileSync(
        join(__dirname, 'cert', config.MONGO_CERT_FILE_NAME)
      )
    }

    if (config.MONGO_REPLICA_SET && config.MONGO_REPLICA_SET !== '') {
      options.replicaSet = config.MONGO_REPLICA_SET
    }
  } else {
    options.ssl = false
  }

  let mongoUrl
  if (config.MONGO_URL) {
    mongoUrl = config.MONGO_URL
  } else {
    mongoUrl = `mongodb://${config.MONGO_URI}:${config.MONGO_PORT}`
  }

  try {
    await mongoose.connect(mongoUrl, options)
  } catch (err) {
    console.log('error: ' + err)
  }
}

async function disconnectMongo () {
  await mongoose.disconnect()
}

async function getMongooseConnectionStatus () {
  return mongoose.connection.readyState === 1 ||
    mongoose.connection.readyState === 2
    ? 'ok'
    : 'nok'
}

function areWeTestingWithJest () {
  return process.env.JEST_WORKER_ID !== undefined
}

module.exports = {
  connectMongo,
  disconnectMongo,
  getMongooseConnectionStatus
}
