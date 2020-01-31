import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Post from './views/Post.vue'
import Validation from './views/Validation.vue'
import Api from './api'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/post/:id',
      name: 'post',
      component: Post,
      beforeEnter: (to, from, next) => {

        Api.get_post({
          postId: to.params.id
        })
          .then(res => {
            if (res.data.code === 200 && res.data.error === false) {
              to.params.data = res.data.body
              next()
            }
            else {
              next('/') // TODO: REDIRECT TO 404
            }
          })
          .catch(err => {
            if (err) {
              next('/') // TODO: REDIRECT TO 404
            }
          })
      }
    },
    {
      path: '/validation/:token',
      name: 'validation',
      component: Validation,
      beforeEnter: (to, from, next) => {

        Api.activate_user({
          token: to.params.token
        })
          .then(res => {
            if (res.data.code === 200 && res.data.error === false) {
              to.params.success = true
              next()
            }
          })
          .catch(err => {
            if (err) {
              next('/')
            }
          })
      }
    }
  ]
})
