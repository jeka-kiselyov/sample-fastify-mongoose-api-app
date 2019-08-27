<template>
	<div id="app"  style="min-height: 100vh">
		<the-header></the-header>

		<div v-if="isAuthenticated">
		</div>


		<el-container class="content_height">
	    <the-sidebar class="content_height"></the-sidebar>
		<el-main>
			<!-- route outlet -->
			<!-- component matched by the route will render here -->
			<router-view></router-view>
		</el-main>
		</el-container>

	    <the-footer></the-footer>

		<auth ref="auth"></auth>

	</div>
</template>
<script>
import './components/';
import './forms/';

export default {
	data: function(){
		return {
			isAuthenticated: false,
			authCode: null,
			message: 'Hello Vue!'
		}
	},
	created: function(){
	},
	mounted: function() {
	},
	methods: {		
		authenticated: function(authCode) {
			this.isAuthenticated = true;
			this.authCode = authCode;
		}
	}
}
</script>
<style>

	.content_height {
		min-height: calc(100vh - 120px);
	}
	.el-container {
		clear: both;
	}

</style>