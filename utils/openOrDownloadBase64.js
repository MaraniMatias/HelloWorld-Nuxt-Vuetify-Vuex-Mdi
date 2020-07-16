/**
 *  openOrDownloadBase64
 *  Dado un archivo en base64
 *  @param {String} base64
 *  @param {Options|String} opt si es string es el nimbre del archivo
 *
 *  @typedef {Object} Options
 *  @property {String} fileName
 *  @property {String} mimeType
 *  @property {Boolean} openInWindow
 */
export default function openOrDownloadBase64(base64, opt = {}) {
  if (!base64) return ''
  let fileName = opt || 'preview.pdf'
  let mimeType = 'application/pdf'
  let openInWindow = false
  if (typeof opt !== 'string') {
    fileName = opt.fileName || 'preview.pdf'
    mimeType = opt.mimeType || 'application/pdf'
    openInWindow = opt.openInWindow || false
  }
  return (
    fetch(`data:${mimeType};base64,${base64}`)
      .then((res) => res.blob())
      // ---------------------- Blob or File -----------------------------
      // Si comente esta linea se usa solo el blob
      .then((blob) => new File([blob], fileName, { type: mimeType }))
      // -----------------------------------------------------------------
      .then((doc) => {
        const url = (window.URL || window.webkitURL).createObjectURL(doc)
        const a = document.createElement('a')
        a.href = url
        if (openInWindow) {
          a.target = '_blank'
          a.rel = 'noopener'
        } else {
          a.download = fileName
          a.dataset.downloadurl = `${mimeType}:${a.download}:${a.href}`
        }
        document.body.appendChild(a)
        a.click()
        setTimeout(function () {
          document.body.removeChild(a)
          window.URL.revokeObjectURL(url)
        }, 5000)
        return url
      })
  )
}
