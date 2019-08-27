const VueLoaderPlugin = require('vue-loader/lib/plugin');
const path = require('path');

module.exports = {
	mode: 'development',
	entry: path.join(__dirname, 'src/index.js'),
	output: {
		path:  path.join(__dirname, 'dist'),
		filename: 'index.js'
	},
	module: {
	    rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			{
				test: /\.css$/,
				use: [
					'vue-style-loader',
					'css-loader'
				]
			}
		]
	},
	plugins: [
		new VueLoaderPlugin()
	]
};