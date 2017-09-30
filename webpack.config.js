// const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
	entry: './source/client/index.js',
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: [
					/node_modules/,
					/build/
				],
				loader: [
					'babel-loader',
					'eslint-loader'
				]
			}
			// ,
			// {
			// 	test: /\.css$/,
			// 	use: [
			// 		'style-loader',
			// 		'css-loader',
			// 		'postcss-loader'
			// 	]
			// }
		]
	}
	// ,
	// plugins: [new HtmlWebpackPlugin({
	// 	title: 'Yamoney Node.js School'
	// })]
};
