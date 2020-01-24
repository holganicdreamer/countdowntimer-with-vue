import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueAnalytics from 'vue-analytics'
import CircularCountDownTimer from "vue-circular-count-down-timer";

Vue.use(VueAnalytics, {
  id: 'UA-53642876-3',
  router
})

Vue.use(CircularCountDownTimer);

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
