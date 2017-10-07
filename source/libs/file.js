'use strict';

const fs = require('fs');
const logger = require('./logger')('wallet-app');

const file = {

	read(fileName) {
		return new Promise((resolve, reject) => {
			fs.readFile(fileName, (err, gotFile) => {
				if (err) {
					logger.log('error', `Не удалось прочитать файл ${fileName}`, err);
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
					logger.log('error', `Не удалось записать файл ${fileName}`, err);
					return reject(err);
				}
				return resolve();
			});
		});
	}
};

module.exports = file;
