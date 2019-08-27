<template>

  <el-footer>
    <div class="footer_row">
      MIT &copy; Source Code: <a href="https://github.com/jeka-kiselyov/fastify-mongoose-api">fastify-mongoose-api</a>
    </div>
  </el-footer>

</template>
<script>

export default {
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
		isAuthenticated: function() {
			return this.$store.state.me ? true : false;
		}
	}
}	

</script>
<style lang="css">

  .el-footer {
    border-top: solid 1px #e6e6e6;
    height: 60px;
    overflow: hidden;
  }

  .footer_row {
    padding: 0 20px 0 20px;
    line-height: 60px;
    text-align: right;
  }


</style>