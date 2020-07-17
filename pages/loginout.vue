<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center" class="mb-12">
      <div class="text-center">
        <h1>Adiós</h1>
        <p class="description mt-4">
          <NuxtLink to="/">Ir al inicio</NuxtLink>
        </p>
      </div>
    </v-row>
  </v-container>
</template>

<router>
  meta:
    withoutAuth: true
</router>

<script>
import { mapActions } from 'vuex'

export default {
  async created() {
    await this.logout()
    this.$router.replace('/')
  },
  methods: {
    ...mapActions(['logout']),
  },
}
</script>
