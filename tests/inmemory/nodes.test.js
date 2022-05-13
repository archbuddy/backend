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
  const obj = {
    id: 'n1',
    position: { x: 900, y: 200 }
  }
  await srv.patchNode([obj])

  const nodes = await srv.getNodes()
  const index = nodes.findIndex((element) => element.id === obj.id)
  expect(nodes[index].position.x).toBe(900)
  expect(nodes[index].position.y).toBe(200)
})

test('exists', async function () {
  let exists = await srv.nodeExists('n1')
  expect(exists).not.toBe(undefined)
  exists = await srv.nodeExists('1')
  expect(exists).toBe(undefined)
})

test('filter', async function () {
  const list = await srv.filterNodes(['n1'])
  expect(list.length).toBe(1)
})
