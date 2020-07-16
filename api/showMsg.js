'use strict'
export default function (type, response) {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line
    console[type](
      '%c[%s]%c %c%s %c%s\n',
      'font-weight: 600',
      response.config.method.toUpperCase(),
      'font-weight: 400',
      response.status === 200
        ? 'color: green'
        : response.status !== 500
        ? 'color: purple'
        : 'color: red',
      response.status,
      'color: blue',
      response.config.url,
      response
    )
  }
}
