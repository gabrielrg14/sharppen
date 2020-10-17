import Vue from 'vue'
import App from './App'

import '@fortawesome/fontawesome-free/css/all.css'
import './config/bootstrap'
import './config/msgs'
import './config/axios'

import store from './config/store'
import router from './config/router'

Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
