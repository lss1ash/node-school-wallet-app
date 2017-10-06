// const HtmlWebpackPlugin = require('html-webpack-plugin');
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
				// include: [path.resolve(__dirname, 'source')],
				exclude: /node_modules/,
				use: [
					'babel-loader',
					'eslint-loader'
				]
			},
			{
				test: /\.css$/,
				// include: [path.resolve(__dirname, 'source')],
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: 'css-loader'
				})
			}
		]
	},
	plugins: [
		// new HtmlWebpackPlugin({
		// 	title: 'Yamoney Node.js School'
		// }),
		new ExtractTextPlugin('style.css')
	]
};
