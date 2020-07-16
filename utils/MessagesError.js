const Error500 = () => 'Algo salió mal'

export default (error, props = {}) => {
  if (typeof error.data !== 'undefined') {
    props.error =
      typeof data === 'string' ? error.data : error.data.description || Error500
    props.status = error.status
    return props
  } else {
    // eslint-disable-next-line
    console.error('[CATCH ERROR]\n', error, '\n')
    return undefined
  }
}
