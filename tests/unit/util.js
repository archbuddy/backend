const { MongoMemoryServer } = require('mongodb-memory-server')
const mongoose = require('mongoose')

let mongoServer

const connectMongo = async () => {
  if (mongoServer) {
    return mongoServer
  } 
  mongoose.Promise = Promise
  mongoServer = await MongoMemoryServer.create()
  const mongoUri = mongoServer.getUri()
  const mongooseOpts = {
    useNewUrlParser: true,
    dbName: 'fiqlQueryBuilderTest'
  }

  const connectionPromise = mongoose.connect(mongoUri, mongooseOpts)

  mongoose.connection.on('error', (e) => {
    if (e.message.code === 'ETIMEDOUT') {
      console.log(e)
      mongoose.connect(mongoUri, mongooseOpts)
    }
    console.log(e)
  })
  console.log(mongoUri)
  await connectionPromise
  return mongoServer
}

const disconnectMongo = async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
}

module.exports = {
  connectMongo,
  disconnectMongo
}
