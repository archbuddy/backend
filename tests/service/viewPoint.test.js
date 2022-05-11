const srvViewPoint = require('../../src/service/viewPoint')
const repository = require('../../src/repository/db')

jest.mock('../../src/repository/db')

repository.nodeExists.mockImplementation((id) => {
  return id % 2 === 0
})

repository.edgeExists.mockImplementation((id) => {
  return id % 2 === 0
})

test('save viewPoint with invalid nodes', async function () {
  try {
    await srvViewPoint.associate({ id: 1, name: 'abcdef', nodes: [1, 2] })
    // fail on purpose
    expect(0).toBe(1)
  } catch (err) {
    expect(err.message).toBe('Payload is invalid')
    expect(err.data[0]).toBe('Node id 1 do not exists')
  }
})

test('save viewPoint with invalid edge', async function () {
  try {
    await srvViewPoint.associate({ id: 1, name: 'abcdef', nodes: [2], edges: [1] })
    // fail on purpose
    expect(0).toBe(1)
  } catch (err) {
    expect(err.message).toBe('Payload is invalid')
    expect(err.data[0]).toBe('Edge id 1 do not exists')
  }
})

test('save viewPoint with invalid edge and node', async function () {
  try {
    await srvViewPoint.associate({ id: 1, name: 'abcdef', nodes: [2, 1], edges: [1, 4] })
    // fail on purpose
    expect(0).toBe(1)
  } catch (err) {
    expect(err.message).toBe('Payload is invalid')
    expect(err.data[0]).toBe('Node id 1 do not exists')
    expect(err.data[1]).toBe('Edge id 1 do not exists')
  }
})

test('save viewPoint', async function () {
  const spy = jest.spyOn(repository, 'updateViewPoint')
  await srvViewPoint.associate({ id: 1, name: 'abcdef', nodes: [2], edges: [4] })
  expect(spy).toHaveBeenCalledTimes(1)
})
