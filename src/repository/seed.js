const { connectMongo, disconnectMongo } = require('./db')
const { entityModel } = require('../model/entity')
const { relationModel } = require('../model/relation')
const { diagramModel } = require('../model/diagram')

const seedDb = async () => {
  await connectMongo()
  await clear()
  const systems = await loadSystem()
  const relations = await loadRelations(systems)
  await loadDiagram(systems, relations)
}

const clear = async () => {
  await entityModel().deleteMany()
  await relationModel().deleteMany()
  await diagramModel().deleteMany()
}

const loadDiagram = async (system, relations) => {
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
