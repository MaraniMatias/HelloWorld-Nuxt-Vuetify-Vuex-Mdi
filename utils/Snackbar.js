/**
 * Set color form type
 * @readonly
 * @enum {string} color for type
 */
const Colors = {
  info: 'info',
  success: 'success',
  error: 'red darken-3',
  warn: 'orange darken-3',
  none: 'grey darken-4',
}

/**
 * Snackbar
 *
 * Description
 *
 * @param object {Alert} Mensaje
 * @returns {Alert}
 */
export default function ({ text, type = 'none', timeout = 5000, close }) {
  return {
    type: type !== 'none' ? type : undefined,
    color: Colors[type] || Colors.none,
    text,
    timeout: type === 'error' && timeout < 7000 ? 7000 : timeout,
    close: close || false,
  }
}
