const path = require('path');
const glob = require('glob');

const PATH_SRC = path.join(__dirname, 'src');

function getEntry() {
	let files = glob.sync('**/*.html', { cwd: PATH_SRC });
	let entries = {},
		pathname;  //文件路径(不包含扩展名)

	for (let i = 0; i < files.length; i++) {
		pathname = files[i].replace(/\.html$/, '');
		entries[pathname] = pathname;
	}
	return entries;
}

module.exports = getEntry();