const srvViewPoint = require('../../src/service/viewPoint')

// "[{\"instancePath\":\"\",\"schemaPath\":\"#/required\",\"keyword\":\"required\",\"params\":{\"missingProperty\":\"id\"},\"message\":\"must have required property 'id'\"},{\"instancePath\":\"\",\"schemaPath\":\"#/required\",\"keyword\":\"required\",\"params\":{\"missingProperty\":\"name\"},\"message\":\"must have required property 'name'\"},{\"instancePath\":\"\",\"schemaPath\":\"#/required\",\"keyword\":\"required\",\"params\":{\"missingProperty\":\"nodes\"},\"message\":\"must have required property 'nodes'\"}]"

test('required fields - all', async function () {
  try {
    await srvViewPoint.associate({})
    // fail on purpose
    expect(0).toBe(1)
  } catch (err) {
    expect(err.toString().indexOf('"missingProperty":"id"') > 0).toBe(true)
    expect(err.toString().indexOf('"missingProperty":"name"') > 0).toBe(true)
    expect(err.toString().indexOf('"missingProperty":"nodes"') > 0).toBe(true)
  }
})

test('required fields - name,nodes', async function () {
  try {
    await srvViewPoint.associate({ id: 1 })
    // fail on purpose
    expect(0).toBe(1)
  } catch (err) {
    expect(err.toString().indexOf('"missingProperty":"name"') > 0).toBe(true)
    expect(err.toString().indexOf('"missingProperty":"nodes"') > 0).toBe(true)
  }
})

test('required fields - nodes', async function () {
  try {
    await srvViewPoint.associate({ id: 1, name: 'abcdefg' })
    // fail on purpose
    expect(0).toBe(1)
  } catch (err) {
    expect(err.toString().indexOf('"missingProperty":"nodes"') > 0).toBe(true)
  }
})

test('required fields - nodes empty', async function () {
  try {
    await srvViewPoint.associate({ id: 1, name: 'abcdefg', nodes: [] })
    // fail on purpose
    expect(0).toBe(1)
  } catch (err) {
    expect(err.toString().indexOf('must NOT have fewer than 1 items') > 0).toBe(true)
  }
})

test('required fields - nodes invalid item', async function () {
  try {
    await srvViewPoint.associate({ id: 1, name: 'abcdefg', nodes: [1] })
    // fail on purpose
    expect(0).toBe(1)
  } catch (err) {
    expect(err.toString().indexOf('must be string') > 0).toBe(true)
  }
})

test('required fields - edge invalid item', async function () {
  try {
    await srvViewPoint.associate({ id: 1, name: 'abcdefg', nodes: ['1'], edges: [1] })
    // fail on purpose
    expect(0).toBe(1)
  } catch (err) {
    expect(err.toString().indexOf('must be string') > 0).toBe(true)
  }
})
