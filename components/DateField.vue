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

export default {
  props: {
    label: { type: String, default: null },
    hideDetails: Boolean,
    value: { type: [Date, String], default: null },
    index: { type: [Number, String], default: null },
    clearable: { type: Boolean, default: false },
    onlyAdult: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    dense: { type: Boolean, default: false },
    startOnYear: { type: Boolean, default: false },
    min: { type: String, default: null },
    max: { type: String, default: null },
  },
  data: () => ({
    date: '',
    menu: '',
  }),
  computed: {
    rule() {
      const rules = []
      if (this.required) rules.push(formRules.required())
      if (this.onlyAdult) rules.push(this.isAdult)
      return rules
    },
    isAdult() {
      if (this.date instanceof Date) {
        return (
          new Date().setFullYear(new Date().getFullYear() - 18) >
            this.date.getTime() ||
          'Para usar Rapicopia tienes que tener más de 18 años.'
        )
      } else {
        return false
      }
    },
    parseDate: {
      get() {
        const parseDate = this.value
        if (!parseDate) return null
        return new Date(parseDate).toISOString().substr(0, 10)
      },
      set(val) {
        if (val) {
          const [year, month, day] = val
            .replace(/T\d+:\d+:\d+.\d+\+\d+$/, '')
            .split('-')
          const parseDate = new Date()
          parseDate.setFullYear(year)
          parseDate.setMonth(month - 1)
          parseDate.setDate(day)
          parseDate.setHours(0, 0, 0, 0)
          this.date = parseDate
        }
      },
    },
    input: {
      get() {
        const parseDate = this.value
        if (!parseDate) return null
        return parseDateFormat(parseDate, 'dd/MM/yyyy')
      },
      set(val) {
        if (val) this.date = new Date(val)
        else this.date = null
      },
    },
  },
  watch: {
    menu(val) {
      if (this.startOnYear) {
        val &&
          !this.date &&
          setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'), 100)
      }
    },
    date(val) {
      this.$emit('input', val)
    },
  },
  created() {
    // this.date = this.value
  },
  mounted() {
    this.$refs.menu.save(this.value)
  },
  methods: {
    saveDate(parseDate) {
      this.$refs.menu.save(parseDate)
    },
    clear() {
      this.$emit('input', null)
    },
  },
}
</script>
