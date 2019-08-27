import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import Clipboard from 'v-clipboard'
 
import router from './routes/';
import store from './store';


Vue.use(Clipboard);
Vue.use(ElementUI);
Vue.config.productionTip = false;

import API from './includes/api.js';

const api = new API();  
Object.defineProperty(Vue.prototype, '$api', {
	get () { return api }
});

console.log(api);
console.log(Vue.prototype.$api);

new Vue({
	el: '#app',
	store,
	router,
	render: h => h(App)
});