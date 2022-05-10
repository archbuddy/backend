const srvEdge = require('../../src/service/edges')
const repository = require('../../src/repository/db')

jest.mock('../../src/repository/db')

const edges = [
  { id: 'n1n2-0', source: 'n1', sourceHandle: 'r1', target: 'n2', targetHandle: 'l1', label: 'l1' },
  { id: 'n1n3-0', source: 'n1', sourceHandle: 'r1', target: 'n3', targetHandle: 'l1', label: 'l3' },
  { id: 'n1n3-1', source: 'n1', sourceHandle: 'r1', target: 'n3', targetHandle: 'l1', label: 'l4' },
  { id: 'n1n4-0', source: 'n1', sourceHandle: 'r1', target: 'n4', targetHandle: 'l1', label: 'l4' },
  { id: 'n1n2-1', source: 'n1', sourceHandle: 'r1', target: 'n2', targetHandle: 'l1', label: 'l2' }
]
repository.getEdges.mockImplementation(() => {
  return edges
})

test('merge edge list', async function () {
  const list1 = await srvEdge.getEdges()
  expect(list1.length).toBe(5)
  process.env.MERGE_EDGES = 'true'
  const list2 = await srvEdge.getEdges()
  expect(list2.length).toBe(3)

  const item0 = list2[0]
  expect(item0.source).toBe('n1')
  expect(item0.sourceHandle).toBe('r1')
  expect(item0.target).toBe('n2')
  expect(item0.targetHandle).toBe('l1')
  expect(item0.label).toBe('l1, l2')
  expect(item0).toHaveProperty('innerList')
  expect(item0.innerList.length).toBe(2)
  expect(JSON.stringify(item0.innerList[0])).toStrictEqual(JSON.stringify(edges[0]))
  expect(JSON.stringify(item0.innerList[1])).toStrictEqual(JSON.stringify(edges[4]))

  const item1 = list2[1]
  expect(item1.source).toBe('n1')
  expect(item1.sourceHandle).toBe('r1')
  expect(item1.target).toBe('n3')
  expect(item1.targetHandle).toBe('l1')
  expect(item1.label).toBe('l3, l4')
  expect(item1).toHaveProperty('innerList')
  expect(item1.innerList.length).toBe(2)
  expect(JSON.stringify(item1.innerList[0])).toStrictEqual(JSON.stringify(edges[1]))
  expect(JSON.stringify(item1.innerList[1])).toStrictEqual(JSON.stringify(edges[2]))

  expect(JSON.stringify(list2[2])).toStrictEqual(JSON.stringify(edges[3]))
})
