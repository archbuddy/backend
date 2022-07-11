const testHelper = require('../testHelper')
const controllerEntity = require('../../src/services/controller/entity')
const controller = require('../../src/services/controller/relation')

const listOfEntities = []

const validateDefaultSchemaBehaviour = (responseBody) => {
  expect(responseBody).not.toHaveProperty('_id')
  expect(responseBody).toHaveProperty('id')
  expect(responseBody).toHaveProperty('description')
  expect(responseBody).toHaveProperty('detail')
  expect(responseBody).toHaveProperty('source')
  expect(responseBody).toHaveProperty('target')
  expect(responseBody).toHaveProperty('includedAt')
  expect(responseBody).toHaveProperty('updatedAt')
  expect(responseBody).toHaveProperty('active')
}

beforeAll(async () => {
  await testHelper.connectMongo()
  const { reply, spySend } = testHelper.mockFastifyReply()

  await controllerEntity.create(testHelper.mockFastifyRequest('', {
    name: 'system 1',
    type: 'system'
  }), reply)

  listOfEntities.push(spySend.mock.calls[0][0])

  await controllerEntity.create(testHelper.mockFastifyRequest('', {
    name: 'system 2',
    type: 'system'
  }), reply)

  listOfEntities.push(spySend.mock.calls[1][0])

  await controllerEntity.create(testHelper.mockFastifyRequest('', {
    name: 'system 3',
    type: 'system'
  }), reply)

  listOfEntities.push(spySend.mock.calls[2][0])

  await controllerEntity.create(testHelper.mockFastifyRequest('', {
    name: 'person 1',
    type: 'person'
  }), reply)

  listOfEntities.push(spySend.mock.calls[3][0])
})

afterAll(async () => {
  await testHelper.disconnectMongo()
})

test('error source and target are the same', async () => {
  // ARRANGE
  const body = {
    description: 'test',
    source: listOfEntities[0].id,
    target: listOfEntities[0].id
  }
  const { reply, spyCode } = testHelper.mockFastifyReply()
  // ACT
  await controller.create(testHelper.mockFastifyRequest('', body), reply)
  // ASSERT
  expect(spyCode.mock.calls[0][0]).toBe(400)
})

test('create a valid relation', async () => {
  // ARRANGE
  const body = {
    description: 'test',
    source: listOfEntities[0].id,
    target: listOfEntities[1].id
  }
  const { reply, spyCode, spyHeader, spySend } = testHelper.mockFastifyReply()
  // ACT
  await controller.create(testHelper.mockFastifyRequest('', body), reply)
  // ASSERT
  const responseBody = spySend.mock.calls[0][0]
  expect(spyCode.mock.calls[0][0]).toBe(200)
  expect(spyHeader.mock.calls[0][0]).toBe('Location')
  expect(spyHeader.mock.calls[0][1]).toBe(`/${responseBody.id}`)
  validateDefaultSchemaBehaviour(responseBody)
})
