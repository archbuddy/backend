const axios = require('axios')
const commonController = require('./commonController')
const log = require('../../util/logger')
/**
 * Check the general availability of the application
 *
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
async function authentication (request, reply) {
  // sample
  // #access_token=ya29.a0ARrdaM-CjV1aNxw9tSERu4uP0NBevIq3NHPYDQulT8zV8dd_eeYx-3VRsHHiRLlPI4ASdERmoVr2Yqp3R35lujvKJWFfchq00Is3s_Zxi7Lrmg8DVXtcibAt24H1ioMeZG7-AVQLMqfFW3uGVSZ8CjaU3NyH&token_type=Bearer&expires_in=3599&scope=email%20profile%20https://www.googleapis.com/auth/userinfo.email%20openid%20https://www.googleapis.com/auth/userinfo.profile&authuser=0&prompt=consent
  const paramMap = {}
  const params = request.body.params
  if (!params || params.charAt(0) !== '#' || params.indexOf('&') === -1) {
    reply.status(500).send(commonController.prepareErrorResponse(
      500,
      'Auth google params invalid',
      'Params do not match requirements expected',
      undefined,
      undefined
    ))
    return
  }
  params.substring(1).split('&').forEach((item) => {
    const param = item.split('=')
    paramMap[param[0]] = param[1]
  })
  let result
  try {
    result = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
      headers: {
        authorization: `${paramMap.token_type} ${paramMap.access_token}`
      }
    })
    log.debug(result.data)
  } catch (err) {
    reply.status(401).send(commonController.prepareErrorResponse(
      401,
      'Google auth expired',
      'This error is propably related to the google access_token expired',
      undefined,
      undefined
    ))
  }
  try {
    const jwtData = {
      email: result.data.email,
      id: result.data.id,
      name: result.data.given_name ?? result.data.name
    }
    const token = this.jwt.sign(jwtData, { expiresIn: '1h' })
    log.debug(`Token generated ${token}`)
    reply.status(200).send({ token })
  } catch (err) {
    log.error(err.message)
    log.error(err.stackStrace)
    reply.status(500).send(commonController.prepareErrorResponse(
      500,
      'JWT Generation',
      'Error generating JWT',
      undefined,
      undefined
    ))
  }
}

/**
 * Check the general availability of the application
 *
 * @param {import('fastify').FastifyRequest} _request
 * @param {import('fastify').FastifyReply} reply
 */
async function providers (_request, reply) {
  if (process.env.AUTH_PROVIDERS && process.env.AUTH_PROVIDERS === 'google') {
    reply.status(200).send([{
      providerId: 'google',
      providerName: 'Google',
      config: {
        id: process.env.AUTH_PROVIDER_GOOGLE_ID,
        redirectUrl: 'http://localhost:3001/auth/callback?type=google',
        endpoint: process.env.AUTH_PROVIDER_GOOGLE_AUTH_ENDPOINT
      }
    }])
    return
  }
  reply.status(500).send(
    commonController.prepareErrorResponse(
      500,
      'Authentication provider',
      'No authentication providers found',
      undefined,
      undefined)
  )
}

module.exports = {
  authentication,
  providers
}
