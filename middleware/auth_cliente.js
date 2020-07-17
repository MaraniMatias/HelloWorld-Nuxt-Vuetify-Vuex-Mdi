/// <reference path="../types/index.js" />
import UsuarioRoles from '~/utils/enum/UsuarioRoles'

export default function ({ store, redirect }) {
  if (store.state.user.roles?.includes(UsuarioRoles.ADMIN)) {
    return redirect('/admin')
  }
}
