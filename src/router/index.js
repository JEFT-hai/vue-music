import Vue from 'vue'
import Router from 'vue-router'
import player from '@/views/player'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: player
    }
  ]
})
