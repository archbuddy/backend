const db = require('../util')
const controller = require('../../../src/controller/entity')

beforeAll(async () => {
  await db.connectMongo()
})

afterAll(async () => {
  try {
    await db.disconnectMongo()
  } catch (error) {
    console.log(error)
  }
})

describe('a', () => {

})
