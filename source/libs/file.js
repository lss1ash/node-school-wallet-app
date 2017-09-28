'use strict';

const fs = require('fs');

const file = {

	read (fileName) => new Promise((resolve, reject) => {
		fs.readFile(fileName, (err, file) => {
			if (err) {
				return reject(err);
			}
			resolve(file));
		});
	});

}

module.exports = file;
