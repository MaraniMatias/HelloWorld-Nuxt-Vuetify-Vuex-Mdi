/// <reference path="../types/index.js" />
import Snackbar from '../utils/Snackbar'

export const state = () => ({
  alert: {},
})

export const getters = {}

export const mutations = {
  /** @param state {{alert:Alert}} */
  show(state, payload) {
    payload.type = payload.color || payload.type
    state.alert = new Snackbar(payload)
  },
}

export const actions = {}
