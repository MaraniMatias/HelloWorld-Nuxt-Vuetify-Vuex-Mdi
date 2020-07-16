// https://github.com/date-fns/date-fns/blob/master/CHANGELOG.md#changed
import format from '../utils/dateFormat'

const formatDate = function (value) {
  if (!value) return ''
  return format(value, "cccc d 'de' MMMM yy")
}
export default {
  filters: {
    formatDate,
  },
  methods: {
    formatDate,
  },
}
