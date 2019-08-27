import axios from 'axios';

export default {
	initSession ({commit}, data) {
		axios
	        .get('http://localhost:9090/auth/me')
	        .then(r => r.data)
	        .then(data => {
		        commit('ME', data.me);
	        }).catch(() => {
	        	commit('ME', null);
	        });
	},
	doSignIn({commit}, data) {
	},
	doLogOut({commit}, data) {
	},
	authenticated({commit}, data) {
        commit('ME', data);
	},
	signedout({commit}, data) {
        commit('ME', null);
	}
};