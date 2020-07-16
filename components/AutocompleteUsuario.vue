<template>
  <v-autocomplete
    v-model="usuario"
    :append-outer-icon="hideIcon ? '' : 'mdi-magnify'"
    :class="{
      'pt-0': $vuetify.breakpoint.lgAndUp,
      'mx-4': $vuetify.breakpoint.lgAndUp,
    }"
    :disabled="disabled"
    hide-details
    hide-selected
    :items="items"
    :error-messages="error"
    item-text="descripcion"
    item-key="id"
    label="Buscar usuario"
    :loading="isLoading"
    :clearable="clearable"
    name="searchUser"
    return-object
    :search-input.sync="query"
    @click:append-outer="search()"
    @keyup.enter="search()"
  >
    <template v-slot:no-data>
      <v-list-item>
        <p class="mb-0">
          Buscar por <strong>Mail, Apellido, Nombre o Nro. de Documento</strong>
        </p>
      </v-list-item>
    </template>
    <template v-slot:selection="{ item }">
      {{ itemHeadline(item) }}
    </template>
    <template v-slot:item="{ item }">
      <v-list-item-content>
        <v-list-item-title>{{ item.displayName }}</v-list-item-title>
        <v-list-item-subtitle>{{
          item.documento + ' - ' + item.mail
        }}</v-list-item-subtitle>
      </v-list-item-content>
    </template>
  </v-autocomplete>
</template>

<script>
import { getUsuarios } from '@/api/modules/usuario'
import priceFilter from '@/mixins/priceFilter'
import EstadoUsuario from '@/utils/enum/EstadoUsuario'

export default {
  components: {},
  mixins: [priceFilter],
  props: {
    disabled: { type: Boolean, default: false },
    clearable: { type: Boolean, default: false },
    value: { type: Object, default: null },
    estados: { type: Array, default: () => [EstadoUsuario.HABILITADO] },
    showSaldo: { default: false, type: Boolean },
    hideIcon: { default: false, type: Boolean },
    error: { type: String, default: '' },
  },
  data: () => ({
    usuario: null,
    query: '',
    items: [],
    isLoading: false,
  }),
  computed: {},
  watch: {
    query: 'search',
    usuario(val) {
      this.$emit('input', val)
      this.$emit('change', val)
    },
    value(val) {
      this.usuario = val
    },
  },
  created() {
    this.usuario = this.value
  },
  methods: {
    itemHeadline(item = {}) {
      return this.showSaldo
        ? `${item.displayName} - ${this.priceFilter(item.saldo)}`
        : item.displayName
    },

    async search() {
      this.isLoading = true
      // this.items = [];
      if (this.query && this.query.length > 2) {
        const { data } = await getUsuarios({
          freetext: this.query,
          estados: this.estados,
        })
        this.items = Object.freeze(data)
      }
      this.isLoading = false
    },
  },
}
</script>
