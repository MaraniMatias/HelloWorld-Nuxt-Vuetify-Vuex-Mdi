export default function ({ title } = { title: 'Rapicopia' }) {
  return {
    show(text) {
      if ('Notification' in window) {
        return Notification.requestPermission(
          () => new Notification(title, { body: text })
        )
      }
    },
  }
}
