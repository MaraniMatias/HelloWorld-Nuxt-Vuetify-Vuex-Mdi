'use strict'
// function wait(ms) {
//  return new Promise(resolve =>
//    setTimeout(() => resolve({ data: { black, white } }), ms)
//   );
// }
import axios from 'axios'
import Token from './Token'
import showMsg from './showMsg'

// axios defaults
axios.defaults.baseURL = process.env.NUXT_ENV_SERVER_API || '0.0.0.0:8080'
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.post['Cache-Control'] = 'no-cache'

// Add a request interceptor
axios.interceptors.request.use(
  function (config) {
    if (Token.get()) config.headers.Authorization = Token.get()
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    if (!Token.get()) {
      const { authorization, Authorization } = response.headers
      const token = authorization || Authorization
      if (token) Token.set(token)
    }

    const totalItems = response.headers['x-total-count']
    if (typeof totalItems !== 'undefined') {
      response.totalItems = parseInt(totalItems, 10)
    }
    const data = response.data.data || response.data || null
    const error = response.data.error || null
    const message = response.data.message || ''
    showMsg('info', response)
    response.data = data
    response.error = error
    response.message = message
    return response
  },
  // https://github.com/axios/axios#handling-errors
  function ({ response }) {
    if (response) {
      // login out 401 or 403
      const error =
        response.data.name === 'MongoError'
          ? 'Error al guardar en mongoDB'
          : response.data.error || null
      const message = response.data.message || ''
      const data = response.data.data || response.data || null
      showMsg('error', response)
      response.data = data
      response.error = error
      response.message = message
      if (response.status === 401 || response.status === 403) {
        Token.deleteAll()
        // if (!process.server) window.location.replace('/login')
      }
    }
    return Promise.reject(response)
  }
)

export default axios
