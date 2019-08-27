<template>

	<el-form ref="form" :model="item" label-width="120px">
		<el-form-item label="First Name">
			<el-input v-model="item.firstName"></el-input>
		</el-form-item>
		<el-form-item label="Last Name">
			<el-input v-model="item.lastName"></el-input>
		</el-form-item>
		<el-form-item label="Bio">
			<el-input v-model="item.biography" type="textarea" autosize></el-input>
		</el-form-item>
	</el-form>

</template>
<script>

export default {
	props: {
		item: Object
	},
	data() {
		return {
		}
	},
	mounted: function() {
	},
	watch: {
	},
	methods: {
	},
	computed: {
	}
}
</script>
<style lang="css">



</style>