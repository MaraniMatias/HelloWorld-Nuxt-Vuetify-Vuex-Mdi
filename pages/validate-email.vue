<template>
  <v-layout align-center justify-center fill-height>
    <v-flex xs12 lg5 xl3>
      <v-layout align-center justify-center column fill-height>
        <v-flex v-show="loading" xs12 mb-1 class="text-center">
          <v-progress-circular
            size="90"
            width="12"
            color="grey darken-1"
            indeterminate
            :active="loading"
          />
          <p class="mt-2" style="font-size: 20px;">
            Verificando su correo electrónico...
          </p>
        </v-flex>
        <transition name="fade">
          <v-flex v-show="!loading" xs12 mb-1 class="text-center">
            <template v-if="isLinkValid">
              <v-icon size="96" color="green lighten-1">
                mdi-check-circle-outline
              </v-icon>
              <p style="font-size: 20px;" class="mt-4">
                Su correo fue verificado, puedes acceder.
              </p>
              <v-btn
                color="primary"
                dark
                depressed
                x-large
                to="/login"
                outlined
              >
                Iniciar Sesión
              </v-btn>
            </template>
            <template v-else>
              <v-icon size="96" color="red lighten-1">
                mdi-close-circle-outline
              </v-icon>
              <p style="font-size: 20px;" class="mt-4">
                Lo sentimos, este link es inválido.
              </p>
              <n-link to="/login">Volver al login</n-link>
            </template>
          </v-flex>
        </transition>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<router>
  meta:
    withoutAuth: true
</router>

<script>
import { mapActions } from 'vuex'

export default {
  components: {},
  asyncData({ query = {} }) {
    return { id: query.id, hash: query.hash }
  },
  data: () => ({
    isLinkValid: true,
    loading: true,
  }),
  computed: {},
  async created() {
    this.loading = true
    const { data } = await this.validateMail({
      hash: this.hash,
      idUser: this.id,
    })
    this.isLinkValid = !!data
    if (this.isLinkValid === false) {
      await this.signOut()
      // } else {
      //   this.$ga.commands.usuario.validMail()
    }
    this.loading = false
  },
  mounted() {},
  methods: {
    ...mapActions(['validateMail', 'signOut']),
  },
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
