<template>
  <v-container class="fill-height margin-top-fix" fluid>
    <v-layout justify-center>
      <v-layout v-show="!loading" column justify-center align-center>
        <v-flex xs12 md6 lg4 xl3>
          <CardForm hide-header @submit="authLocal">
            <template v-slot:header>Acceder</template>
            <template v-slot:default="{ rules }">
              <v-text-field
                v-model.lazy="email"
                label="E-mail"
                name="email"
                :success="emailValid"
                :hint="emailValid ? 'Email validado con exito' : void 0"
                :append-icon="emailValid ? 'mdi-check' : void 0"
                :persistent-hint="emailValid"
                required
                type="email"
                :rules="[rules.required(), rules.email()]"
                :readonly="loading"
                @change="emailValid = false"
              />
              <v-text-field
                v-model.lazy="password"
                label="Contraseña"
                name="password"
                required
                :append-icon="
                  showPass ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
                "
                :type="showPass ? 'text' : 'password'"
                :rules="[rules.required()]"
                :readonly="loading"
                @click:append="showPass = !showPass"
              />
              <v-flex xs12 my-1 pb-2>
                <a :disabled="loading" @click="sendEmailForgetPassword">
                  ¿Olvidaste tu contraseña?
                </a>
              </v-flex>
            </template>
            <template v-slot:message>
              <error :text="error" />
            </template>
            <template v-slot:actions>
              <v-btn text :disabled="loading" to="/singup" replace>
                Crear Cuenta
              </v-btn>
              <v-btn :disabled="loading" color="primary" type="submit">
                Iniciar Sesión
              </v-btn>
            </template>
          </CardForm>
        </v-flex>

        <v-flex xs12 md6 lg4 mt-4>
          <v-flex>
            <v-layout align-center my-3>
              <v-divider class="mr-4" />
              <span>Iniciar Sesión o Crear Cuenta</span>
              <v-divider class="ml-4" />
            </v-layout>
          </v-flex>

          <v-row align="center" justify="center">
            <v-col>
              <v-btn
                dark
                color="#3c66c4"
                depressed
                x-large
                @click="auth('facebook')"
              >
                Facebook
              </v-btn>
            </v-col>
            <v-col>
              <v-btn
                dark
                color="#cf4332"
                depressed
                x-large
                @click="auth('google')"
              >
                Google
              </v-btn>
            </v-col>
          </v-row>
        </v-flex>
      </v-layout>
      <v-layout v-show="loading" column justify-center align-center>
        <v-progress-circular
          :size="70"
          :width="7"
          color="primary"
          indeterminate
        />
        <p class="mt-4">Iniciando Sesión</p>
      </v-layout>
      <v-dialog v-model="reenvioMail" persistent max-width="290">
        <v-card>
          <CardForm>
            <template v-slot:header>Email no verificado</template>
            <template>
              <p>Verifique su casilla de correo no deseados.</p>
              ¿No recibiste el email?
              <p><a @click="reSendEmail()">Volver a enviar el email</a></p>
            </template>
            <template v-slot:actions>
              <v-btn color="primary" @click="reenvioMail = false"
                >Aceptar</v-btn
              >
            </template>
          </CardForm>
        </v-card>
      </v-dialog>
      <v-dialog v-model="modalForgetPassword" persistent max-width="290">
        <v-card>
          <CardForm>
            <template v-slot:header>Cambio de contraseña.</template>
            <template>
              Hemos enviado un email a su dirección de correo electrónico para
              continuar con el cambio de contraseña.
            </template>
            <template v-slot:actions>
              <v-btn color="primary" @click.stop="modalForgetPassword = false">
                Aceptar
              </v-btn>
            </template>
          </CardForm>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Token from '../api/Token'
import CardForm from '../components/CardForm'

export default {
  components: { CardForm },
  asyncData({ query = {} }) {
    const auth = JSON.parse(sessionStorage.getItem('auth')) || {}
    sessionStorage.clear()
    return {
      error: auth.error,
      token: auth.token,
      validThisEmail: query.token && query.email ? query : null,
    }
  },
  middleware: ['unauthenticated'],
  data: () => ({
    showPass: false,
    password: '',
    email: '',
    reenvioMail: false,
    modalForgetPassword: false,
    emailValid: false,
    loading: true,
    rtaModalForgetPassword: false,
  }),
  computed: {
    ...mapGetters(['userIsAdmin', 'isLoggedIn']),
  },
  async created() {
    // obtener el token desde la url que trabajo google o facebook
    if (this.isLoggedIn) {
      this.redentToInicioPage()
    } else if (this.token) {
      Token.set(this.token)
      const { data } = await this.getMe()
      if (data) this.redentToInicioPage()
      this.loading = false
    } else {
      this.loading = false
    }
  },
  async mounted() {
    if (this.validThisEmail) {
      const { error } = await this.signupVerification(this.validThisEmail)
      this.email = this.validThisEmail.email
      this.loading = false
      this.emailValid = !error
    }
  },
  methods: {
    ...mapActions([
      'login',
      'getMe',
      'sendEmail',
      'forgetPassword',
      'signupVerification',
    ]),
    redentToInicioPage() {
      this.$router.replace(this.userIsAdmin ? '/admin' : '/inicio')
    },
    auth(type) {
      this.loading = true
      const url = process.env.NUXT_ENV_SERVER_API + '/api/auth/' + type
      window.location.replace(url)
    },

    async authLocal(formValid) {
      if (!formValid) return
      this.loading = true
      const { error, data } = await this.login({
        email: this.email,
        password: this.password,
      })
      if (error) {
        this.error = error
      } else if (data.email_verified) {
        this.redentToInicioPage()
      } else {
        this.reenvioMail = true
      }
      this.loading = false
    },
    async reSendEmail() {
      this.loading = true
      const { error } = await this.sendEmail({ email: this.email })
      if (error) {
        this.error = error
      } else {
        this.reenvioMail = false
      }
      this.loading = false
    },
    // TODO perdi la contraseña pero estoy logeado con facebook o Google
    async sendEmailForgetPassword() {
      if (!this.email) {
        this.error = 'Indicamos el email de la cuenta.'
      } else {
        this.loading = true
        const { error } = await this.forgetPassword({ email: this.email })
        if (error) {
          this.error = error
        } else {
          this.modalForgetPassword = true
        }
        this.loading = false
      }
    },
    closeModalForgetPassword() {
      this.modalForgetPassword = false
      this.rtaModalForgetPassword = false
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
