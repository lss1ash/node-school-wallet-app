// const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

module.exports = [
	{
		entry: './source/views/client/',
		output: {
			path: path.resolve(__dirname, 'public'),
			filename: 'script.js'
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
	},
	{
		entry: './source/views/server/',
		output: {
			path: path.resolve(__dirname, './source/views/server/'),
			filename: 'bundle.js',
			libraryTarget: 'umd'
		},
		target: 'node',
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
					use: 'ignore-loader'
				}
			]
		}
	}
];
