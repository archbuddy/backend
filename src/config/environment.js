const dotenv = require('dotenv')
const convict = require('convict')
const p = require('path')

const rootDir = p.resolve(__dirname, '../..')
const path =
  process.env.NODE_ENV === 'test' ? `${rootDir}/.env.test` : `${rootDir}/.env`

dotenv.config({ path })

/**
 * You can define a configuration property as "required" without providing a default value.
 * Set its default to null and if your format doesn't accept null it will throw an error.
 */
const config = convict({
  /**
   * Server config
   */
  APP_PORT: {
    doc: 'Server port',
    format: 'port',
    env: 'APP_PORT',
    default: 3000
  },
  APP_HOST: {
    doc: 'The request timeout configuration in seconds',
    format: String,
    env: 'APP_HOST',
    default: 'localhost'
  },
  APP_REQUEST_TIMEOUT: {
    doc: 'The request timeout configuration in seconds',
    format: String,
    default: '10s'
  },
  LOG_LEVEL: {
    doc: 'Log Level',
    format: ['info', 'error', 'debug', 'fatal', 'warn', 'trace', 'child'],
    env: 'LOG_LEVEL',
    default: 'info'
  },

  /**
   * Application config
   */
  NODE_ENV: {
    doc: 'Application environment',
    format: ['development', 'test', 'production'],
    env: 'NODE_ENV',
    default: 'development'
  },
  APP_TITLE: {
    doc: 'Application title',
    format: String,
    default: 'arch-buddy'
  },
  APP_VERSION: {
    doc: 'Application version',
    format: String,
    default: '0.0.1'
  },

  /**
   * Mongo Database config
   */
  MONGO_URL: {
    doc: 'Mongo database string connection',
    format: String,
    env: 'MONGO_URL',
    default: ''
  },
  MONGO_URI: {
    doc: 'Mongo database string connection',
    format: String,
    env: 'MONGO_URI',
    default: 'localhost'
  },
  MONGO_DBNAME: {
    doc: 'Mongo database name',
    format: String,
    env: 'MONGO_DBNAME',
    default: 'archBuddyDb'
  },
  MONGO_PORT: {
    doc: 'Mongo database port',
    format: 'port',
    env: 'MONGO_PORT',
    default: 27017
  },
  MONGO_USER: {
    doc: 'Mongo database user',
    format: String,
    env: 'MONGO_USER',
    default: 'root'
  },
  MONGO_PWD: {
    doc: 'Mongo database user',
    format: String,
    env: 'MONGO_PWD',
    default: 'password'
  },
  MONGO_SSL: {
    doc: 'Mongo database ssl conection',
    format: Boolean,
    env: 'MONGO_SSL',
    default: false
  },
  MONGO_REPLICA_SET: {
    doc: 'Mongo database replica set',
    format: String,
    env: 'MONGO_REPLICA_SET',
    default: ''
  },
  MONGO_CERT_FILE_NAME: {
    doc: 'Mongo database ssl certificate filename',
    format: String,
    env: 'MONGO_CERT_FILE_NAME',
    default: ''
  },
  AWS_S3_BUCKET_NAME: {
    doc: 'Mongo database ssl certificate filename',
    format: String,
    env: 'AWS_S3_BUCKET_NAME',
    default: ''
  }
})

config.validate({ allowed: 'strict' })

module.exports = config.getProperties()
