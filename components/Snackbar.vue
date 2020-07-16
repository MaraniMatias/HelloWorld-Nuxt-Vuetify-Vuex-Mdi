<template>
  <div class="orders">
    <v-alert
      v-for="alert in filtersItems"
      :key="alert.id"
      v-model="alert.show"
      border="left"
      :icon="false"
      :type="alert.type"
      transition="scale-transition"
      elevation="4"
      :dismissible="alert.close || alert.type === 'error'"
      class="alert"
    >
      <error :text="alert.text" type="none" />
    </v-alert>
  </div>
</template>

<script>
/// <reference path="../types/index" />

export default {
  data: () => ({
    id: 0,
    /** @type {Array<Alert>} */
    items: [],
  }),
  computed: {
    filtersItems() {
      return this.items.filter((alert) => alert.show)
    },
  },
  created() {
    this.$store.subscribe((mutation, { snackbar }) => {
      if (mutation.type === 'snackbar/show') {
        const self = this
        /** @type {Alert} */
        const alert = snackbar.alert
        alert.show = true
        alert.id = this.id++
        const index = this.items.push(alert)
        setTimeout(function () {
          alert.show = false
          self.$set(self.items, index, alert)
          // self.items = self.filtersItems
        }, alert.timeout)
      }
    })
  },
  methods: {},
}
</script>

<style scoped>
.orders {
  flex-wrap: nowrap;
  min-width: 0;
  flex-direction: column;
  justify-content: center !important;
  z-index: 1000;
  display: flex;
  position: fixed;
  padding-top: 24px;
  pointer-events: none;
  left: 0;
  right: 0;
  top: 0;
  width: 100%;
}

.alert {
  pointer-events: auto;
  min-width: 350px;
  align-self: center;
  align-items: center;
  transition-duration: 0.15s;
  transition-property: opacity, transform;
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
}
</style>
