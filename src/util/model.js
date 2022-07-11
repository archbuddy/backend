const getEnumEntityTypes = () => {
  return [
    'person',
    'system',
    'container',
    'storageContainer',
    'microserviceContainer',
    'busContainer',
    'webContainer',
    'mobContainer'
  ]
}

const getEnumEntityVariants = () => {
  return ['internal', 'external']
}

module.exports = {
  getEnumEntityTypes,
  getEnumEntityVariants
}
