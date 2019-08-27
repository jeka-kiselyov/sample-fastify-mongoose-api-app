<template>

	<div>
		<div class="top_block">

		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">Admin</el-breadcrumb-item>
			<el-breadcrumb-item>Books</el-breadcrumb-item>
		</el-breadcrumb>

		</div>
		<div class="top_block top_block_pagination">
			<div class="pagination_container">

				<el-pagination
					v-bind:hide-on-single-page="true"
					small
					v-bind::pager-count="4"
					background 
					layout="prev, pager, next" 
					:total="total" 
					:page-size="perPage" 
					:current-page.sync="currentPage" 
					@current-change="paginationChange"></el-pagination>

				<template>&nbsp;</template>
			</div>
		</div>
		<div class="top_block top_block_actions">
			<div class="top_block_actions_div">
		        <el-button size="mini" type="success" icon="el-icon-plus" @click="handleAdd">Add</el-button>
		    </div>
		</div>

		<el-table :data="tableData" stripe  style="width: 100%" @sort-change="sortChange" v-loading="isLoading" empty-text="Nothing here yet">
			<el-table-column prop="_id" sortable label="ID" width="80">
				<template slot-scope="scope">
					<span class="the_id_cell" @click="idToClipboard(scope.row._id)">&hellip;{{ (''+scope.row._id).slice(-4) }}</span>
				</template>
				</el-table-column>
			<el-table-column prop="title" sortable label="Title" width="180"></el-table-column>
			<el-table-column prop="isbn" sortable label="ISBN" width="180"></el-table-column>
			<el-table-column prop="author" sortable label="author" width="180">
    			<template slot-scope="scope">
    				<div v-if="scope.row.author">
	    				{{ (''+scope.row.author.firstName) }} {{ (''+scope.row.author.lastName) }}
	    			</div>
    			</template>
			</el-table-column>
    		<el-table-column label="Operations" align="right"  fixed="right">
    			<template slot="header" slot-scope="scope">
					<el-input
					v-model="search"
					size="mini"
					placeholder="Type to search"/>
				</template>
    			<template slot-scope="scope">
					<el-button size="mini" @click="handleEdit(scope.$index, scope.row)" icon="el-icon-edit"></el-button>
					<el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)" icon="el-icon-delete"></el-button>
				</template>
    		</el-table-column>
		</el-table>

		<div class="pagination_container pagination_container_wide">
			<el-pagination 
				v-bind:hide-on-single-page="true"
				background 
				layout="prev, pager, next" 
				:total="total" 
				:page-size="perPage" 
				:current-page.sync="currentPage" 
				@current-change="paginationChange"></el-pagination>
		</div>

		<el-drawer
			title="Edit item"
			:visible.sync="editFormVisible"
			direction="rtl"
			custom-class="form-drawer"
			size="50%">
			<div class="form-drawer__content">
				<component v-bind:is="formComponent" :item="editItem"></component>
			    <div class="form-drawer__footer">
					<el-button @click="cancelEdit">Cancel</el-button>
					<el-button type="primary" @click="commitEdit">Save</el-button>
				</div>
			</div>
		</el-drawer>

		<el-drawer
			title="Add item"
			:visible.sync="addFormVisible"
			direction="rtl"
			custom-class="form-drawer"
			size="50%">
			<div class="form-drawer__content">
				<component v-bind:is="formComponent" :item="addItem"></component>
			    <div class="form-drawer__footer">
					<el-button @click="cancelAdd">Cancel</el-button>
					<el-button type="primary" @click="commitAdd">Add</el-button>
				</div>
			</div>
		</el-drawer>

	</div>

