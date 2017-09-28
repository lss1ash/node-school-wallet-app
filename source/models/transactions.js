'use strict';

const path = require('path');

const file = require('../libs/file');
const ApplicationError = require('../libs/application-error');
const Cards = require('../models/cards');

const DATA_SOURCE = 'datasource/transaction.json';

class Transactions {
	constructor () {
		this._dataSource = path.join(__dirname, '..', DATA_SOURCE);
		this._transactions = null;
	}

	async getAll() {
		if(!this._transactions) {
			this._transactions = JSON.parse(await file.read(this._dataSource));
		}
		return this._transactions;
	}

	get(cardId) {
		if(this._transactions && this._transactions.length > 0) {
			const transactions = this._transactions.filter((item) => {
				return item.cardId === +cardId;
			});
			return transactions;
		} else {
			throw new ApplicationError('There are no transactions at all!', 500)
		}
	}

	async create (transaction) {
		const isDataValid = transaction &&
			transaction.hasOwnProperty('cardId') &&
			transaction.hasOwnProperty('type')
			transaction.hasOwnProperty('data') &&
			// transaction.hasOwnProperty('time') &&
			transaction.hasOwnProperty('sum');
		if (isDataValid) {
			// if(!Cards.exists(transaction.cardId)) {
			// 	console.log('try to throw!');
			// 	throw new ApplicationError(`Card ${cardId} doesn't exist`, 400);
			// }
			this._transactions.push(transaction);
			await file.write(this._dataSource, this._transactions);
			return transaction;
		} else {
			throw new ApplicationError('Card data is invalid', 400);
		}
	}

	remove () {
		throw new ApplicationError('Card removing is prohibited!', 400)
	}
}

module.exports = Transactions;
