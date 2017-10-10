'use strict';

const path = require('path');
const logger = require('../libs/logger')('wallet-app');

const file = require('../libs/file');
const ApplicationError = require('../libs/application-error');

const DATA_SOURCE = 'datasource/transactions.json';

class Transactions {
	constructor() {
		this._dataSource = path.join(__dirname, '..', DATA_SOURCE);
		this._transactions = null;
	}

	async getAll() {
		if (!this._transactions) {
			this._transactions = JSON.parse(await file.read(this._dataSource));
		}
		return this._transactions;
	}

	async get(cardId) {
		if (this._transactions && this._transactions.length > 0) {
			const transactions = this._transactions.filter((item) => +item.cardId === +cardId);
			return transactions.length > 0 ? transactions : null;
		}
		logger.log('warn', 'Error getting transactions...');
		// throw new ApplicationError('Error getting transactions...', 500);
		return null;
	}

	async create(transaction) {
		const isDataValid = transaction &&
			Object.prototype.hasOwnProperty.call(transaction, 'cardId') &&
			Object.prototype.hasOwnProperty.call(transaction, 'type') &&
			Object.prototype.hasOwnProperty.call(transaction, 'data') &&
			Object.prototype.hasOwnProperty.call(transaction, 'sum');

		if (isDataValid) {
			transaction.id = this._transactions.length + 1;
			transaction.cardId = Number(transaction.cardId);
			const now = new Date();

			// Добавить getTimezoneOffset()
			transaction.time = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}` +
				`T${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
			this._transactions.push(transaction);

			await file.write(this._dataSource, this._transactions);
			return transaction;
		}
		// throw new ApplicationError('Card data is invalid!', 400);
		logger.log('warn', 'Данные карты недействительны');
		return null;
	}

	static remove() {
		throw new ApplicationError('Card removing is prohibited!', 400);
	}

	// eslint-disable-next-line
	getTransactionTemplate(cardId = 0, type = '', data = '', sum = '') {
		return {
			cardId,
			type,
			data,
			sum,
			id: 0,
			time: ''
		};
	}
}

module.exports = Transactions;
