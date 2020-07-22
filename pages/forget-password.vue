<template>
  <v-layout justify-center>
    <v-flex md6>
      <ChangePassword
        is-forget-password
        :success.sync="successPassword"
        :error="errorPassword"
        @submit="submitPassword"
        @cancel="$router.go('/')"
      />
      <v-dialog v-model="errorDialog" persistent max-width="290">
        <v-card>
          <v-card-title class="headline">Error</v-card-title>
          <v-card-text>
            Su token es inválido o ha expirado. Puede solicitar uno nuevo
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" to="/login">Aceptar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="modalSucess" persistent max-width="290">
        <v-card>
          <v-card-title class="headline">Contraseña actualizada</v-card-title>
          <v-card-text>
            Presione Aceptar para iniciar sesión con la nueva contraseña.
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" to="/login">Aceptar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-flex>
  </v-layout>
</template>
<router>
  meta:
    withoutAuth: true
</router>
<script>
import { mapActions } from 'vuex'

import ChangePassword from '../components/ChangePassword'

export default {
  name: 'ForgetPasswordForm',
  components: { ChangePassword },
  data: () => ({
    errorDialog: false,
    token: '',
    errorPassword: '',
    successPassword: false,
    modalSucess: false,
  }),

  mounted() {
    if (this.$route.query.token) {
      this.token = this.$route.query.token
      this.loadRecovery()
    }
  },

  methods: {
    ...mapActions(['checkRecoveryToken', 'changeForgetPassword']),

    async loadRecovery() {
      const { error } = await this.checkRecoveryToken(this.token)
      if (error) {
        this.errorDialog = true
      }
    },

    async submitPassword({ newPassword }) {
      this.errorPassword = ''
      const { error } = await this.changeForgetPassword({
        password: newPassword,
        token: this.token,
      })
      if (error) {
        this.errorPassword = error
      } else {
        this.successPassword = true
        this.modalSucess = true
      }
    },
  },
}
</script>

<style scoped>
p.error--text.show-error {
  text-align: center;
  margin-bottom: 0;
}
</style>
