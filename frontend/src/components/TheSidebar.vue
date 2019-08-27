<template>


<transition name="fade">
	<el-aside v-if="isVisible" width="200px" v-bind:class="{ collapsed: isCollapsed }">
		<el-menu default-active="2" v-bind:router="true">
<!-- 			<el-menu-item index="/profiles">
				<i class="el-icon-user"></i>
				<span >Profiles</span>
			</el-menu-item> -->
			<el-menu-item index="/authors">
				<i class="el-icon-s-custom"></i>
				<span >Authors</span>
			</el-menu-item>
			<el-menu-item index="/books">
				<i class="el-icon-reading"></i>
				<span >Books</span>
			</el-menu-item>
	    </el-menu>
	</el-aside>
</transition>

</template>
<script>

export default {
	data() {
		return {
			show: true
		}
	},
	mounted: function() {
	},
	watch: {
	},
	methods: {
	},
	computed: {
		isVisible: function() {
			return (this.$store.state.me) ? true : false;
		},
		isCollapsed: function() {
			return false;
		}
	}
}	

</script>
<style lang="css">

aside {
	width: 200px !important;
	transition: all .5s ease;
	overflow: hidden !important;
    border-right: solid 1px #e6e6e6;
}

aside.collapsed {
	width: 60px !important;
}

aside span {
	transition: all .5s ease;
	opacity: 1;	
}

aside.collapsed span {
	opacity: 0;
}

.fade-enter-active {
	transition: all .5s ease;
	width: 200px !important;
}
.fade-leave-active {
	transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
	width: 200px !important;
}
.fade-enter, .fade-leave-to
	/* .slide-fade-leave-active below version 2.1.8 */ {
	transform: translateX(-100px);
	width: 50px !important;
	opacity: 0;
}

@media only screen and (max-width: 767px) {

	aside {
		width: 60px !important;
	}
	aside span {
		opacity: 0;
	}	

}


</style>