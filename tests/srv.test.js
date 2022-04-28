const srv = require('../src/srv')

test('nodes', async function () {
  expect((await srv.getNodes()).length > 0).toBe(true)
})

test('edges', async function () {
  expect((await srv.getEdges()).length > 0).toBe(true)
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

test('add edge', async function () {
  const edge = {
    source: 'n2',
    target: 'n3',
    sourceHandle: 'r1',
    targetHandle: 'l1',
    label: 'test'
  }
  expect((await srv.getEdges()).length).toBe(2)
  await srv.addEdge(edge)
  const edges = await srv.getEdges()
  expect(edges.length).toBe(3)
})

test('delete edge', async function () {
  expect((await srv.getEdges()).length).toBe(3)
  await srv.deleteEdge('n2n3')
  expect((await srv.getEdges()).length).toBe(2)
})

test('delete node', async function () {
  expect((await srv.getEdges()).length).toBe(2)
  expect((await srv.getNodes()).length).toBe(4)
  await srv.deleteNode('n2')
  expect((await srv.getEdges()).length).toBe(1)
  expect((await srv.getNodes()).length).toBe(3)
})
