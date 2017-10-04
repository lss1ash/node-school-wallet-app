const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

module.exports = {
	entry: path.resolve(__dirname, 'source/server/index.js'),
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			},
			{
				test: /\.css$/,
				include: [/node_modules\\antd/, /source/],
				use: ExtractTextPlugin.extract(['css-loader'])
			}
		]
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'public')
	},
	plugins: [
		new ExtractTextPlugin('style.css')
	]
};
