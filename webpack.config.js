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
				exclude: [
					path.resolve(__dirname, 'build'),
					path.resolve(__dirname, 'node_modules'),
					path.resolve(__dirname, '.git')
				],
				use: [
					'babel-loader',
					'eslint-loader'
				]
			},
			{
				test: /\.css$/,
				exclude: [
					path.resolve(__dirname, 'build'),
					path.resolve(__dirname, 'node_modules'),
					path.resolve(__dirname, '.git')
				],
				use: ExtractTextPlugin.extract(
					['style-loader', 'css-loader'] // , 'sass-loader']
				)
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'Yamoney Node.js School'
		}),
		new ExtractTextPlugin('test111.css')
	]
};
