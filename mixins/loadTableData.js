export default {
  data: () => ({
    pagination: {
      page: 0,
      totalItems: 0,
    },
    actualPage: -1,
    lastPage: false,
    dataset: [],
  }),
  methods: {
    async loadTableData(getFunction, nextPage = 0, query = {}) {
      try {
        if (this.loading) return
        if (typeof this.loading === 'undefined') {
          this.$set(this, 'loading', true)
        } else {
          this.loading = true
        }
        const get =
          typeof getFunction === 'function' ? getFunction : this[getFunction]
        const { data, totalItems, error } = await get({
          page: nextPage,
          query,
        })
        if (error) return { error }
        this.dataset = Object.freeze(data)
        this.pagination.totalItems = totalItems
        this.pagination.page = nextPage + 1
        this.actualPage = nextPage
        // this.lastPage = page.last
        // if (!page.last) {
        //   this.pagination.rowsPerPage = page.rowsPerPage
        // }
      } catch (e) {
        // eslint-disable-next-line
        console.error(e)
      } finally {
        this.loading = false
      }
    },
  },
  watch: {
    pagination: {
      deep: true,
      handler(newValue, oldValue) {
        const delta = newValue.page - oldValue.page
        if (newValue.page + 1 !== this.actualPage && delta !== 0) {
          this.loadData(this.actualPage + delta)
        }
      },
    },
  },
}
