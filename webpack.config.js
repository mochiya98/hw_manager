const path = require("path");

const webpack = require("webpack");
const merge = require("webpack-merge");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const config = require("./config.js");

module.exports = (env, argv) => {
	if(!argv.mode)argv.mode = "development";
	var config_current = config[argv.mode];
	
	var define = config_current.define ? config_current.define : {};
	define.PRODUCTION = JSON.stringify(argv.mode === "production");
	define.DEVELOPMENT = JSON.stringify(argv.mode === "development");
	define.DEBUG = JSON.stringify(argv.mode === "development");

	var settings = merge(
		{
			//base
			context: path.resolve(__dirname, "./src"),
			devtool: "cheap-module-eval-source-map",
			entry  : "index.js",
			mode   : "development",
			output : {
				filename: "app.js",
			},
		},
		{
			//js,jsx
			module: {
				rules: [
					{
						exclude: /node_modules/,
						loader : "babel-loader",
						test   : /\.(js|jsx)$/,
					},
				],
			},
			resolve: {
				extensions: [".js", ".jsx"],
				modules   : [
					"src",
					"node_modules",
				],
			},
		},
		{
			//css
			module: {
				rules: [
					{
						exclude: /node_modules/,
						test   : /\.css$/,
						use    : ExtractTextPlugin.extract(
							{
								loader : "css-loader",
								options: {
									url     : false,
									minimize: true, // CSS の minify を行う
								},
							}
						),
					},
				],
			},
			plugins: [
				new ExtractTextPlugin("app.css"),
			],
		},
		{
			//define
			plugins: [
				new webpack.DefinePlugin(
					define
				),
			],
		},
		{
			//static
			plugins: [
				new CopyWebpackPlugin([
					{from: "static", to: ""},
				], {}),
			],
		},
		{
			//devServer
			devServer: {
				contentBase     : "dist",
				port            : 3000,
				watchContentBase: true,
			},
		},
	);
	
	if(argv.mode === "production"){
		settings.devtool = "nosources-source-map";
	}
	return settings;
};
