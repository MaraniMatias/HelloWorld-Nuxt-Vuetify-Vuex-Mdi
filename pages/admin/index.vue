<template>
  <v-layout column mb-2 px-2 mt-4>
    Admin
  </v-layout>
</template>

<router>
  meta:
    name: "Panel"
</router>

<script>
import { isMobile } from 'mobile-device-detect'

export default {
  middleware({ redirect }) {
    // return redirect('/panel/usuarios')
    return redirect('/admin/informes')
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
