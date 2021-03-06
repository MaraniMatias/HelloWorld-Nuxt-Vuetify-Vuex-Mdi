<template>
  <v-layout column>
    <v-flex xs12 lg3 xl3 mb-4>
      <v-card
        v-if="!isForgetPassword"
        :class="{ 'elevation-3': !isAbm, 'elevation-0': isAbm, 'mx-2': isAbm }"
      >
        <v-card-title>Datos del Usuario</v-card-title>
        <v-card-text :class="{ 'pb-0': isAbm }">
          <p>Nombre: <b v-text="NombreCompleto"></b></p>
          <p>Email: <b v-text="user.email"></b></p>
          <p>Roles: <b v-text="listRoles"></b></p>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex xs12 lg4 xl4>
      <CardForm :reset="reset" :transparent="isAbm" @submit="submit">
        <template slot="header">Cambiar Contraseña</template>
        <template v-slot:default="{ rules }">
          <v-text-field
            v-if="!isAbm && !isForgetPassword"
            v-model.lazy="actualPassword"
            label="Contraseña Actual"
            validate-on-blur
            :rules="[rules.required(), rules.password()]"
            :append-icon="
              showActualPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
            "
            :type="showActualPassword ? 'text' : 'password'"
            @click:append="showActualPassword = !showActualPassword"
          />
          <v-text-field
            v-model.lazy="newPassword"
            label="Nueva Contraseña"
            validate-on-blur
            :rules="[rules.required(), rules.password()]"
            :append-icon="
              showNewPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
            "
            :type="showNewPassword ? 'text' : 'password'"
            @click:append="showNewPassword = !showNewPassword"
          />
          <v-text-field
            v-model.lazy="newPassword2"
            label="Repita Contraseña"
            validate-on-blur
            :rules="[
              rules.required(),
              rules.password(),
              rules.password_equal(newPassword),
            ]"
            :append-icon="
              showNewPassword2 ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
            "
            :type="showNewPassword2 ? 'text' : 'password'"
            @click:append="showNewPassword2 = !showNewPassword2"
          />
        </template>
        <template slot="message">
          <p v-show="error" class="error--text show-error" v-text="error" />
        </template>
        <template slot="actions">
          <v-btn text :disabled="loading" @click="cancel()">Cancelar</v-btn>
          <v-btn
            color="primary white--text"
            :disabled="loading"
            :loading="loading"
            type="submit"
          >
            Aceptar
          </v-btn>
        </template>
      </CardForm>
    </v-flex>
  </v-layout>
</template>
<script>
import capitalizeWords from '../utils/capitalizeWords'
import TipoUsuarioLabel from '../utils/enum/UsuarioRoles'
import CardForm from './CardForm'

export default {
  components: { CardForm },

  props: {
    user: { type: Object, required: false, default: () => {} },
    loading: { type: Boolean, default: false },
    error: { type: String, default: '' },
    success: { type: Boolean, default: false },
    isAbm: { type: Boolean, default: false },
    isForgetPassword: { type: Boolean, default: false },
  },

  data: () => ({
    reset: false,
    actualPassword: '',
    newPassword: '',
    newPassword2: '',
    showActualPassword: false,
    showNewPassword: false,
    showNewPassword2: false,
  }),

  computed: {
    TipoUsuario: () => TipoUsuarioLabel,
    NombreCompleto() {
      return capitalizeWords(this.user.apellido + ' ' + this.user.nombre)
    },
    listRoles() {
      if (this.user && this.user.roles && this.user.roles.length) {
        return this.user.roles.join(' | ')
      }
      return 'Sin roles'
    },
  },
  watch: {
    user: 'cleaner',
    success(val) {
      if (val) {
        this.cleaner()
      }
    },
  },

  methods: {
    cancel() {
      this.cleaner()
      this.$emit('cancel')
    },

    cleaner() {
      this.reset = !this.reset
      this.newPassword = ''
      this.actualPassword = ''
      this.newPassword2 = ''
      this.showActualPassword = false
      this.showNewPassword = false
      this.showNewPassword2 = false
    },

    submit(formValid) {
      this.$emit('update:success', false)
      if (formValid) {
        if (this.actualPassword !== this.newPassword) {
          this.$emit('submit', {
            actualPassword: this.actualPassword,
            newPassword: this.newPassword,
          })
        } else {
          this.error = 'La contraseña nueva no debe ser igual a la actual'
        }
      }
    },
  },
}
</script>
