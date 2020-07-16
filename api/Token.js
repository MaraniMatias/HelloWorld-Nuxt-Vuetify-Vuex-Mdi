'use strict'
export default (function () {
  /** @type {(null|string)} */
  let _token = null
  return {
    /** @param {string} token */
    set(token) {
      _token = /^Bearer\s.+$/.test(token) ? token : `Bearer ${token}`
      localStorage.setItem('_t', _token)
    },
    get() {
      if (_token) return _token
      _token = localStorage.getItem('_t')
      return _token
    },
    delete() {
      localStorage.removeItem('_t')
      _token = null
    },
    deleteAll() {
      localStorage.clear()
      _token = null
    },
  }
})()
