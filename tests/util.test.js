const util = require('../src/util/common')

test('get package info', async () => {
  const info = util.getPackageInfo()
  expect(info).toHaveProperty('name')
  expect(info).toHaveProperty('version')
})
