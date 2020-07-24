<template>
  <v-layout column>
    <v-flex xs12 lg4 xl4>
      <CardForm
        hide-header
        my-0
        :reset="reset"
        :transparent="true"
        @submit="submit"
      >
        <template v-slot:default="{ rules }">
          <v-text-field
            v-model.lazy="apellido"
            validate-on-blur
            label="Apellido"
            :rules="[rules.required()]"
          />

          <v-text-field
            v-model.lazy="nombre"
            validate-on-blur
            label="Nombre"
            :rules="[rules.required()]"
          />

          <v-text-field
            v-model.lazy="email"
            validate-on-blur
            label="Email"
            :rules="[rules.required(), rules.email()]"
          />

          <v-text-field
            v-if="!editing"
            v-model.lazy="password"
            label="Contraseña"
            validate-on-blur
            :rules="[rules.required(), rules.password()]"
            :append-icon="
              showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
            "
            :type="showPassword ? 'text' : 'password'"
            @click:append="showPassword = !showPassword"
          />

          <v-text-field
            v-if="!editing"
            v-model.lazy="password2"
            label="Repita Contraseña"
            validate-on-blur
            :rules="[
              rules.required(),
              rules.password(),
              rules.password_equal(password),
            ]"
            :append-icon="
              showPassword2 ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
            "
            :type="showPassword2 ? 'text' : 'password'"
            @click:append="showPassword2 = !showPassword2"
          />

          <!--
          <v-select
            v-model.lazy="roles"
            label="Tipo de Usuario"
            multiple
            :items="rolesMap"
            item-value="tipo"
            item-text="label"
            :rules="[rules.required()]"
          />
          -->
          <v-select
            v-model.lazy="role"
            label="Tipo de Usuario"
            :items="rolesLabel"
            item-value="tipo"
            item-text="label"
            :rules="[rules.required()]"
          />
        </template>

        <template slot="message">
          <p v-show="error" class="error--text show-error" v-text="error" />
        </template>

        <template slot="actions">
          <v-btn text @click="cancel()">Cancelar</v-btn>
          <v-btn color="primary white--text" type="submit">Aceptar</v-btn>
        </template>
      </CardForm>
    </v-flex>
  </v-layout>
</template>

<script>
import CardForm from './CardForm'

import UsuarioRoles from '~/utils/enum/UsuarioRoles'
import TipoUsuarioLabel from '~/utils/enum/TipoUsuarioLabel'
import firstUppercase from '~/utils/firstUppercase'

export default {
  components: { CardForm },

  props: {
    success: { type: Boolean, default: false },
    error: { type: String, default: '' },
    user: { type: Object, default: () => ({}) },
  },

  data: () => ({
    reset: false,
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    password2: '',
    roles: [UsuarioRoles.PRODUCTOR],
    showPassword: false,
    showPassword2: false,
  }),

  computed: {
    editing() {
      return this.user._id
    },

    rolesLabel() {
      const roles = Object.keys(UsuarioRoles).map((rol) => {
        return { tipo: rol, label: TipoUsuarioLabel[rol] }
      })
      return roles
    },

    role: {
      get() {
        return this.roles[0]
      },
      set(val) {
        this.roles = [val]
      },
    },
  },

  watch: {
    success(val) {
      if (val) {
        this.cleaner()
      }
    },

    user() {
      this.cleaner()
      if (this.editing) {
        this.fillFields()
      }
    },
  },

  created() {
    if (this.editing) {
      this.fillFields()
    }
  },

  methods: {
    cleaner() {
      this.reset = !this.reset
      this.nombre = ''
      this.apellido = ''
      this.email = ''
      this.roles = []
      this.password = ''
      this.password2 = ''
      this.showPassword = false
      this.showPassword2 = false
    },

    cancel() {
      this.cleaner()
      this.$emit('cancel')
    },

    submit(formValid) {
      this.$emit('update:success', false)
      if (formValid) {
        this.$emit('submit', {
          _id: this.user._id,
          nombre: this.nombre,
          apellido: this.apellido,
          email: this.email,
          password: this.password,
          roles: this.roles,
        })
      }
    },

    fillFields() {
      this.nombre = firstUppercase(this.user.nombre)
      this.apellido = firstUppercase(this.user.apellido)
      this.email = this.user.email
      this.roles = this.user.roles || [UsuarioRoles.PRODUCTOR]
      this.role = this.roles?.[0] || UsuarioRoles.PRODUCTOR
    },
  },
}
</script>
