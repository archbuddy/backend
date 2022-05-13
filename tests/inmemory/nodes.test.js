const srv = require('../../src/repository/db')
const dummy = require('../../src/dummy')

beforeAll(async () => {
  await dummy.load()
})

test('nodes', async function () {
  expect((await srv.getNodes()).length > 0).toBe(true)
})

test('add nodes', async function () {
  const node = {
    name: 'test'
  }
  expect((await srv.getNodes()).length).toBe(3)
  await srv.addNode(node)
  const nodes = await srv.getNodes()
  expect(nodes.length).toBe(4)
})

test('delete node', async function () {
  expect((await srv.getEdges()).length).toBe(3)
  expect((await srv.getNodes()).length).toBe(4)
  await srv.deleteNode('n2')
  expect((await srv.getEdges()).length).toBe(2)
  expect((await srv.getNodes()).length).toBe(3)
})

test('patch nodes', async function () {
  const name = (await srv.getNodes())[0].name
  const obj = {
    id: 'n1',
    name: 'xxx'
  }
  await srv.patchNode([obj])
  const nodesAfter = await srv.getNodes()
  expect(name).not.toBe(nodesAfter[0].name)
})

test('exists', async function () {
  let exists = await srv.nodeExists('n1')
  expect(exists).not.toBe(undefined)
  exists = await srv.nodeExists('1')
  expect(exists).toBe(undefined)
})

test('filter', async function () {
  const list = await srv.filterNodes([{ id: 'n1' }])
  expect(list.length).toBe(1)
})
