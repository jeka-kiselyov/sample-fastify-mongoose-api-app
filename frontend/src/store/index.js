import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import VueAxios from 'vue-axios'

import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex);
Vue.use(VueAxios, axios);

const state = {
	isSessionInititalized: false,
	me: null,
	ui: {
		sidebarMode: 'full'
	}
};

const store = new Vuex.Store({
	state,
	mutations,
	actions
});

store.dispatch('initSession');

export default store;