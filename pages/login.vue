<template>
  <v-container class="fill-height margin-top-fix" fluid>
    <v-layout v-if="isLoggedIn" column fill-height>
      <v-layout
        align-start
        justify-center
        fill-height
        style="margin-top: 124px;"
      >
        <v-flex xs12 md10 lg10 xl6 ma-3 class="text-center">
          <img
            src="/img/logo_rapicopia.png"
            alt="logo de rapicopia"
            style="max-width: 256px;"
            width="100%"
            height="100%"
          />
        </v-flex>
      </v-layout>
    </v-layout>
    <v-layout v-else align-center justify-center fill-height>
      <v-flex xs12 lg5 xl3>
        <CardForm style="max-width: 400px; margin: auto;" @submit="submit">
          <template v-slot:header>Acceder</template>
          <template v-slot:default="{ rules }">
            <v-text-field
              v-model.lazy="mail"
              label="E-mail"
              name="email"
              required
              type="email"
              :rules="[rules.required(), rules.email()]"
              :readonly="loading"
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
              <a :disabled="loading" @click="modalForgetPassword = true">
                ¿Olvidaste tu contraseña?
              </a>
            </v-flex>
          </template>
          <template v-slot:message>
            <error :text="error" />
          </template>
          <template v-slot:actions>
            <v-btn text :disabled="loading" to="/register" replace>
              Crear Cuenta
            </v-btn>
            <v-btn :disabled="loading" color="primary" type="submit">
              Iniciar Sesión
            </v-btn>
          </template>
        </CardForm>
        <v-layout column>
          <v-layout align-center mt-3>
            <v-divider class="mr-4" />
            <span>Iniciar Sesión o Crear Cuenta</span>
            <v-divider class="ml-4" />
          </v-layout>
          <v-layout align-center justify-center wrap>
            <v-btn
              dark
              color="#3c66c4"
              depressed
              x-large
              class="mx-4 mt-4"
              @click="authFacebook"
            >
              Facebook
            </v-btn>
            <v-btn
              dark
              color="#cf4332"
              depressed
              x-large
              class="mx-4 mt-4"
              @click="authGoogle"
            >
              Google
            </v-btn>
          </v-layout>
        </v-layout>
      </v-flex>
      <ModalConfirm
        :show="reenvioMail"
        :width="290"
        @cancel="reenvioMail = false"
        @accept="reenvioMail = false"
      >
        <template v-slot:header>Email no verificado</template>
        <template>
          <p>Verifique su casilla de correo no deseados.</p>
          ¿No recibiste el email?
          <p><a @click="reSendEmail()">Volver a enviar el email</a></p>
        </template>
      </ModalConfirm>
      <v-dialog v-model="modalForgetPassword" persistent max-width="350">
        <CardForm @submit="sendEmailForgetPassword">
          <template v-slot:header>Olvidé mi contraseña</template>
          <template v-slot:default="{ rules }">
            <v-flex xs12>
              <v-text-field
                v-model.lazy="mail"
                label="E-mail"
                name="email"
                required
                type="email"
                :rules="[rules.required(), rules.email()]"
                :readonly="loading"
              />
            </v-flex>
            <p class="grey--text mb-1 mt-0">
              Este sitio está protegido por reCaptcha y Google. Aplican
            </p>
            <p class="grey--text mb-1 mt-0">
              <a href="https://policies.google.com/privacy">
                Políticas de Privacidad
              </a>
              y
              <a href="https://policies.google.com/terms">
                Términos del servicio </a
              >.
            </p>
          </template>
          <template v-slot:message>
            <error :text="error" />
          </template>
          <template v-slot:actions>
            <v-btn
              text
              :disabled="loading"
              @click="modalForgetPassword = false"
            >
              Cancelar
            </v-btn>
            <v-btn :disabled="loading" color="primary" type="submit">
              Aceptar
            </v-btn>
          </template>
        </CardForm>
      </v-dialog>
      <ModalConfirm
        :show="rtaModalForgetPassword"
        :width="290"
        @cancel="rtaModalForgetPassword = false"
        @accept="closeModalForgetPassword()"
      >
        <template v-slot:header>Olvidé mi contraseña</template>
        <template>
          <p>Hemos enviado un email a {{ mail }} para recuperar su cuenta.</p>
          <p>Recuerde revisar los correos no deseados.</p>
        </template>
      </ModalConfirm>
    </v-layout>
  </v-container>
</template>

