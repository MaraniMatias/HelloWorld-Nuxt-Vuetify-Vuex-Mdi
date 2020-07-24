<template>
  <v-layout column mb-2 px-2 mt-4>
    Admin - private page
  </v-layout>
</template>

<router>
  meta:
    name: "Panel"
</router>

<script>
export default {
  middleware: [
    'authenticated',
    'auth_admin',
    function ({ redirect }) {
      return redirect('/admin/usuarios')
    },
  ],
  layout: 'admin',
  components: {},
  asyncData() {},
  data: () => ({}),
  computed: {},
  mounted() {},
  methods: {},
}
</script>
