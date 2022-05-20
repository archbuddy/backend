const { connectMongo, disconnectMongo } = require('./db')
const { entityModel } = require('../model/entity')
const { relationModel } = require('../model/relation')
const { diagramModel } = require('../model/diagram')
const { nodeModel } = require('../model/node')
const { edgeModel } = require('../model/edge')
const log = require('../util/logger')

const seedDb = async () => {
  log.info('Starting Seed')
  await connectMongo()
  await clear()
  const systems = await loadSystem()
  const relations = await loadRelations(systems)
  const diagrams = await loadDiagram()
  await createView1(diagrams[0], systems, relations)
  await createView2(diagrams[1], systems, relations)
  await createView3(diagrams[2], systems, relations)
  await createView4(diagrams[3], systems, relations)
  log.info('Seed finished')
}

const clear = async () => {
  await nodeModel().deleteMany()
  await edgeModel().deleteMany()
  await diagramModel().deleteMany()
  await relationModel().deleteMany()
  await entityModel().deleteMany()
}

const createView1 = async (diagram, systems, relations) => {
  await nodeModel().insertMany([
    { x: -30, y: 10, entity: systems[0]._id, diagram: diagram._id, includedAt: new Date() },
    { x: 99, y: -59, entity: systems[1]._id, diagram: diagram._id, includedAt: new Date() }
  ])

  await edgeModel().insertMany([
    { sourceHandle: 'r1', targetHandle: 'l1', relation: relations[0]._id, diagram: diagram._id, includedAt: new Date() }
  ])
}
const createView2 = async (diagram, systems, relations) => {
  await nodeModel().insertMany([
    { x: -30, y: 10, entity: systems[0]._id, diagram: diagram._id, includedAt: new Date() },
    { x: 91, y: 54, entity: systems[2]._id, diagram: diagram._id, includedAt: new Date() }
  ])

  await edgeModel().insertMany([
    { sourceHandle: 'r1', targetHandle: 'l1', relation: relations[1]._id, diagram: diagram._id, includedAt: new Date() }
  ])
}
const createView3 = async (diagram, systems, relations) => {
  await nodeModel().insertMany([
    { x: -30, y: 10, entity: systems[0]._id, diagram: diagram._id, includedAt: new Date() },
    { x: 91, y: 54, entity: systems[2]._id, diagram: diagram._id, includedAt: new Date() }
  ])

  await edgeModel().insertMany([
    { sourceHandle: 'r1', targetHandle: 'l1', relation: relations[2]._id, diagram: diagram._id, includedAt: new Date() }
  ])
}
const createView4 = async (diagram, systems, relations) => {
  await nodeModel().insertMany([
    { x: -30, y: 10, entity: systems[0]._id, diagram: diagram._id, includedAt: new Date() },
    { x: 99, y: -59, entity: systems[1]._id, diagram: diagram._id, includedAt: new Date() },
    { x: 91, y: 54, entity: systems[2]._id, diagram: diagram._id, includedAt: new Date() }
  ])

  await edgeModel().insertMany([
    { sourceHandle: 'r1', targetHandle: 'l1', relation: relations[0]._id, diagram: diagram._id, includedAt: new Date() },
    { sourceHandle: 'r1', targetHandle: 'l1', relation: relations[1]._id, diagram: diagram._id, includedAt: new Date() },
    { sourceHandle: 'r1', targetHandle: 'l1', relation: relations[2]._id, diagram: diagram._id, includedAt: new Date() }
  ])
}
const loadDiagram = async () => {
  const res = await diagramModel().insertMany([
    { name: 'View Point 1', includedAt: new Date() },
    { name: 'View Point 2', includedAt: new Date() },
    { name: 'View Point 3', includedAt: new Date() },
    { name: 'View Point 4', includedAt: new Date() }
  ])
  return res
}

const loadRelations = async (systems) => {
  const res = await relationModel().insertMany([
    {
      description: 'authenticate',
      detail: '',
      source: systems[0]._id,
      target: systems[1]._id,
      includedAt: new Date()
    },
    {
      description: 'authenticate',
      detail: '',
      source: systems[0]._id,
      target: systems[2]._id,
      includedAt: new Date()
    },
    {
      description: 'user',
      detail: '',
      source: systems[0]._id,
      target: systems[2]._id,
      includedAt: new Date()
    }
  ])
  return res
}

const loadSystem = async () => {
  const res = await entityModel().insertMany([
    {
      name: 'Arch Buddy',
      description: '',
      type: 'system',
      variant: 'internal',
      active: true,
      includedAt: new Date()
    },
    {
      name: 'Microsoft Identity',
      description: '',
      type: 'system',
      variant: 'internal',
      active: true,
      includedAt: new Date()
    },
    {
      name: 'Google Authenticator',
      description: '',
      type: 'system',
      variant: 'internal',
      active: true,
      includedAt: new Date()
    }
  ])
  return res
}

seedDb().then(async () => { await disconnectMongo() })
