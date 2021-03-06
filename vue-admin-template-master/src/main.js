import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import axios from 'axios' // 引入
import '@/icons' // icon
import '@/permission' // permission control
import moment from 'moment'
// 中文简体
moment.locale('zh-cn')
Vue.filter('dateformat', (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') => {
  return moment(dataStr).format(pattern)
})
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
// Vue.prototype.$moment = moment
// Vue.filter('dateformat', function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
//   return moment(dataStr).format(pattern)
// })
Vue.config.productionTip = false
Vue.prototype.$http = axios// vue原型对象上添加全局属性 别的组件如果用 直接this.$http
Vue.prototype.$url = 'http://localhoat:8080/'
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
