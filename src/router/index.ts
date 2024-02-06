import Vue from 'vue'
// eslint-disable-next-line no-unused-vars
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "lottery" */ "../views/lottery/lottery.vue")
  },
  {
    path: "/vue-lottery-pro",
    name: "vue-lottery-pro",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "lottery-pro" */ "../views/lottery/lottery.vue")
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
