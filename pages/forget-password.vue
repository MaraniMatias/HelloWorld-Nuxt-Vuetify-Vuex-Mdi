<template>
  <div>
    <ChangePassword
      v-if="isRecovering"
      is-forget-password
      :success.sync="successPassword"
      :error="errorPassword"
      :loading="loading"
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
          <v-btn color="primary" @click="clear">Aceptar</v-btn>
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
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

import ChangePassword from '../components/ChangePassword'

export default {
  name: 'ForgetPasswordForm',
  components: { ChangePassword },
  data: () => ({
    error: '',
    reset: false,
    mail: '',
    dialog: false,
    errorDialog: false,
    isRecovering: false,
    token: '',
    errorPassword: '',
    successPassword: false,
    modalSucess: false,
  }),

  computed: {
    ...mapState(['loading']),
  },

  mounted() {
    if (this.$route.query.token) {
      this.token = this.$route.query.token
      this.isRecovering = true
      this.loadRecovery()
    }
  },

  methods: {
    ...mapActions([
      'forgetPassword',
      'checkRecoveryToken',
      'changePasswordRecovery',
    ]),

    clear() {
      this.token = ''
      this.reset = !this.reset
      this.isRecovering = false
      this.errorDialog = false
    },

    async submitEmail(formValid) {
      if (!formValid) {
        this.error = 'Complete el campo con un email válido.'
        return
      }
      const { error } = await this.forgetPassword({
        mail: this.mail,
      })
      if (!error) {
        this.dialog = true
      } else {
        this.error = error
      }
    },

    async loadRecovery() {
      const { error } = await this.checkRecoveryToken(this.token)
      if (error) {
        this.errorDialog = true
      }
    },

    async submitPassword({ newPassword }) {
      this.errorPassword = ''
      const { error } = await this.changePasswordRecovery({
        newPassword,
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
