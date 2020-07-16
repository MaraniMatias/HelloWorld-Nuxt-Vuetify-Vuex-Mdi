<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center" class="mb-12">
      <div class="text-center">
        <img
          src="/img/logo_rapicopia.png"
          alt="logo de rapicopia"
          style="max-width: 256px;"
          width="100%"
          height="100%"
          class="mb-6"
        />
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
    await this.signOut()
    this.$router.replace('/')
  },
  methods: {
    ...mapActions(['signOut']),
  },
}
</script>
