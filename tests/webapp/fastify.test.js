process.env.AUTH_JWT_SECRET = 'fake'
const build = require('../../src/webapp/app')

test('Fastify will build?', async () => {
  const app = await build()
  expect(app).not.toBe(undefined)
})
