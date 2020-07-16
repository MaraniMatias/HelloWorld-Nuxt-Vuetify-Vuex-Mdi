import MessagesError from '../utils/MessagesError'
import http from './http'

const get = (BASE_URL) => async (params = {}) => {
  try {
    if (params.query) {
      params.query.deleted = false
    } else {
      params.query = { deleted: false }
    }
    return await http.get(BASE_URL, { params })
  } catch (resp) {
    return MessagesError(resp)
  }
}

const getAll = (BASE_URL) => async (params = {}) => {
  try {
    return await http.get(BASE_URL, { params })
  } catch (resp) {
    return MessagesError(resp)
  }
}

const getById = (BASE_URL) => async (_id, params = {}) => {
  try {
    return await http.get(BASE_URL + `/${_id}`, { params })
  } catch (resp) {
    return MessagesError(resp)
  }
}

const save = (BASE_URL) => async (object = {}) => {
  try {
    if (object._id) return await http.patch(BASE_URL + `/${object._id}`, object)
    else return await http.post(BASE_URL, object)
  } catch (resp) {
    return MessagesError(resp)
  }
}

const del = (BASE_URL) => async (object = {}) => {
  try {
    return await http.path(BASE_URL + `/${object._id}`, { deleted: true })
  } catch (resp) {
    return MessagesError(resp)
  }
}

export default (url) => {
  const BASE_URL = process.env.SERVER_URL + '/api' + url
  return {
    save: save(BASE_URL),
    delete: del(BASE_URL),
    getAll: getAll(BASE_URL),
    get: get(BASE_URL),
    getById: getById(BASE_URL),
  }
}
