// const env = process.env.NODE_ENV
// use: env === 'production' ? 'css-loader&minimize=true' : 'css-loader'

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

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
					include: [path.resolve(__dirname, 'source')],
					// exclude: /node_modules/,
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
						// use: 'css-loader'
						use: {
							loader: 'css-loader',
							options: {
								minimize: true
							}
						}
					})
				}
			]
		},
		plugins: [
			new ExtractTextPlugin('style.css'),
			new webpack.optimize.UglifyJsPlugin()
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
					include: [path.resolve(__dirname, 'source')],
					use: [
						'babel-loader',
						'eslint-loader'
					]
				},
				{
					test: /\.css$/,
					use: 'ignore-loader'
				}
			]
		}
	}
];