</template>
<script>
export default {
	path: '/books',
	authRequired: true,
	data() {
		return {
			isLoading: true,
			tableData: [],
			collectionName: 'books',
			formComponent: 'Book',

			editItem: null,
			editItemBackup: null,
			editFormVisible: false,

			addItem: {},
			addFormVisible: false,

			total: 0,
			perPage: 100,
			currentPage: 1,

			sort: undefined,
			search: null
		}
	},
	mounted: function() {
		this.askServer();
	},
	watch: {
		search: function() {
			this.askServer();			
		}
	},
	methods: {
		idToClipboard: function(id) {
			this.$clipboard(id);
			this.$notify({
					title: 'Clipboard',
					message: ''+id+' has been copied to clipboard',
					type: 'success'
		        });
		},
		handleAdd: async function() {
			this.addItem = {};
			this.addFormVisible = true;
		},
		cancelAdd: async function() {
			this.addItem = {};
			this.addFormVisible = false;
		},
		commitAdd: async function() {
			this.addFormVisible = false;
			let savedOnServer = await this.$api.getCollection(this.collectionName).post(this.addItem, {populate: 'author'});

			if (savedOnServer) {
				this.tableData.unshift(savedOnServer);
				this.$notify({
						title: 'Success',
						message: 'Item has been added',
						type: 'success'
			        });
			}
		},
		handleEdit: async function(index, row) {
			this.editItem = row;
			this.editItemBackup = JSON.parse(JSON.stringify(this.editItem));
			this.editFormVisible = true;
		},
		cancelEdit: async function() {
			Object.assign(this.editItem, this.editItemBackup);
			// this.editItem = this.editItemBackup;
			this.editFormVisible = false;
		},
		commitEdit: async function() {
			this.editFormVisible = false;
			let savedOnServer = await this.$api.getCollection(this.collectionName).edit(this.editItem, {populate: 'author'});
			this.$notify({
					title: 'Success',
					message: 'Item has been updated',
					type: 'success'
		        });
			Object.assign(this.editItem, savedOnServer);			
		},
		handleDelete: async function(index, row) {
			try {
				await this.$confirm('This will permanently delete the item. Continue?', 'Warning', {
						confirmButtonText: 'OK',
						cancelButtonText: 'Cancel',
						type: 'warning'
					});
				await this.$api.getCollection(this.collectionName).delete(row);
				this.$notify({
						title: 'Success',
						message: 'Item has been removed',
						type: 'success'
			        });
				this.tableData.splice(index, 1);
			} catch(e) {
				/// Canceled
			}
		},
		sortChange: function(sortOptions) {
			this.sort = sortOptions.prop;
			if (sortOptions.order == 'descending') {
				this.sort = '-'+this.sort;
			}
			this.askServer();
		},
		paginationChange: function() {
			this.askServer();
		},
		askServer: async function() {
			this.isLoading = true;
			let results = await this.$api.getCollection(this.collectionName).list({
					limit: this.perPage,
					offset: (this.currentPage-1)*this.perPage,
					sort: this.sort,
					search: this.search,
					populate: 'author'
				});
			this.tableData = results.items;
			this.total = results.total;

			this.isLoading = false;
		}
	}
}	
</script>
<style lang="css">
.top_block {
	width: 33%;
	float: left;
	overflow: hidden;
}
.top_block_pagination {
	text-align: center;
}
.top_block_actions {
	width: 34%;
	text-align: right;
}
.top_block_actions_div {
	padding: 0 10px;
}

@media only screen and (max-width: 767px) {
	.top_block {
		width: 100%;
	}
	.top_block_pagination {
		padding:  10px 0;
	}
	.top_block_actions {
		text-align: center;
	}
	.top_block_actions_div {
		padding: 10px 0;
	}
}

.form-drawer {
	overflow-y: scroll;
	transition: all .5s ease;
}
.form-drawer__content {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 20px;
}
.form-drawer__content form {
    flex: 1;
}
.form-drawer__footer {
    display: flex;
}
.form-drawer__footer button {
    flex: 1;
}

@media only screen and (max-width: 992px) {
	.form-drawer {
		width: 80% !important;
	}
}

@media only screen and (max-width: 767px) {
	.form-drawer {
		width: 90% !important;
	}
}

.pagination_container {
	text-align: center;
}

.pagination_container_wide {
	padding-top: 10px;	
}

.pagination_container .el-pagination {
	display: inline-block;
}

.the_id_cell {
	cursor: pointer;
}

</style>