require('dotenv').config()

const { connectMongo, disconnectMongo } = require('./db')
const { entityModel } = require('../model/entity')
const { relationModel } = require('../model/relation')
const { diagramModel } = require('../model/diagram')
const { nodeModel } = require('../model/node')
const { edgeModel } = require('../model/edge')
const { tagModel } = require('../model/tag')
const log = require('../../util/log')

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
  await tagModel().deleteMany()
}

const createView1 = async (diagram, systems, relations) => {
  const nodes = await nodeModel().insertMany([
    {
      x: 0,
      y: 0,
      entity: systems[0]._id,
      diagram: diagram._id,
      includedAt: new Date(),
      variant: 'internal'
    },
    {
      x: 500,
      y: 0,
      entity: systems[1]._id,
      diagram: diagram._id,
      includedAt: new Date(),
      variant: 'internal'
    }
  ])

  await edgeModel().insertMany([
    {
      source: { handle: 'r', node: nodes[0]._id },
      target: { handle: 'l', node: nodes[1]._id },
      relation: relations[0]._id,
      diagram: diagram._id,
      includedAt: new Date()
    }
  ])
}
const createView2 = async (diagram, systems, relations) => {
  const nodes = await nodeModel().insertMany([
    {
      x: 0,
      y: 0,
      entity: systems[0]._id,
      diagram: diagram._id,
      includedAt: new Date(),
      variant: 'internal'
    },
    {
      x: 500,
      y: 0,
      entity: systems[2]._id,
      diagram: diagram._id,
      includedAt: new Date(),
      variant: 'internal'
    }
  ])

  await edgeModel().insertMany([
    {
      source: { handle: 'r', node: nodes[0] },
      target: { handle: 'l', node: nodes[1] },
      relation: relations[1]._id,
      diagram: diagram._id,
      includedAt: new Date()
    }
  ])
}
const createView3 = async (diagram, systems, relations) => {
  const nodes = await nodeModel().insertMany([
    {
      x: 0,
      y: 0,
      entity: systems[0]._id,
      diagram: diagram._id,
      includedAt: new Date(),
      variant: 'internal'
    },
    {
      x: 500,
      y: 0,
      entity: systems[2]._id,
      diagram: diagram._id,
      includedAt: new Date(),
      variant: 'internal'
    }
  ])

  await edgeModel().insertMany([
    {
      source: { handle: 'r', node: nodes[0] },
      target: { handle: 'l', node: nodes[1] },
      relation: relations[2]._id,
      diagram: diagram._id,
      includedAt: new Date()
    }
  ])
}
const createView4 = async (diagram, systems, relations) => {
  const nodes = await nodeModel().insertMany([
    {
      x: 0,
      y: 0,
      entity: systems[0]._id,
      diagram: diagram._id,
      includedAt: new Date(),
      variant: 'internal'
    },
    {
      x: 500,
      y: 0,
      entity: systems[1]._id,
      diagram: diagram._id,
      includedAt: new Date(),
      variant: 'internal'
    },
    {
      x: 500,
      y: 300,
      entity: systems[2]._id,
      diagram: diagram._id,
      includedAt: new Date(),
      variant: 'internal'
    }
  ])

  await edgeModel().insertMany([
    {
      source: { handle: 'r', node: nodes[0] },
      target: { handle: 'l', node: nodes[1] },
      relation: relations[0]._id,
      diagram: diagram._id,
      includedAt: new Date()
    },
    {
      source: { handle: 'r', node: nodes[0] },
      target: { handle: 'l', node: nodes[2] },
      relation: relations[1]._id,
      diagram: diagram._id,
      includedAt: new Date()
    },
    {
      source: { handle: 'r', node: nodes[0] },
      target: { handle: 'l', node: nodes[2] },
      relation: relations[2]._id,
      diagram: diagram._id,
      includedAt: new Date()
    }
  ])
}
const loadDiagram = async () => {
  return diagramModel().insertMany([
    { name: 'View Point 1', includedAt: new Date() },
    { name: 'View Point 2', includedAt: new Date() },
    { name: 'View Point 3', includedAt: new Date() },
    { name: 'View Point 4', includedAt: new Date() }
  ])
}

const loadRelations = async (systems) => {
  return relationModel().insertMany([
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
}

const loadSystem = async () => {
  return entityModel().insertMany([
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
}

seedDb().then(async () => {
  await disconnectMongo()
})
