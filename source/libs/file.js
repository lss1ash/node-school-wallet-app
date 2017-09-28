'use strict';

const fs = require('fs');

const file = {

	read(fileName) {
		return new Promise((resolve, reject) => {
			fs.readFile(fileName, (err, gotFile) => {
				if (err) {
					return reject(err);
				}
				return resolve(gotFile);
			});
		});
	},

	write(fileName, data) {
		return new Promise((resolve, reject) => {
			fs.writeFile(fileName, JSON.stringify(data, null, '  '), 'utf8', (err) => {
				if (err) {
					return reject(err);
				}
				return resolve();
			});
		});
	}
};

module.exports = file;
