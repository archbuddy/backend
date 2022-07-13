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
    type: 'system',
    variant: 'internal'
  }), reply)

  listOfEntities.push(spySend.mock.calls[0][0])

  await controllerEntity.create(testHelper.mockFastifyRequest('', {
    name: 'system 2',
    type: 'system',
    variant: 'internal'
  }), reply)

  listOfEntities.push(spySend.mock.calls[1][0])

  await controllerEntity.create(testHelper.mockFastifyRequest('', {
    name: 'system 3',
    type: 'system',
    variant: 'internal'
  }), reply)

  listOfEntities.push(spySend.mock.calls[2][0])

  await controllerEntity.create(testHelper.mockFastifyRequest('', {
    name: 'person 1',
    type: 'person',
    variant: 'internal'
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

test('list relations', async () => {
  // ARRANGE
  const { reply: replyCreate } = testHelper.mockFastifyReply()
  await controller.create(testHelper.mockFastifyRequest('', {
    source: listOfEntities[0].id,
    target: listOfEntities[2].id
  }), replyCreate)
  await controller.create(testHelper.mockFastifyRequest('', {
    source: listOfEntities[1].id,
    target: listOfEntities[2].id
  }), replyCreate)

  // ACT
  const { reply: replyList, spyCode: spyCodeList, spySend: spySendList } = testHelper.mockFastifyReply()
  await controller.list(testHelper.mockFastifyRequest({}, {}, { offset: 0, limit: 10 }), replyList)

  // ARRANGE
  expect(spyCodeList.mock.calls[0][0]).toBe(200)
  const responseBody = spySendList.mock.calls[0][0]
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
