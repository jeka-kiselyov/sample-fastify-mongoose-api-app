<template>

	<el-header>
		<div class="header_row">
			<div class="header_row_box header_row_left">

		  			<!-- https://element.eleme.io/#/en-US/component/menu			 -->
				<el-menu class="el-menu-demo" mode="horizontal" v-bind:router="true">
					<el-menu-item index="/">Processing Center</el-menu-item>
					<el-submenu index="/authors" class="hidden-md-and-down">
						<template slot="title">Workspace</template>
						<el-menu-item index="/authors">Authors</el-menu-item>
						<el-menu-item index="/books">Books</el-menu-item>
					</el-submenu>
				</el-menu>

			</div>
			<div class="header_row_box header_row_right">

				<div class="header_row_right_container">

					<el-dropdown @command="handleCommand" v-if="isAuthenticated">
						<span class="el-dropdown-link">
							{{ hello }} <i class="el-icon-setting"></i>
						</span>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item command="profile">Profile</el-dropdown-item>
							<el-dropdown-item command="logout" divided>Log Out</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
					<el-button v-else @click="signin">Sign In</el-button>

				</div>

			</div>
		</div>

	</el-header>


</template>
<script>

export default {
	data() {
		return {
		}
	},
	mounted: function() {
		console.log(this.$store)
	},
	watch: {
	},
	methods: {
		handleCommand(command) {
			if (command == 'logout') {
				this.$store.dispatch('doLogOut');		
			} else {
		        this.$message('You are good');				
			}
		},
		signin() {
			this.$store.dispatch('doSignIn');		
		}
	},
	computed: {
		isAuthenticated: function() {
			return this.$store.state.me ? true : false;
		},
		hello: function() {
			if (this.$store.state.me) {
				return "Howdy, "+this.$store.state.me.username+"!";
			} else {
				return "";
			}
		}
	}
}	

</script>
<style lang="css">


	.el-header {
		padding: 0 !important;
	}

	.header_row {
        border-bottom: solid 1px #e6e6e6;
        height: 60px;
        overflow: hidden;
	}

	.header_row_box {
		margin: 0;
		padding: 0;
	}

	.header_row_left {
		float: left;
		width: 50%;
	}

	.header_row_right {
		float: right;
		width: 50%;
	}

	.header_row_right_container {
		float: right;
		cursor: pointer;
		height: 60px;
	    line-height: 60px;
	    padding: 0 20px;
	}

	@media only screen and (max-width: 767px) {

	}

</style>