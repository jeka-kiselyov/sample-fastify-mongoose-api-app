<template>

	<el-form ref="form" :model="item" label-width="120px">
		<el-form-item label="Title">
			<el-input v-model="item.title"></el-input>
		</el-form-item>
		<el-form-item label="ISBN">
			<el-input v-model="item.isbn"></el-input>
		</el-form-item>
		<el-form-item label="Author">
			<template v-if="author">
				<el-input v-model="author" :disabled="true">
				    <el-button slot="append" icon="el-icon-edit" @click="changeAuthor"></el-button>
				</el-input>
			</template>
			<el-select v-else
				v-model="item.author"
				filterable
				remote
				reserve-keyword
				placeholder="Author"
				loading-text="Loading"
				no-match-text="No match"
				no-data-text="Nothing found"
				:remote-method="remoteMethod"
				:loading="loading">
				<el-option
					v-for="option in options"
					:key="option.value"
					:label="option.label"
					:value="option.value">
				</el-option>
			</el-select>
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
			options: [],
			loading: false
		}
	},
	mounted: function() {
	},
	watch: {
	},
	methods: {
		changeAuthor: async function() {
			this.item.author = undefined;
		},
		remoteMethod: async function(query) {
			if (query !== '') {
				//// autocomplete by first name first
				let data = await this.$api.getCollection('authors').list({
					limit: 10,
					match: 'firstName=(?i)'+query
				});

				if (!data || !data.total) {
					/// if nothing is found - try to lookup by the last name
					data = await this.$api.getCollection('authors').list({
						limit: 10,
						match: 'lastName=(?i)'+query
					});
				}

				this.options = [];
				if (data && data.items) {
					for (let item of data.items) {
						this.options.push({
							label: item.firstName+' '+item.lastName,
							value: item._id
						});
					}
				}
			}
		}
	},
	computed: {
		author: function() {
			if (this.item.author && this.item.author.firstName) {
				return ''+this.item.author.firstName+' '+this.item.author.lastName;
			}
		}
	}
}
</script>
<style lang="css">



</style>