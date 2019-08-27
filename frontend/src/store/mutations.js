

const mutations = {
	ME: (state, data) => {
		try {
			state.me = data;
			state.isSessionInititalized = true;
		} catch (err) {
			console.log(err)
		}
	},
	AUTHENTICATED: (state, data) => {
		try {
			state.me = data;
			state.isSessionInititalized = true;
		} catch (err) {
			console.log(err)
		}		
	}
}
export default mutations