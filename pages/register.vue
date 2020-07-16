<template>
  <v-layout align-center justify-center fill-height>
    <v-flex xs12 lg5 xl3>
      <CardForm :disabled="loading" @submit="submit">
        <template v-slot:header>Crear Cuenta</template>
        <template v-slot:default="{ rules }">
          <v-layout wrap align-center>
            <v-flex xs12 md6>
              <v-text-field
                v-model.lazy="form.nombre"
                index="0"
                label="Nombre"
                name="nombre"
                required
                type="text"
                :rules="[
                  rules.required(),
                  rules.alpha_spaces(),
                  rules.min(3),
                  rules.max(20),
                ]"
              />
            </v-flex>
            <v-flex xs12 md6>
              <v-text-field
                v-model.lazy="form.apellido"
                index="1"
                label="Apellido"
                name="apellido"
                required
                type="text"
                :rules="[
                  rules.required(),
                  rules.alpha_spaces(),
                  rules.min(3),
                  rules.max(20),
                ]"
              />
            </v-flex>
            <v-flex xs12 md6>
              <v-select
                v-model.lazy="form.tipoDocumento"
                index="2"
                :items="listTipoDocumento"
                item-text="label"
                item-value="value"
                label="Tipo Documento"
                name="tipoDocumento"
                required
              />
            </v-flex>
            <v-flex xs12 md6>
              <v-text-field
                v-model.lazy="form.numeroDocumento"
                index="3"
                label="Nro de Documento"
                name="documento"
                required
                type="text"
                :rules="[
                  rules.required(),
                  rules.alpha_num(),
                  rules.min(4),
                  rules.max(11),
                ]"
              />
            </v-flex>
            <v-flex xs12 md6>
              <DateField
                v-model.lazy="form.fechaNacimiento"
                label="Fecha de nacimiento"
                index="4"
                :max="new Date().toISOString().substr(0, 10)"
                min="1950-01-01"
                start-on-year
                only-adult
                required
              />
            </v-flex>
            <v-flex xs12 md6 class="hidden-md-and-down"></v-flex>
            <v-flex xs12 md6>
              <v-text-field
                v-model.lazy="form.mail"
                index="6"
                label="E-mail"
                name="email"
                type="email"
                :rules="[rules.required(), rules.email()]"
              />
            </v-flex>
            <v-flex xs12 md6>
              <v-select
                v-model.lazy="form.tipoUsuario"
                index="5"
                :items="listTipoUsuario"
                item-text="label"
                item-value="value"
                label="Tipo Usuario"
                name="tipoUsuario"
              />
            </v-flex>
            <v-flex xs12 md6>
              <v-text-field
                v-model.lazy="form.password"
                :append-icon="
                  showPass ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
                "
                hint="Ej: Qwerty123"
                index="7"
                label="Contraseña"
                name="password"
                :type="showPass ? 'text' : 'password'"
                :rules="[rules.required(), rules.password()]"
                @click:append="showPass = !showPass"
              />
            </v-flex>
            <v-flex xs12 md6>
              <v-text-field
                v-model.lazy="form.password2"
                :append-icon="
                  showPass ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
                "
                hint="Ej: Qwerty123"
                index="8"
                label="Confirmar contraseña"
                name="password2"
                :type="showPass ? 'text' : 'password'"
                validate-on-blur
                :rules="[
                  rules.required(),
                  rules.password(),
                  rules.password_equal(form.password),
                ]"
                @click:append="showPass = !showPass"
              />
            </v-flex>

            <v-flex xs12>
              <v-layout wrap align-center mb-2>
                <v-flex xs1>
                  <v-checkbox
                    v-model="form.checkboxPPandCS"
                    class="my-0 pt-0 mx-0 px-0"
                    hide-details
                    color="primary"
                    index="8"
                    name="checkboxPPandCS"
                    required
                    :rules="[rules.required()]"
                  />
                </v-flex>
                <p class="caption mb-0 grey--text mt-0">
                  Acepto las
                  <a
                    href="https://rapicopia.com.ar/privacy_policies_Rapicopia.pdf"
                    target="_blank"
                  >
                    Políticas de Privacidad
                  </a>
                  y
                  <a
                    href="https://rapicopia.com.ar/terms_policies_Rapicopia.pdf"
                    target="_blank"
                  >
                    Términos y Condiciones
                  </a>
                  .
                </p>
              </v-layout>
            </v-flex>

            <v-flex xs12>
              <p class="grey--text mb-1 mt-0 caption">
                Este sitio está protegido por reCaptcha y Google. Aplican
                <a href="https://policies.google.com/privacy" target="_blank">
                  Políticas de Privacidad
                </a>
                y
                <a href="https://policies.google.com/terms" target="_blank">
                  Términos del servicio
                </a>
                .
              </p>
            </v-flex>
          </v-layout>
        </template>
        <template v-slot:message>
          <error :text="error" />
        </template>
        <template v-slot:actions>
          <v-btn text :disabled="loading" to="/login">Cancelar</v-btn>
          <v-btn
            :disabled="loading"
            :loading="loading"
            color="primary"
            type="submit"
          >
            Aceptar
          </v-btn>
        </template>
      </CardForm>
      <v-dialog v-model="dialog" persistent max-width="290">
        <v-card>
          <CardForm>
            <template v-slot:header>
              Activación de cuenta
            </template>
            <template>
              Hemos enviado un email a su dirección de correo electrónico para
              activar su cuenta.
            </template>
            <template v-slot:actions>
              <v-btn color="primary" @click="cancel()">Aceptar</v-btn>
            </template>
          </CardForm>
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
import { mapState, mapActions } from 'vuex'
import CardForm from '../components/CardForm'
import DateField from '../components/DateField'
import getGCaptcha from '../utils/getGCaptcha'

