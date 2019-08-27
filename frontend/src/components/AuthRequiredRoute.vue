<template>

	<div>

		<div v-if="isAuthenticated">
			<component v-bind:is="routeComponentName"></component>
		</div>
		<div v-else>
			<div id="auth_required_info_div" class="el-loading-parent--relative"><div class="el-loading-mask" style=""><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg><p class="el-loading-text"><el-link type="primary" @click="signin">Authentication required</el-link></p></div></div></div>
		</div>


	</div>

</template>
<script>

// import { Loading } from 'element-ui';

export default {
	props: ['routeComponentName'],
	data() {
		return {
		}
	},
	mounted: function() {
		if (this.$store.state.isSessionInititalized) {
			if (!this.$store.state.me) {
				this.$store.dispatch('doSignIn');		
			}
		} else {
			this.$store.subscribe((mutation, state) => {
				if (mutation.type == 'ME' && !state.me) {
					this.$store.dispatch('doSignIn');						
				}
			});
		}

		// let loadingInstance = Loading.service({target: '#auth_required_info_div', text: 'Authentication required'});
	},
	watch: {
	},
	methods: {
		signin: function() {
			this.$store.dispatch('doSignIn');
		}
	},
	computed: {
		isAuthenticated: function() {
			return this.$store.state.me ? true : false;
		},
	}
}	

</script>
<style lang="css">

	#auth_required_info_div {
		height: 70px;
	}

</style>