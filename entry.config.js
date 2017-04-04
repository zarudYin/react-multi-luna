const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PATH_SRC = path.join(__dirname, 'src');

const files = glob.sync('pages/**/*.html', { cwd: PATH_SRC });

function getEntry() {
	let entry = {},
		pathname;  //文件路径(不包含扩展名)

	for (let i = 0; i < files.length; i++) {
		pathname = files[i].replace(/\.html$/, '');
		entry[pathname] = pathname;
	}
	return entry;
}

function getOutput() {
	let output = {},
		basename,	 //文件名(不包含扩展名)
		pathname;  //文件路径(不包含扩展名)

	for (let i = 0; i < files.length; i++) {
		let file = files[i];
		basename = path.basename(file, '.html');
		pathname = file.replace(/\.html$/, '').replace(/^pages\//, '');
		output[pathname] = pathname;
	}
	return output;
}

function getHtml() {
	const htmlPluginArray = [];
	const minify = {
		removeComments: true,
		collapseWhitespace: true,
		removeRedundantAttributes: true,
		useShortDoctype: true,
		removeEmptyAttributes: true,
		removeStyleLinkTypeAttributes: true,
		keepClosingSlash: true,
		minifyJS: true,
		minifyCSS: true,
		minifyURLs: true
	}
	const output = getOutput();

	for (let key in output) {
		let name = output[key];
		let option = {
			filename: `html/${name}.html`,
			template: `pages/${key}.html`,
			chunks: ['common', `pages/${key}`],
		}

		if (process.env.NODE_ENV === 'production') {
			option.minify = minify;
		}
		htmlPluginArray.push(new HtmlWebpackPlugin(option))
	}

	return htmlPluginArray;
}

module.exports = {
	entry: getEntry(),
	html: getHtml(),
};