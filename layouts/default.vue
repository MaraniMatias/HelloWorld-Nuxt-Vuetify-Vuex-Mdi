<template>
  <v-app ng-cloak>
    <Snackbar />
    <v-app-bar
      fixed
      app
      :color="hideAppBar ? 'transparent' : 'primary'"
      :dark="!hideAppBar"
      :class="{ 'elevation-0': hideAppBar }"
    >
      <v-btn nuxt text to="/" color="transparent">
        <Logo :bg="!hideAppBar" class="mb-2" />
      </v-btn>
      <v-toolbar-title>
        <h1 v-show="!hideAppBar" class="headline" v-text="title"></h1>
      </v-toolbar-title>
      <v-spacer />
      <v-layout justify-end align-center>
        <template v-if="isLoggedIn">
          <v-menu offset-y bottom class="mx-2">
            <template v-slot:activator="{ on }">
              <Avatar class="ml-4" :src="user.picture" :on="on" />
            </template>
            <v-list class="mt-2">
              <v-list-item @click="changePassword()">
                Cambiar Contraseña
              </v-list-item>
              <v-list-item @click="loginOut()">Cerrar Sesión</v-list-item>
            </v-list>
          </v-menu>
        </template>
        <template v-else>
          <v-btn icon class="ml-4" @click="goToPerfil">
            <v-icon size="32" style="cursor: pointer;">
              mdi-account-circle
            </v-icon>
          </v-btn>
        </template>
      </v-layout>
    </v-app-bar>
    <v-main>
      <nuxt />
    </v-main>
    <v-footer class="transparent" app>
      <Copyright />
    </v-footer>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import Copyright from '../components/Copyright'
import Logo from '~/components/Logo.vue'
import Avatar from '~/components/Avatar.vue'
const Snackbar = () => import('../components/Snackbar.vue')

export default {
  components: { Copyright, Avatar, Logo, Snackbar },
  data: () => ({}),
  computed: {
    ...mapGetters(['isLoggedIn']),
    title: () => process.env.NUXT_ENV_TITLE,
    user() {
      return this.$store.state.user || {}
    },
    hideAppBar() {
      return ['index', 'login', 'loginout', 'singup'].includes(this.$route.name)
    },
  },
  methods: {
    ...mapActions(['logout', 'getMe']),
    async loginOut() {
      await this.logout()
      this.$router.replace('/loginout')
    },
    changePassword() {
      this.$router.replace('/changePassword')
    },
    goToPerfil() {
      if (this.$route.name !== 'login') {
        this.$router.replace('/login')
      }
    },
  },
}
</script>
