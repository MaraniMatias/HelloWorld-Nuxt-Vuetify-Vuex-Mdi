const firstUppercase = (value) => {
  if (!value || typeof value !== 'string') return ''
  return value[0].toUpperCase() + value.substr(1).toLowerCase()
}

export default {
  filters: { firstUppercaseFilter: firstUppercase },
  methods: { firstUppercase },
}
