// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import '@/assets/reset.css'

Vue.config.productionTip = false

// 消除 click 移动浏览器300ms延迟
import attachFastClick from 'fastclick'
attachFastClick.attach(document.body)


Vue.use(Vuex);

const store = new Vuex.Store({
	state:{
		repeat:'cycle',
		nowIndex:0
	},
	mutations:{
		updateIndex(state,index){
			state.nowIndex = index;
		},
		updateRepeat(state,repeat){
			state.repeat = repeat;
		}
	}
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