<router>
  meta:
    withoutAuth: true
</router>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import Token from '../api/Token'
import { EstadoUsuario } from '../utils/enum'
import getGCaptcha from '../utils/getGCaptcha'
import CardForm from '../components/CardForm'
import ModalConfirm from '../components/Modal/ModalConfirm'

export default {
  components: { CardForm, ModalConfirm },
  asyncData() {
    const auth = JSON.parse(sessionStorage.getItem('auth')) || {}
    sessionStorage.clear()
    return { error: auth.error, token: auth.token }
  },
  data: () => ({
    showPass: false,
    reenvioMail: false,
    password: '',
    mail: '',
    modalForgetPassword: false,
    rtaModalForgetPassword: false,
  }),
  computed: {
    ...mapState({ _loading: 'loading' }),
    ...mapGetters(['getUserType', 'userIsAdmin', 'isLoggedIn']),
    loading: {
      get() {
        return this._loading
      },
      set(val) {
        this.setLoading(val)
      },
    },
  },
  async created() {
    // obtener el token desde la url que trabajo google o facebook
    if (this.isLoggedIn) {
      this.redentToInicioPage()
    } else if (this.token) {
      Token.set(this.token)
      const { data } = await this.getMe()
      if (data) {
        this.redentToInicioPage()
      }
    }
  },
  methods: {
    ...mapActions([
      'signIn',
      'sendEmail',
      'getMe',
      'setLoading',
      'forgetPassword',
    ]),
    redentToInicioPage() {
      this.$router.replace(this.userIsAdmin ? '/panel' : '/inicio')
    },

    async submit(formValid) {
      this.error = ''

      if (formValid && !this.loading) {
        const { error } = await this.signIn({
          mail: this.mail,
          password: this.password,
        })
        if (typeof error === 'undefined' && this.isLoggedIn) {
          // this.$ga.commands.usuario.login(this.getUserType)

          // Entro para ver un apunte si existe este item
          const apunte = sessionStorage.getItem('apunte')
          if (apunte) {
            const name = this.userIsAdmin ? 'panel-apuntes' : 'search'
            sessionStorage.removeItem('apunte')
            this.$router.replace({ name, query: { apunte } })
          } else {
            this.redentToInicioPage()
          }
        } else if (error?.[0] === EstadoUsuario.VALIDAR_MAIL) {
          this.reenvioMail = true
        } else {
          this.error = error
        }
      }
    },

    async reSendEmail() {
      this.error = ''
      this.reenvioMail = false
      const captchaValue = await getGCaptcha('forgetPassword')
      if (captchaValue && this.mail && !this.loading) {
        const { error } = await this.sendEmail({
          mail: this.mail,
          captchaValue,
        })
        this.error = error
      }
    },
    getOauthUrl(type) {
      const redirectUri =
        // window.location.protocol + '//' + window.location.host + '/login'
        window.location.protocol +
        '//' +
        window.location.host +
        '/callback.html'
      return (
        process.env.NUXT_ENV_SERVER_API +
        '/oauth2/authorize/' +
        type +
        '?redirect_uri=' +
        encodeURIComponent(redirectUri)
      )
    },
    authFacebook() {
      this.loading = true
      window.location.replace(this.getOauthUrl('facebook'))
    },
    authGoogle() {
      this.loading = true
      /*
      const win = window.open(
        process.env.SERVER_URL + '/api/auth/google',
        'Google',
        'width=500,height=600,scrollbars=no'
      )
      const interVal = setInterval(function () {
        if (win.closed) {
          console.log('close')
          clearInterval(interVal)
        }
      }, 500)
      */
      window.location.replace(this.getOauthUrl('google'))
    },
    async sendEmailForgetPassword(formValid) {
      if (!formValid || !this.mail) {
        this.error = 'Indicamos el email de la cuenta.'
      } else {
        this.loading = true
        const captchaValue = await getGCaptcha('forgetPassword')
        if (captchaValue) {
          const { error } = await this.forgetPassword({
            mail: this.mail,
            captchaValue,
          })
          this.error = error // ||"Usuario o Contraseña incorrecto.";
          this.rtaModalForgetPassword = !error
        }
        this.loading = false
      }
    },
  },
  closeModalForgetPassword() {
    this.modalForgetPassword = false
    this.rtaModalForgetPassword = false
  },
}
</script>

<style scoped>
p.error--text.show-error {
  text-align: center;
  margin-bottom: 0;
}
</style>
