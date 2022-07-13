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

const getEnumC4Variants = () => {
  return ['internal', 'external']
}

module.exports = {
  getEnumEntityTypes,
  getEnumC4Variants
}
