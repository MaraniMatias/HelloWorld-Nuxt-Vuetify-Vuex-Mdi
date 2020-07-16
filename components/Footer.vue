<template>
  <div>
    <!--
    <v-footer class="grey lighten-2 px-2 hidden-lg-and-up">
      <v-icon
        :color="localServerConnect.color"
        @click="showModalLocalServeConectHelp = true"
        >mdi-circle
      </v-icon>
      <v-layout align-center justify-center>
        <p class="mb-0 mx-2">
          <v-icon>mdi-printer</v-icon>
          <b class="ml-1 mr-5">{{ pedidosImprecion }}</b>
          <v-icon>mdi-paperclip</v-icon>
          <b class="ml-1 mr-5">{{ pedidosAnillados }}</b>
          <v-icon>mdi-book-open-variant</v-icon>
          <b class="ml-1 mr-5">{{ pedidosLibros }}</b>
          <template v-if="isDeliveryEnabled">
            <v-icon>mdi-bike</v-icon>
            <b class="ml-1">{{ pedidosDespachar }}</b>
          </template>
        </p>
      </v-layout>
    </v-footer>
    -->
    <v-footer class="grey lighten-2 px-2 hidden-sm-and-down">
      <v-layout fill-height>
        <v-flex pr-2 md4 xs1 class="text-no-wrap text-truncate">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <span class="mr-2" v-on="on">
                Servidor local:
              </span>
            </template>
            <p class="mb-0 mr-2">
              Version:
              <span
                v-text="localServerConnect.version || 'Servidor desconectado'"
              />
            </p>
            <p
              v-if="localServerConnect.pendingUpdate"
              class="mb-0 mr-2"
              v-text="
                'Actualización pendiente: ' + localServerConnect.pendingUpdate
              "
            />
          </v-tooltip>
          <span
            :class="localServerConnect.class"
            v-text="localServerConnect.text"
          />

          <a
            v-show="showHelpMsg"
            class="link pb-0 ml-2"
            @click="showModalLocalServeConectHelp = true"
            >¿Necesita ayuda?
          </a>
          <v-tooltip v-show="sucursal && sucursal.id" top>
            <template v-slot:activator="{ on }">
              <span v-on="on">{{ sucursalText }}</span>
            </template>
            <p class="mb-1">Sucursal: {{ sucursal.descripcion }}</p>
            <p class="mb-1">Nro: {{ sucursal.id }}</p>
            <p class="mb-1">Dirección: {{ sucursal.direccion }}</p>
            <p class="mb-1">Whatsapp: {{ sucursal.whatsapp }}</p>
            <p class="mb-1">Email: {{ sucursal.mail }}</p>
            <p class="mb-1">Horarios:</p>
            <span class="horarios" v-html="sucursal.horarios" />
          </v-tooltip>
        </v-flex>
        <v-flex md4 xs9>
          <v-layout align-center justify-center>
            <p class="mb-0 mx-2">
              <span>Imprimir:</span>
              <b class="ml-1 mr-5">{{ pedidosImprecion }}</b>
              <span>Anillar:</span>
              <b class="ml-1 mr-5">{{ pedidosAnillados }}</b>
              <span>Libros:</span>
              <b class="ml-1 mr-5">{{ pedidosLibros }}</b>
              <template v-if="isDeliveryEnabled">
                <span>Por Enviar:</span>
                <b class="ml-1">{{ pedidosDespachar }}</b>
              </template>
            </p>
          </v-layout>
        </v-flex>
        <v-flex pl-2 md4 xs2>
          <v-layout justify-end>
            <p class="mb-0">
              <span class="mr-1" v-text="copyright" />
              <a
                class="link-footer"
                href="http://www.rapicopia.com.ar"
                target="_blank"
              >
                Rapicopia
              </a>
              <span class="mr-1" v-text="version" />
            </p>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-footer>
    <ModalLocalServeConectHelp
      :show="showModalLocalServeConectHelp"
      :width="400"
      @cancel="dialogModal()"
      @dialog="dialogModal($event)"
      @accept="dialogModal()"
    />
  </div>
</template>

<script>
/// <reference path="../types" />
import { mapGetters, mapState, mapActions } from 'vuex'

import Notification from '@/utils/Notification'
// import ModalLocalServeConectHelp from '@/components/Modal/ModalLocalServeConectHelp'
const ModalLocalServeConectHelp = () =>
  import('@/components/Modal/ModalLocalServeConectHelp')

export default {
  components: { ModalLocalServeConectHelp },
  data: () => ({
    showNoty: true,
    showModalLocalServeConectHelp: false,
  }),
  computed: {
    ...mapState('sucursales', ['sucursal']),
    ...mapState('operador/notificaciones', [
      'pedidosImprecion',
      'pedidosAnillados',
      'pedidosLibros',
      'pedidosDespachar',
    ]),
    ...mapState('operador/imprimir', ['localServer']),
    ...mapGetters('sucursales', ['isDeliveryEnabled']),
    ...mapGetters(['userIsAdmin']),

    sucursalText() {
      if (!this.localServerConnect.value || !this.sucursal || !this.sucursal.id)
        return ''
      return ` | Sucursal: ${this.sucursal.descripcion}`
    },
    version() {
      return ' v' + process.env.NUXT_ENV_VERSION
    },
    copyright() {
      return `© ${new Date().getFullYear()}`
    },
    showHelpMsg() {
      return this.localServerConnect.value === false
    },
    showIcon() {
      return this.$vuetify.breakpoint.mdAndDown
    },
    localServerConnect() {
      const connect = this.localServer.connect
      return {
        id: this.localServer.id,
        version: this.localServer.version,
        pendingUpdate: this.localServer.pendingUpdate,
        value: connect ?? 'Buscando...',
        text: connect ? 'Conectado' : 'Sin conexión',
        color: connect ? 'green' : 'red',
        class: connect ? 'green--text' : 'red--text',
      }
    },
  },
  mounted() {
    const self = this
    const delay = process.env.NODE_ENV === 'production' ? 60000 * 3 : 30000 * 5
    const interval = setInterval(function () {
      if (this.userIsAdmin === false) {
        clearInterval(interval)
      } else if (self.localServer && self.localServer.id) {
        self.checkNotification()
        self.showNoty = !self.showNoty
      }
    }, delay)
  },
  methods: {
    ...mapActions('operador/notificaciones', [
      'getNotificaiones',
      'restNotification',
    ]),
    async sendNotification(text = '') {
      const permitted = await Notification().show(text)
      if (permitted !== 'granted') {
        this.$notify({ text })
      }
    },
    async checkNotification() {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line
        console.log('get Notification')
      }
      const sucursalId = this.localServer.id // ?? null;
      if (typeof sucursalId === 'number') {
        const { data } = await this.getNotificaiones(sucursalId)
        if (this.showNoty && data.body) this.sendNotification(data.body)
      }
    },

    dialogModal() {
      this.showModalLocalServeConectHelp = false
      if (this.localServer.connect) {
        this.checkNotification()
      }
    },
  },
}
</script>

<style scope>
span.horarios p {
  margin-bottom: 0px !important;
}
</style>
