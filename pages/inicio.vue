<template>
  <v-layout column justify-center pb-12 mb-2 mt-4 px-2>
    Cliente page
  </v-layout>
</template>

<script>
export default {
  middleware: ['authenticated', 'auth_cliente'],
  components: {},
  asyncData() {},
  computed: {},
}
</script>
