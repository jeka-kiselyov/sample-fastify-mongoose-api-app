<template>

	<p>
		This is the homepage.
	</p>

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