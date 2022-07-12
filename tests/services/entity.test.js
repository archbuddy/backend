const controller = require('../../src/services/controller/entity')
const testHelper = require('../testHelper')

const validateDefaultSchemaBehaviour = (responseBody) => {
  expect(responseBody).not.toHaveProperty('_id')
  expect(responseBody).toHaveProperty('id')
  expect(responseBody).toHaveProperty('includedAt')
  expect(responseBody).toHaveProperty('updatedAt')
  expect(responseBody).toHaveProperty('active')
  expect(responseBody).toHaveProperty('variant')
}

beforeAll(async () => {
  await testHelper.connectMongo()
})

afterAll(async () => {
  await testHelper.disconnectMongo()
})

test('create a new entity', async () => {
  // ARRANGE
  const nameWithSpace = 'arch buddy  '
  const body = {
    name: nameWithSpace,
    type: 'system'
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
  expect(responseBody.name).toBe(nameWithSpace.trim())
})

test('create a existing entity', async () => {
  // ARRANGE
  const body = {
    name: 'arch buddy',
    type: 'system'
  }
  const { reply, spyCode, spySend } = testHelper.mockFastifyReply()
  // ACT
  await controller.create(testHelper.mockFastifyRequest('', body), reply)
  // ASSERT
  const responseBody = spySend.mock.calls[0][0]
  expect(spyCode.mock.calls[0][0]).toBe(409)
  validateDefaultSchemaBehaviour(responseBody)
})

test('create a existing entity - changing case', async () => {
  // ARRANGE
  const body = {
    name: 'Arch Buddy',
    type: 'system'
  }
  const { reply, spyCode, spySend } = testHelper.mockFastifyReply()
  // ACT
  await controller.create(testHelper.mockFastifyRequest('', body), reply)
  // ASSERT
  const responseBody = spySend.mock.calls[0][0]
  expect(spyCode.mock.calls[0][0]).toBe(409)
  validateDefaultSchemaBehaviour(responseBody)
})

test('create a existing entity - with spaces', async () => {
  // ARRANGE
  const body = {
    name: ' Arch Buddy ',
    type: 'system'
  }
  const { reply, spyCode, spySend } = testHelper.mockFastifyReply()
  // ACT
  await controller.create(testHelper.mockFastifyRequest('', body), reply)
  // ASSERT
  const responseBody = spySend.mock.calls[0][0]
  expect(spyCode.mock.calls[0][0]).toBe(409)
  validateDefaultSchemaBehaviour(responseBody)
})

test('create a entity with the same name but different type', async () => {
  // ARRANGE
  const body = {
    name: 'Arch Buddy',
    type: 'person'
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

test('list entities', async () => {
  // ARRANGE
  const { reply, spyCode, spySend } = testHelper.mockFastifyReply()
  // ACT
  await controller.list(testHelper.mockFastifyRequest({}, {}, { offset: 0, limit: 10 }), reply)
  // ASSERT
  const responseBody = spySend.mock.calls[0][0]
  expect(spyCode.mock.calls[0][0]).toBe(200)
  expect(responseBody).toHaveProperty('_links')
  expect(responseBody).toHaveProperty('_meta')
  expect(responseBody).toHaveProperty('data')
  expect(Array.isArray(responseBody.data)).toBe(true)
  expect(responseBody.data.length > 0).toBe(true)
  for (const obj of responseBody.data) {
    validateDefaultSchemaBehaviour(obj)
  }
})

test('get by id', async () => {
  // ARRANGE
  const { reply, spyCode, spySend } = testHelper.mockFastifyReply()
  // ACT
  await controller.list(testHelper.mockFastifyRequest({}, {}, { offset: 0, limit: 10 }), reply)
  const responseBody = spySend.mock.calls[0][0]
  expect(spyCode.mock.calls[0][0]).toBe(200)
  expect(Array.isArray(responseBody.data)).toBe(true)
  expect(responseBody.data.length > 0).toBe(true)
  const id = responseBody.data[0].id

  const { reply: replyId, spyCode: spyCodeId, spySend: spySendId } = testHelper.mockFastifyReply()
  await controller.byId(testHelper.mockFastifyRequest({}, {}, {}, { id }), replyId)
  // ASSERT
  expect(spyCodeId.mock.calls[0][0]).toBe(200)
  const responseBodyId = spySendId.mock.calls[0][0]
  validateDefaultSchemaBehaviour(responseBodyId)
  expect(id).toBe(responseBodyId.id)
})

test('update by id', async () => {
  // ARRANGE
  const { reply, spyCode, spySend } = testHelper.mockFastifyReply()
  await controller.list(testHelper.mockFastifyRequest({}, {}, { offset: 0, limit: 10 }), reply)
  const responseBody = spySend.mock.calls[0][0]
  expect(spyCode.mock.calls[0][0]).toBe(200)
  expect(Array.isArray(responseBody.data)).toBe(true)
  expect(responseBody.data.length > 0).toBe(true)

  // ACT
  const entity = responseBody.data[0]
  const id = entity.id
  entity.name = `${entity.name}-changed`
  entity.description = 'mydesc'
  const { reply: replyUpdate, spyCode: spyCodeUpdate } = testHelper.mockFastifyReply()
  await controller.update(testHelper.mockFastifyRequest({}, entity, {}, { id }), replyUpdate)

  // ASSERT
  expect(spyCodeUpdate.mock.calls[0][0]).toBe(204)
  const { reply: replyId, spyCode: spyCodeId, spySend: spySendId } = testHelper.mockFastifyReply()
  await controller.byId(testHelper.mockFastifyRequest({}, {}, {}, { id }), replyId)
  expect(spyCodeId.mock.calls[0][0]).toBe(200)
  const responseBodyId = spySendId.mock.calls[0][0]
  validateDefaultSchemaBehaviour(responseBodyId)
  expect(responseBodyId.id).toBe(id)
  expect(responseBodyId.name).toBe(entity.name)
  expect(responseBodyId.description).toBe('mydesc')
})

test('delete by id', async () => {
  // ARRANGE
  const { reply, spyCode, spySend } = testHelper.mockFastifyReply()
  await controller.list(testHelper.mockFastifyRequest({}, {}, { offset: 0, limit: 10 }), reply)
  const responseBody = spySend.mock.calls[0][0]
  expect(spyCode.mock.calls[0][0]).toBe(200)
  expect(Array.isArray(responseBody.data)).toBe(true)
  expect(responseBody.data.length > 0).toBe(true)
  const sizeBeforeDelete = responseBody.data.length

  // ACT
  const id = responseBody.data[0].id
  const { reply: replyDelete, spyCode: spyCodeDelete } = testHelper.mockFastifyReply()
  await controller.deleteById(testHelper.mockFastifyRequest({}, {}, {}, { id }), replyDelete)

  // ASSERT
  expect(spyCodeDelete.mock.calls[0][0]).toBe(204)
  const { reply: replyList, spySend: spySendList } = testHelper.mockFastifyReply()
  await controller.list(testHelper.mockFastifyRequest({}, {}, { offset: 0, limit: 10 }), replyList)
  const responseBodyAfterDelete = spySendList.mock.calls[0][0]
  const sizeAfterDelete = responseBodyAfterDelete.data.length
  expect(sizeAfterDelete).toBe((sizeBeforeDelete - 1))
})
