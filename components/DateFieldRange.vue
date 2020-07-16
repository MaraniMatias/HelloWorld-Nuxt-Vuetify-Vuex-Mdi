<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    max-width="290px"
    min-width="290px"
    offset-y
    transition="scale-transition"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="input"
        :index="index"
        :label="label"
        :class="{
          'pt-0': $vuetify.breakpoint.lgAndUp,
        }"
        :hide-details="hideDetails"
        :clearable="clearable"
        prepend-icon="mdi-calendar"
        :dense="dense"
        readonly
        :rules="rule"
        @click:clear="clear"
        v-on="on"
      />
    </template>
    <v-date-picker
      ref="picker"
      v-model="parseDate"
      locale="es"
      range
      :min="min"
      :max="max"
      @change="saveDate"
    />
  </v-menu>
</template>

<script>
import formRules from 'form-rules'
import parseDateFormat from '../utils/dateFormat'

// :max="new Date().toISOString().substr(0, 10)"
// :min="new Date().toISOString().substr(0, 10)"

function parseDate(val) {
  const [year, month, day] = val
    .replace(/T\d+:\d+:\d+.\d+\+\d+$/, '')
    .split('-')
  const parseDate = new Date()
  parseDate.setFullYear(year)
  parseDate.setMonth(month - 1)
  parseDate.setDate(day)
  parseDate.setHours(0, 0, 0, 0)
  return parseDate
}

export default {
  props: {
    label: { type: String, default: null },
    hideDetails: Boolean,
    index: { type: [Number, String], default: null },
    dense: { type: Boolean, default: false },
    value: { type: Array, default: () => [] },
    required: { type: Boolean, default: false },
    clearable: { type: Boolean, default: false },
    min: { type: String, default: null },
    max: { type: String, default: null },
  },
  data: () => ({
    dates: [],
    menu: '',
  }),
  computed: {
    rule() {
      const rules = []
      if (this.required) rules.push(formRules.required())
      return rules
    },
    parseDate: {
      get() {
        return this.dates.map((date) =>
          new Date(date).toISOString().substr(0, 10)
        )
      },
      set(val) {
        this.dates = val.map(parseDate) || []
      },
    },
    input: {
      get() {
        return this.dates
          .map((date) => parseDateFormat(date, 'dd/MM/yyyy'))
          .sort()
          .join(' ~ ')
      },
      set(val) {
        this.dates = val || []
      },
    },
  },
  watch: {
    dates(val = []) {
      this.$emit('input', val)
    },
  },
  created() {
    this.dates = this.value || []
  },
  mounted() {
    this.$refs.menu.save(this.value)
  },
  methods: {
    saveDate(parseDate) {
      this.$refs.menu.save(parseDate || [])
    },
    clear() {
      this.dates = []
    },
  },
}
</script>
