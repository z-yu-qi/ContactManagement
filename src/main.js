/*
入口js：创建Vue实例
 */
import Vue from 'vue'
import App from './App'
import router from './router'
import '@/assets/styles/reset.css'
import '@/assets/styles/border.css'
import '@/assets/styles/iconfont.css'

Vue.config.productionTip = false

new Vue({
  el:'#app',
  router,
  components:{
    //组件名称
    App
  },
  //使用App.vue组件
  template:'<App/>'
})
