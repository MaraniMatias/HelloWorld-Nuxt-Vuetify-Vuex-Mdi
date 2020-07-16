export default {
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
        const { items, page, totalElements, error } = await get({
          page: nextPage,
          query,
        })
        if (error) return { error }
        this.dataset = Object.freeze(items)
        this.actualPage = page.number
        this.lastPage = page.last
        if (!page.last) {
          this.pagination.rowsPerPage = page.rowsPerPage
        }
        this.pagination.totalItems = totalElements
        this.pagination.page = page.number + 1
      } catch (e) {
        // eslint-disable-next-line
        console.error(e)
      } finally {
        this.loading = false
      }
    },
  },
}
