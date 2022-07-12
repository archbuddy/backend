const controller = require('../../src/services/controller/diagram')
const testHelper = require('../testHelper')

const validateDefaultSchemaBehaviour = (responseBody) => {
  expect(responseBody).not.toHaveProperty('_id')
  expect(responseBody).toHaveProperty('id')
  expect(responseBody).toHaveProperty('includedAt')
  expect(responseBody).toHaveProperty('updatedAt')
  expect(responseBody).toHaveProperty('active')
  expect(responseBody).toHaveProperty('name')
}

beforeAll(async () => {
  await testHelper.connectMongo()
})

afterAll(async () => {
  await testHelper.disconnectMongo()
})

test('create a new diagram', async () => {
  // ARRANGE
  const body = {
    name: 'diagram 1'
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

test('create a new diagram with the same name', async () => {
  // ARRANGE
  const body = {
    name: 'DiaGram 1'
  }
  const { reply, spyCode, spySend } = testHelper.mockFastifyReply()
  // ACT
  await controller.create(testHelper.mockFastifyRequest('', body), reply)
  // ASSERT
  const responseBody = spySend.mock.calls[0][0]
  expect(spyCode.mock.calls[0][0]).toBe(409)
  validateDefaultSchemaBehaviour(responseBody)
})

test('create a new diagram with the same name with spaces', async () => {
  // ARRANGE
  const body = {
    name: '   diagram 1 '
  }
  const { reply, spyCode, spySend } = testHelper.mockFastifyReply()
  // ACT
  await controller.create(testHelper.mockFastifyRequest('', body), reply)
  // ASSERT
  const responseBody = spySend.mock.calls[0][0]
  expect(spyCode.mock.calls[0][0]).toBe(409)
  validateDefaultSchemaBehaviour(responseBody)
})
