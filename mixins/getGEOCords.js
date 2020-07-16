import { mapGetters } from 'vuex'
import getGEOCords from '../utils/getGEOCords'

export default {
  computed: {
    ...mapGetters('syspars', ['getHereKey']),
  },
  methods: {
    getGEOCords(direction) {
      return getGEOCords(this.getHereKey.rest_api_key, direction)
    },
  },
}
