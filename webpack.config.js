"use strict";
var webpack = require('webpack');
var path = require('path');

const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || "8888";

// local static content
/*loaders.push({
		test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3$/,
		loader: 'file-loader?limit=200000'
});*/

module.exports = {
	entry: [
	],
	output: {
		path: path.join(__dirname, 'public'),
		filename: 'bundle.js',
		publicPath: '/'
	},
	module: {
	},
	devServer: {
		contentBase: "./",
		// do not print bundle build stats
		noInfo: true,
		// enable HMR
		hot: true,
		// embed the webpack-dev-server runtime into the bundle
		inline: true,
		// serve index.html in place of 404 responses to allow HTML5 history
		historyApiFallback: true,
		port: PORT,
		host: HOST,
	},
	plugins: [
		/*new CopyWebpackPlugin([
        { from: './src/fonts/*' },
				{ from: './src/images/*' },
				{ from: './src/styles/*.css' }
    ])*/
	]
};
