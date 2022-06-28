const axios = require('axios')
const commonController = require('./commonController')
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
    const result = item.split('=')
    paramMap[result[0]] = result[1]
  })
  try {
    const result = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
      headers: {
        authorization: `${paramMap.token_type} ${paramMap.access_token}`
      }
    })
    console.log(result.data)

    const jwtData = {
      email: result.data.email,
      id: result.data.id,
      name: result.data.given_name ?? result.data.name
    }
    reply.status(200).send({ token: this.jwt.sign(jwtData) })
  } catch (err) {
    reply.status(401).send(commonController.prepareErrorResponse(
      401,
      'Google auth expired',
      'This error is propably related to the google access_token expired',
      undefined,
      undefined
    ))
    return
  }
}

/**
 * Check the general availability of the application
 *
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
 async function providers (request, reply) {
  reply.status(200).send([{
    providerId: 'google',
    providerName: 'Google',
    config: {
      id: '407853460821-co2oqe6ph6k0pcc4h4nae31cb1vvi5bb.apps.googleusercontent.com',
      redirectUrl: 'http://localhost:3001/auth/callback?type=google',
      endpoint: 'https://accounts.google.com/o/oauth2/v2/auth'
    }
  }, {
    providerId: 'bypass',
    providerName: 'By Pass',
    config: {}
  }])
 }

module.exports = {
  authentication,
  providers
}
