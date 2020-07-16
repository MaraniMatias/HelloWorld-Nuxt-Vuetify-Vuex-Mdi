import Token from '~/api/Token'

export default function ({ store, redirect }) {
  if (store.getters.isLoggedIn === false) {
    if (Token.get()) {
      store.dispatch('getMe').then((rta) => {
        if (rta.error) {
          return redirect('/login')
        }
      })
    } else {
      return redirect('/login')
    }
  }
}
