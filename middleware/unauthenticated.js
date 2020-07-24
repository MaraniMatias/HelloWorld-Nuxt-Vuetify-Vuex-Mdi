import Token from '~/api/Token'

export default function ({ redirect }) {
  if (Token.get()) {
    return redirect('/inicio')
  }
}
