<template>

	<div>
		<p>Sample application to check <el-link  href="https://github.com/jeka-kiselyov/fastify-mongoose-api">fastify-mongoose-api</el-link> in action.</p>

		<p>Fastify plugin to create REST API based on Mongoose MongoDB models.</p>

		<p>Username: admin</p>
		<p>Password: admin</p>

		<p><el-link href="/books">Manage Books</el-link> <el-link href="/authors">Manage Authors</el-link></p>
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
		console.log(this.$api.getCollection('users').list());
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