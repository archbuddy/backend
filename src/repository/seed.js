const { connectMongo, disconnectMongo } = require('./db')
const { entityModel } = require('../model/entity')
const { relationModel } = require('../model/relation')
const { diagramModel } = require('../model/diagram')
const { nodeModel } = require('../model/node')

const seedDb = async () => {
  await connectMongo()
  await clear()
  const systems = await loadSystem()
  const relations = await loadRelations(systems)
  const diagrams = await loadDiagram(systems, relations)
  await createView1(diagrams[0], systems, relations)
  await createView2(diagrams[1], systems, relations)
  await createView3(diagrams[2], systems, relations)
  await createView4(diagrams[3], systems, relations)
}

const clear = async () => {
  await nodeModel().deleteMany()
  await diagramModel().deleteMany()
  await relationModel().deleteMany()
  await entityModel().deleteMany()
}

const createView1 = async (diagram, systems, relations) => {
  // prettier-ignore
  const nodes = await nodeModel().insertMany([
    { x: -30, y: 10, entity: systems[0]._id },
    { x: 99, y: -59, entity: systems[1]._id }
  ])
  return nodes
}
const createView2 = async (diagram, systems, relations) => {
  // prettier-ignore
  const nodes = await nodeModel().insertMany([
    { x: -30, y: 10, entity: systems[0]._id },
    { x: 91, y: 54, entity: systems[2]._id }
  ])
  return nodes
}
const createView3 = async (diagram, systems, relations) => {
  // prettier-ignore
  const nodes = await nodeModel().insertMany([
    { x: -30, y: 10, entity: systems[0]._id },
    { x: 91, y: 54, entity: systems[2]._id }
  ])
  return nodes
}
const createView4 = async (diagram, systems, relations) => {
  // prettier-ignore
  const nodes = await nodeModel().insertMany([
    { x: -30, y: 10, entity: systems[0]._id },
    { x: 99, y: -59, entity: systems[1]._id },
    { x: 91, y: 54, entity: systems[2]._id }
  ])
  return nodes
}
const loadDiagram = async () => {
  const res = await diagramModel().insertMany([
    { name: 'View Point 1' },
    { name: 'View Point 2' },
    { name: 'View Point 3' },
    { name: 'View Point 4' }
  ])
  return res
}

const loadRelations = async (systems) => {
  const res = await relationModel().insertMany([
    {
      description: 'authenticate',
      detail: '',
      source: systems[0]._id,
      target: systems[1]._id
    },
    {
      description: 'authenticate',
      detail: '',
      source: systems[0]._id,
      target: systems[2]._id
    },
    {
      description: 'user',
      detail: '',
      source: systems[0]._id,
      target: systems[2]._id
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
      active: true
    },
    {
      name: 'Microsoft Identity',
      description: '',
      type: 'system',
      variant: 'internal',
      active: true
    },
    {
      name: 'Google Authenticator',
      description: '',
      type: 'system',
      variant: 'internal',
      active: true
    }
  ])
  return res
}

seedDb().then(async () => { await disconnectMongo() })
