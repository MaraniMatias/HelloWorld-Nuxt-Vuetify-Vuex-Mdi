import http from '~/api/http'
import Token from '~/api/Token'
import UsuarioRoles from '~/utils/enum/UsuarioRoles'

export const state = () => ({
  user: {},
})

export const getters = {
  isLoggedIn: (state) => !!state.user._id,
  userIsAdmin: (state) => state.user.roles?.includes(UsuarioRoles.ADMIN),
}

export const mutations = {
  SET_USER(state, user) {
    state.user = user
  },
}

export const actions = {
  async login({ commit }, { email, password }) {
    try {
      const { data } = await http.post('/api/auth/login', { email, password })
      if (data.email_verified) {
        commit('SET_USER', data)
      }
      return { data }
    } catch (rta) {
      return rta
    }
  },
  async signup(_, user) {
    try {
      return await http.post('/api/auth/signup', user)
    } catch (rta) {
      return rta
    }
  },
  async logout({ commit }) {
    try {
      const rta = await http.post('/api/auth/logout')
      Token.deleteAll()
      commit('SET_USER', {})
      return rta
    } catch (rta) {
      return rta
    }
  },
  async sendEmail(_, { email }) {
    try {
      return await http.post('/api/auth/sendemail', { email })
    } catch (rta) {
      return rta
    }
  },
  async signupVerification(_, { email, token }) {
    try {
      return await http.post('/api/auth/signup/verification', {
        email,
        token,
      })
    } catch (rta) {
      return rta
    }
  },
  async forgetPassword(_, { email }) {
    try {
      return await http.post('/api/auth/forgetpassword', { email })
    } catch (rta) {
      return rta
    }
  },
  async changeForgetPassword(_, { email, password, token }) {
    try {
      return await http.post('/api/auth/forgetpassword/change', {
        email,
        token,
        password,
      })
    } catch (rta) {
      return rta
    }
  },
  async getMe({ commit }) {
    try {
      const { data } = await http.get('/api/auth/me')
      commit('SET_USER', data)
      return { data }
    } catch (rta) {
      return rta
    }
  },
}
