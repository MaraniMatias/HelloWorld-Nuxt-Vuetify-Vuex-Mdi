<template>
  <v-layout column justify-space-between mt-3 mx-3>
    <p class="headline mb-0">Cambio de contraseña</p>
    <v-layout mt-3 mx-3 justify-center>
      <v-flex xs12 md6 lg4 xl3>
        <ChangePassword
          :success.sync="success"
          :error="error"
          :user="user"
          @submit="submit"
          @cancel="$router.back()"
        />
      </v-flex>
    </v-layout>
  </v-layout>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import ChangePassword from './../components/ChangePassword'

export default {
  components: { ChangePassword },
  middleware: ['authenticated'],
  data: () => ({
    error: '',
    success: false,
  }),

  computed: {
    ...mapState(['user']),
  },

  methods: {
    ...mapActions(['changePassword']),

    async submit({ actualPassword, newPassword }) {
      this.error = ''

      const { error } = await this.changePassword({
        actualPassword,
        newPassword,
      })

      if (error) {
        this.error = error
      } else {
        this.success = true
        this.$emit('snackbar', {
          color: 'success',
          text: 'Contraseña Cambiada',
        })
      }
    },
  },
}
</script>
