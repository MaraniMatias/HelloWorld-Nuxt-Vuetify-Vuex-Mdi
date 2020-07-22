import Token from '~/api/Token'

export default function ({ store, redirect }) {
  if (store.getters.isLoggedIn === true) {
    return redirect('/inicio')
  }
  if (Token.get()) {
    store.dispatch('getMe').then((rta) => {
      if (!rta.error) {
        return redirect('/inicio')
      }
    })
  }
}
