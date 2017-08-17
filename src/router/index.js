import Vue from 'vue'
import Router from 'vue-router'
import Admin from '@/components/Admin'
import LoggedOut from '@/components/LoggedOut'
import VueResource from 'vue-resource'

Vue.filter('humanize', function (value) {
  if (typeof value === 'undefined') {
    return 'undefined'
  }
  var humanized = value.toString()
                       .toLowerCase()
                       .replace(/[_-]/g, ' ')
                       .replace(/(?:^|\s)\S/g, function (a) {
                         return a.toUpperCase()
                       })

  return humanized
})

Vue.use(VueResource)
Vue.use(Router)

let routerInstance = new Router({
  routes: [
    {
      path: '/logged_out',
      name: 'logged_out',
      component: LoggedOut
    },
    {
      path: '/',
      name: 'home',
      component: Admin,
      props: { model: 'orders', id: 'all', action: 'index' }
    },
    {
      path: '/admin/:model/:id/:action',
      name: 'admin',
      component: Admin,
      props: true
    },
    {
      path: '/settings',
      name: 'settings',
      component: Admin,
      props: { model: 'settings', id: 'all', action: 'index' }
    }
  ]
})

Vue.http.options.headers = {
  'Authorization': null
}

Vue.http.interceptors.push(function (request, next) {
  next(function (response) {
    if (response.status === 401) {
      routerInstance.push({name: 'logged_out'})
    }
  })
})

export default routerInstance
