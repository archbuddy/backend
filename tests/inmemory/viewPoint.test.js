const srv = require('../../src/repository/db')

test('viewPoints', async function () {
  const list = await srv.getViewPoints()
  expect(list.length).toBe(0)
})

test('create view point', async function () {
  await srv.createViewPoint('a')
  await srv.createViewPoint('b')
  const list = await srv.getViewPoints()
  expect(list.length).toBe(2)
  expect(list[0].id).toBe(1)
  expect(list[0].name).toBe('a')
  expect(list[1].id).toBe(2)
  expect(list[1].name).toBe('b')

  const exists = await srv.viewPointExists(list[0].id)
  expect(exists).not.toBe(undefined)
})

test('associate view point', async function () {
  // ARRANGE
  const list = await srv.getViewPoints()
  expect(list.length).toBe(2)
  const item = list[0]
  item.listOfObj = [1]
  item.attr = 'a'
  // ACT
  await srv.updateViewPoint(item)
  const afterChange = (await srv.getViewPoints())[0]

  // ASSERT
  expect(afterChange.id).toBe(item.id)
  expect(afterChange.name).toBe(item.name)
  expect(afterChange).toHaveProperty('listOfObj')
  expect(afterChange).toHaveProperty('attr')
})
