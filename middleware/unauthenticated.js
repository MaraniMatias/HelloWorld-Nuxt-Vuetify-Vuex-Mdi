import Token from '~/api/Token'

export default function ({ store, redirect }) {
  if (store.getters.isLoggedIn === true || Token.get()) {
    return redirect('/inicio')
  }
}