export default {
  components: { CardForm, DateField },
  asyncData({ query = {} }) {
    return { error: query.error, token: query.token }
  },
  data: () => ({
    showPass: false,
    dialog: false,
    listTipoDocumento: [
      { value: 'DNI', label: 'DNI' },
      { value: 'LC', label: 'LC' },
      { value: 'CI', label: 'CI' },
      { value: 'LE', label: 'LE' },
      { value: 'Pasaporte', label: 'Pasaporte' },
      { value: 'Otro', label: 'Otro' },
    ],
    listTipoUsuario: [
      { value: 'CLIENTE', label: 'Cliente' },
      { value: 'PROFESOR', label: 'Profesor' },
    ],
    menu: false,
    form: {
      nombre: '',
      apellido: '',
      tipoDocumento: 'DNI',
      numeroDocumento: '',
      fechaNacimiento: null,
      tipoUsuario: 'CLIENTE',
      mail: '',
      password: '',
      password2: '',
      checkboxPPandCS: null,
    },
    captchaValue: null,
  }),
  computed: {
    ...mapState(['loading']),
  },
  created() {},
  mounted() {
    const self = this
    getGCaptcha('forgetPassword')
      .then((value) => {
        self.captchaValue = value
      })
      .catch((error) => {
        self.error = error.message
        // self.$ga.commands.usuario.register('CAPTCHA_ERROR')
      })
  },
  methods: {
    ...mapActions(['signUp']),

    cancel() {
      this.dialog = false
      this.$router.replace('/login')
    },

    async submit(formValid) {
      if (formValid === false) return
      this.error = ''
      if (formValid && !this.loading && this.captchaValue) {
        const { error } = await this.signUp({
          usuario: this.form,
          captchaValue: this.captchaValue,
        })
        if (error) {
          this.error = error
        } else {
          this.dialog = true
          // this.$ga.commands.usuario.register(this.form.tipoUsuario)
        }
      }
    },
  },
}
</script>
