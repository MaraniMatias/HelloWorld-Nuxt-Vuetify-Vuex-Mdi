<template>
  <v-avatar :size="size" v-on="{ ...on }">
    <template>
      <v-icon v-if="avatarError || !src || loading" :size="size">
        mdi-account-circle
      </v-icon>
      <img v-else :src="base64img" />
    </template>
  </v-avatar>
</template>

<script>
export default {
  props: {
    on: { type: Object, default: () => {} },
    size: { type: String, default: '32' },
    src: { type: String, default: '' },
  },
  data: () => ({
    avatarError: true,
    loading: false,
    base64img: null,
  }),
  computed: {},
  watch: {
    src: 'loadImg',
  },
  mounted() {
    this.loadImg()
  },
  methods: {
    async loadImg() {
      try {
        this.loading = true
        this.avatarError = true
        const { data: imgFile } = await this.$axios.get(this.src, {
          responseType: 'arraybuffer',
        })
        this.base64img =
          'data:image/jpeg;base64,' +
          Buffer.from(imgFile, 'binary').toString('base64')
        this.avatarError = false
      } catch (err) {
        this.avatarError = true
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
.cursor {
  cursor: pointer;
}
</style>
