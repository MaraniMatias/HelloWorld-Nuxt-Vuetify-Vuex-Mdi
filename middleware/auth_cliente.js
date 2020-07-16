/// <reference path="../types/index.js" />
import TipoUsuario from '~/utils/enum/TipoUsuario'

export default function ({ store, redirect }) {
  if (TipoUsuario.ADMINISTRADOR === store.state.user?.tipoUsuario) {
    return redirect('/admin')
  }
}
