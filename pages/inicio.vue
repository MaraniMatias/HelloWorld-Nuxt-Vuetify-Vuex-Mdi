<template>
  <v-layout column justify-center pb-12 mb-2 mt-4 px-2>
    <!-- Alert message -->
    <v-layout v-if="isSomeOfficeHoliday" justify-center fill-height>
      <v-flex xs12 lg8>
        <v-alert
          text
          dense
          border="left"
          :type="isAllOfficeHoliday ? 'error' : 'warning'"
        >
          <p v-if="isAllOfficeHoliday" class="mb-0">
            El establecimiento se encuentra cerrado.
          </p>
          <v-layout v-for="(suc, key) in someOfficeHoliday" :key="key" column>
            <p
              v-show="isSomeOfficeHoliday !== 1"
              class="mb-0 title"
              v-text="suc.descripcion"
            />
            <p class="mb-0" v-text="suc.mensajeVacaciones" />
          </v-layout>
        </v-alert>
      </v-flex>
    </v-layout>
    <v-layout v-if="isPendiente" justify-center fill-height>
      <v-flex xs12 lg8>
        <v-alert text dense border="left" colored-border type="warning">
          <p class="mb-0">
            Cuenta Profesor pendiente de validación. Por favor valide su cuenta
            presencialmente en la fotocopiadora.
          </p>
        </v-alert>
      </v-flex>
    </v-layout>
    <!-- Logo -->
    <v-flex xs12 md10 lg10 xl6 mx-3 mb-3 mt-4 class="text-center">
      <v-flex xs12>
        <img
          src="/img/logo_rapicopia.png"
          alt="logo de rapicopia"
          :style="{ 'max-width': logoHeight }"
          width="100%"
          height="100%"
        />
      </v-flex>
    </v-flex>

    <v-layout justify-center fill-height>
      <v-flex xs12 md11 lg11 xl6>
        <v-layout column justify-center>
          <v-flex xs12 pb-2>
            <p class="title my-2">Buscar apuntes</p>
            <!-- Busqueda -->
            <SearchBar advanced-search />
            <!-- Subit archivo -->
          </v-flex>
          <v-flex xs12>
            <p class="title my-2">Agrega archivos pdf a tu pedido</p>
            <UploadFile key-grup="CART" multiple class="mx-4" />
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import SearchBar from '../components/SearchBar'
import UploadFile from '../components/UploadFile'
import { EstadoUsuario } from '../utils/enum'

function logoHeight(name) {
  switch (name) {
    case 'xs':
      return '150px'
    case 'sm':
      return '180px'
    case 'md':
      return '200px'
    default:
      return '294px'
  }
}

export default {
  middleware: ['authenticated', 'auth_cliente'],
  components: { SearchBar, UploadFile },
  asyncData({ $vuetify, store }) {
    store.commit('setDrawer', $vuetify.breakpoint.mdAndUp)
    return {
      logoHeight: logoHeight($vuetify.breakpoint.name),
    }
  },
  computed: {
    ...mapState(['user']),
    ...mapState('sucursales', ['sucursales']),
    isPendiente() {
      return this.user.estadoUsuario === EstadoUsuario.PENDIENTE
    },
    isAllOfficeHoliday() {
      return this.sucursales.every((s) => s.onVacation)
    },
    someOfficeHoliday() {
      return this.sucursales.filter(
        (s) => s.fourDaysLeftToVaction || s.onVacation
      )
    },
    isSomeOfficeHoliday() {
      return this.someOfficeHoliday.length
    },
  },
}
</script>
