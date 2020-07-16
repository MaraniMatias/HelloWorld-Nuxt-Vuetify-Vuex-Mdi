<template>
  <v-layout justify-center align-end class="grey--text">
    <p class="mb-0 text-center">
      <span class="hidden-md-and-down mr-1">Copyright</span>
      ©
      <span class="mr-1" v-text="year" />
      <a
        class="link-apunte grey--text"
        href="http://www.rapicopia.com.ar"
        target="_blank"
      >
        Rapicopia
      </a>
      <!--
      <span class="mx-1 grey--text">by</span>
      <a class="link-apunte grey--text" href="http://www.qutap.com.ar" target="_blank">
        Qutap, We do it.
      </a>
      -->
    </p>
  </v-layout>
</template>

<script>
export default {
  computed: {
    year: () => new Date().getFullYear(),
  },
}
</script>
