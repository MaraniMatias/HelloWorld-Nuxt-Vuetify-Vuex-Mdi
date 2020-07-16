<template>
  <v-layout column mb-2 px-2 mt-4>
    Admin
  </v-layout>
</template>

<router>
  meta:
    name: "Informes"
</router>

<script>
import { isMobile } from 'mobile-device-detect'

export default {
  middleware({ redirect }) {
    return redirect('/admin/informes/operaciones-saldo-con-usuarios')
  },
  layout() {
    return isMobile ? 'mobile-panel' : 'admin'
  },
  components: {},
  asyncData() {},
  data: () => ({}),
  computed: {},
  mounted() {},
  methods: {},
}
</script>
