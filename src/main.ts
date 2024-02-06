import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueCookies from 'vue-cookies'
import VueScroll from 'vuescroll'
Vue.config.productionTip = false
Vue.prototype.$bus = new Vue(); // 通信的事件总线
Vue.component('vue-scroll', VueScroll)
Vue.use(VueCookies);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
