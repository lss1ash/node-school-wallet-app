'use strict';

const path = require('path');

const file = require('../libs/file');
const ApplicationError = require('../libs/application-error');
const Cards = require('../models/cards');

const DATA_SOURCE = 'datasource/transaction.json';

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

	get(cardId) {
		if (this._transactions && this._transactions.length > 0) {
			const transactions = this._transactions.filter((item) => item.cardId === +cardId);
			return transactions;
		}
		throw new ApplicationError('There are no transactions at all!', 500);
	}

	async create(transaction) {
		const isDataValid = transaction &&
			Object.prototype.hasOwnProperty.call(transaction, 'cardId') &&
			Object.prototype.hasOwnProperty.call(transaction, 'type') &&
			Object.prototype.hasOwnProperty.call(transaction, 'data') &&
			// Object.prototype.hasOwnProperty.call(transaction, 'time') &&
			Object.prototype.hasOwnProperty.call(transaction, 'sum');
		if (isDataValid) {
			if (!(Cards.exists(transaction.cardId))) {
				console.log('try to throw!');
				throw new ApplicationError(`Card ${transaction.cardId} doesn't exist`, 400);
			}
			this._transactions.push(transaction);
			await file.write(this._dataSource, this._transactions);
			return transaction;
		}
		throw new ApplicationError('Card data is invalid', 400);
	}

	static remove() {
		// this.id = id;
		throw new ApplicationError('Card removing is prohibited!', 400);
	}
}

module.exports = Transactions;
