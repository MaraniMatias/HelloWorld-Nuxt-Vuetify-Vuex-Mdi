import Vue from 'vue'
import Router from 'vue-router'

Router.prototype.open = function (routeObject) {
  const { href } = this.resolve(routeObject)
  window.open(href, '_blank')
}

Vue.use(Router)
