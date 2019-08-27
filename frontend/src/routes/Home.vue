<template>

	<div>
		<p>Sample application to check <el-link  href="https://github.com/jeka-kiselyov/fastify-mongoose-api">fastify-mongoose-api</el-link> in action.</p>

		<p>Fastify plugin to create REST API based on Mongoose MongoDB models.</p>

		<el-divider></el-divider>
		
		<p>Source code for this app <el-link href="https://github.com/jeka-kiselyov/sample-fastify-mongoose-api-app">is on GitHub</el-link></p>

		<ul>
			<li><el-link href="https://github.com/jeka-kiselyov/sample-fastify-mongoose-api-app/blob/master/frontend/src/includes/api.js">vue.$api plugin</el-link></li> 
			<li><el-link href="https://github.com/jeka-kiselyov/sample-fastify-mongoose-api-app/blob/master/server/FastifyServerAuth.js">auth helper</el-link></li> 
			<li><el-link href="https://github.com/jeka-kiselyov/sample-fastify-mongoose-api-app/blob/master/commands/startserver.js">fastify server initialization</el-link></li> 
			<li><el-link href="https://github.com/jeka-kiselyov/sample-fastify-mongoose-api-app/tree/master/frontend/src/routes">pages components</el-link></li> 
			<li><el-link href="https://github.com/jeka-kiselyov/sample-fastify-mongoose-api-app/tree/master/frontend/src/components">other components</el-link></li> 
		</ul>

		<el-divider></el-divider>

		<p>Play with it</p>

		<p>Username: admin</p>
		<p>Password: admin</p>

		<p><router-link to="/books"><el-link>Manage Books</el-link></router-link> <router-link to="/authors"><el-link>Manage Authors</el-link></router-link> </p>
	</div>

</template>
<script>


export default {
	path: '/',
	data() {
		return {
		}
	},
	mounted: function() {
	},
	watch: {
	},
	methods: {
		toggleSidebar: function() {
		}
	}
}	
</script>
<style lang="css">



</style>