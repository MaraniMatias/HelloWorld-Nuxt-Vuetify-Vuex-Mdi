// https://date-fns.org/v2.0.1/docs/I18n
import parseISO from 'date-fns/parseISO'
import format from 'date-fns/format'
import es from 'date-fns/locale/es'
const locales = { es }

export default function (value, formatStr = 'PP') {
  const date = typeof value === 'string' ? parseISO(value) : value
  return format(date, formatStr, {
    locale: locales[window.__localeId__ || 'es'], // or global.__localeId__
  })
}
