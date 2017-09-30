const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

module.exports = {
	entry: './source/client/',
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: [
					'babel-loader',
					'eslint-loader'
				]
			},
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract(['css-loader'])
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'Yamoney Node.js School'
		}),
		new ExtractTextPlugin('style.css')
	]
};
