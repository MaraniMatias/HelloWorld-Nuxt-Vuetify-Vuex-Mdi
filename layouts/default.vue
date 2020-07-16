<template>
  <v-app ng-cloak>
    <Snackbar />
    <v-app-bar
      color="primary"
      dark
      dense
      clipped-left
      :clipped-right="mdAndUp"
      app
      :absolute="mobileMenu"
      :flat="mobileMenu"
    >
      <v-app-bar-nav-icon
        v-show="showMenuIcon"
        @click.native="drawer = !drawer"
      />
      <h1
        v-show="mdAndUp || (mdAndDown && !showSearchBar)"
        class="title mr-4"
        style="cursor: pointer;"
        @click="goToHome()"
      >
        {{ title }}&nbsp;
        <span class="font-weight-light hidden-sm-and-down">{{ subTitle }}</span>
      </h1>
      <SearchBar v-show="showSearchBar" dark dense />
      <v-spacer v-show="mdAndUp || !showSearchBar" />
      <div class="hidden-md-and-up" style="margin-right: -12px;">
        <v-btn v-show="getItemsCount" icon @click="goToCart">
          <v-badge overlap color="red" :content="getItemsCount">
            <v-icon>mdi-cart-outline</v-icon>
          </v-badge>
        </v-btn>
        <v-btn
          v-show="!getItemsCount"
          icon
          target="_blank"
          href="https://docs.google.com/document/d/1J-E6dKsE8NUln8kTYanal4yfn6IojV4GPW_EGqIfs_c"
        >
          <v-icon>mdi-help-circle-outline</v-icon>
        </v-btn>
      </div>
      <div class="hidden-sm-and-down">
        <v-btn
          icon
          href="https://www.instagram.com/somosrapicopia"
          target="_blank"
        >
          <img
            src="/assets/icons/logo-instagram.svg"
            height="24px"
            alt="Instagram"
          />
        </v-btn>
        <v-btn
          icon
          href="https://www.youtube.com/channel/UCBXe69-FOfVuQ0tsW8awnQA"
          target="_blank"
        >
          <img
            src="/assets/icons/logo-youtube.svg"
            height="24px"
            alt="Youtube"
          />
        </v-btn>
        <v-btn icon href="https://twitter.com/rapicopia" target="_blank">
          <img
            src="/assets/icons/logo-twitter.svg"
            height="24px"
            alt="Twitter"
          />
        </v-btn>
        <v-btn icon href="https://www.facebook.com/Rapicopia/" target="_blank">
          <img
            src="/assets/icons/logo-facebook.svg"
            height="24px"
            alt="Facebock"
          />
        </v-btn>
      </div>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn
          text
          target="_blank"
          href="https://docs.google.com/document/d/1J-E6dKsE8NUln8kTYanal4yfn6IojV4GPW_EGqIfs_c"
          >Ayuda
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <MenuNavigation v-if="showManuNav" left />
    <v-main>
      <nuxt />
      <BottomSheet
        v-if="showBottomSheet"
        :step-route="stepRoute"
        :value="step"
      />
    </v-main>
    <MenuCart
      v-if="showManuNav && $vuetify.breakpoint.lgAndUp"
      right
      :step-route="stepRoute"
      :value="step"
    />
    <v-footer class="transparent">
      <Copyright />
    </v-footer>
    <!--
    <img
      height="1"
      width="1"
      style="display: none;"
      src="https://www.facebook.com/tr?id=296764741372983&ev=PageView&noscript=1"
      />
    -->
  </v-app>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'

import SearchBar from '../components/SearchBar'
import Copyright from '../components/Copyright'
const Snackbar = () => import('../components/Snackbar.vue')
const MenuCart = () => import('../components/Menu/MenuCart')
const MenuNavigation = () => import('../components/Menu/MenuNavigation')
const BottomSheet = () => import('../components/Menu/BottomSheet')

export default {
  components: {
    Snackbar,
    SearchBar,
    MenuNavigation,
    MenuCart,
    BottomSheet,
    Copyright,
  },
  data: () => ({
    title: process.env.NUXT_ENV_MENU_TITLE,
    subTitle: process.env.NUXT_ENV_MENU_SUB_TITLE,
    stepRoute: ['inicio', 'search', 'carrito', 'confirmar'],
  }),
  computed: {
    ...mapState(['drawerMenuNavigation', 'user', 'loading']),
    ...mapGetters('cart', ['getItemsCount']),
    ...mapGetters(['isLoggedIn', 'userIsAdmin']),
    mdAndDown() {
      return this.$vuetify.breakpoint.mdAndDown
    },
    mdAndUp() {
      return this.$vuetify.breakpoint.mdAndUp
    },
    drawer: {
      get() {
        return this.drawerMenuNavigation
      },
      set(value) {
        this.setDrawer(value)
      },
    },
    mobileMenu() {
      return this.mdAndDown && this.$route.name !== 'index'
    },
    showManuNav() {
      return (
        this.isLoggedIn &&
        typeof this.user.id !== 'undefined' &&
        !this.userIsAdmin
      )
    },
    showMenuIcon() {
      return (
        this.isLoggedIn &&
        typeof this.user.id !== 'undefined' &&
        !this.userIsAdmin &&
        (this.mdAndDown || this.$route.name === 'index')
      )
    },
    showSearchBar() {
      return (
        this.isLoggedIn &&
        typeof this.user.id !== 'undefined' &&
        !this.userIsAdmin &&
        this.$route.name !== 'inicio' &&
        !this.$route.meta?.withoutAuth
      )
    },
    showBottomSheet() {
      return this.mdAndDown && this.isLoggedIn && this.step >= 0
    },
    step() {
      return this.stepRoute.indexOf(this.$route.name)
    },
  },
  mounted() {
    // App instalada
    // if (
    //   window.matchMedia('(display-mode: standalone)').matches ||
    //   window.navigator.standalone === true
    // ) {
    //   this.$ga.commands.usuario.PWA('instalada')
    // } else {
    //   this.$ga.commands.usuario.PWA('web')
    // }

    // Facebook Pixel Code
    window.fbq = function () {
      window.fbq.callMethod
        ? window.fbq.callMethod(arguments)
        : window.fbq.queue.push(arguments)
    }
    window.fbq.push = window.fbq
    window.fbq.loaded = true
    window.fbq.version = '2.0'
    window.fbq.queue = []
    const t = document.createElement('script')
    t.async = true
    t.src = 'https://connect.facebook.net/en_US/fbevents.js'
    const s = document.getElementsByTagName('script')[0]
    s.parentNode.insertBefore(t, s)

    window.fbq('init', '296764741372983')
    window.fbq('track', 'PageView')
  },
  methods: {
    ...mapActions(['signOut']),
    ...mapMutations(['setDrawer']),
    goToHome() {
      this.$router.replace('/')
    },
    goToCart() {
      this.$router.replace('/carrito')
    },
    cerrarSecion() {
      this.signOut()
      this.toHome()
    },
  },
}
</script>
