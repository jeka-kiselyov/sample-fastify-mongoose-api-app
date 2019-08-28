<template>

	<el-dialog title="Sign In" :visible.sync="dialogFormVisible">
		<el-alert title="Invalid username or password" type="warning" show-icon v-if="error" :closable="false"></el-alert>
		<el-form :model="form" v-loading="isLoading" v-if="!error">
			<el-form-item>
				<el-input v-model="form.username" @keyup.enter.native="onEnter" placeholder="Username or email" ref="usernameInput"></el-input>
			</el-form-item>
			<el-form-item>
				<el-input placeholder="Please input password" v-model="form.password"  @keyup.enter.native="onEnter" ref="passwordInput" show-password></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="auth">Sign In</el-button>
			</el-form-item>
		</el-form>
	</el-dialog>


</template>
<script>
const md5 = require('blueimp-md5'); // the one with no dependecies
import axios from 'axios';

export default {
	data() {
		return {
			isLoading: false,
			error: null,
			dialogFormVisible: false,
	        form: {
	        	username: '',
	        	password: ''
	        }
		}
	},
	mounted: function() {
		this.$store.subscribeAction((action, state) => {
			if (action.type == 'doSignIn') {
				this.signIn();
			} else if (action.type == 'doLogOut') {
				this.logout();
			}
		});
		// this.$nextTick(()=>{
		// 	this.$refs.usernameInput.focus();
		// });

		/// uncomment this for faster testing

		// setTimeout(()=>{
		// 	this.auth();
		// }, 50);
	},
	watch: {
		isAuthenticated: function(v) {
			if (v) {
				this.$emit('authenticated', this.authCode);				
			} else {
				this.$emit('nobody');				
			}
		},
		error: function(v) {
			/// hide error after one second and show the form again
			if (v) {
				setTimeout(()=>{
					this.error = null;
					this.isLoading = false;
					
					this.$nextTick(()=>{
						this.$refs.usernameInput.focus();
					});
				}, 1000);
			}
		}
	},
	methods: {
		onEnter: function() {
			if (this.form.username && this.form.password) {
				return this.auth();
			} else if (!this.form.username) {
				this.$refs.usernameInput.focus();				
			} else if (!this.form.password) {
				this.$refs.passwordInput.focus();					
			}
		},
		logout: function() {
			axios.post('/auth/logout', {}).
				then((response)=>{
					this.$store.dispatch('signedout');					
				});
		},
		signIn: function() {
			this.dialogFormVisible = true;
		},
		auth: function() {
			let promise = new Promise((resolve, reject)=>{
				// resolve(true);
				this.isLoading = true;

				axios.post('/auth/nonce', {}).
					then((response)=>{
						if (response && response.data && response.data.nonce) {
							return axios.post('/auth/auth', {
								username: this.form.username,
								password: md5(''+response.data.nonce+this.form.password)
							});
						} else {
							throw new Error("Can not get auth nonce from the server");
						}
					}).then((response)=>{
						if (response && response.data && response.data.success && response.data.authCode) {
							
							this.$store.dispatch('authenticated', response.data.me);
							this.form.username = '';
							this.form.password = '';

							this.dialogFormVisible = false;
							this.error = null;
						} else {
							throw new Error("Something is wrong singing in to the server");
						}
					}).catch((error)=>{
						this.error = "Wrong username or password";
					}).finally(()=>{
						this.isLoading = false;
					});

			});

			promise.then((success)=>{
				this.isAuthenticated = success;
			});
		},
		showModal: function() {

		}
	}
}	
</script>

<style lang="css">

	@media only screen and (max-width: 767px) {
		.el-dialog {
			width: 100%;
		}
	}

</style>