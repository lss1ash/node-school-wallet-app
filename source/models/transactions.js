'use strict';

const mongoose = require('mongoose');
const logger = require('../libs/logger')('wallet-app: cards.js');
const ApplicationError = require('../libs/application-error');
const Database = require('./database');
const datetime = require('../libs/datetime');

const TransactionModel = mongoose.model('Transaction', {
	cardId: Number,
	type: String,
	data: String,
	time: {
		type: Date,
		default: Date.now
	},
	sum: String,
	id: {
		type: Number,
		required: true
	}
});


class Transactions extends Database {
	constructor() {
		super();
		this._db = TransactionModel;
	}

	async create(transaction) {
		const isDataValid = transaction &&
			Object.prototype.hasOwnProperty.call(transaction, 'cardId') &&
			Object.prototype.hasOwnProperty.call(transaction, 'type') &&
			Object.prototype.hasOwnProperty.call(transaction, 'data') &&
			Object.prototype.hasOwnProperty.call(transaction, 'sum');

		if (isDataValid) {
			transaction.id = await this._generateId();
			transaction.cardId = Number(transaction.cardId);
			transaction.time = datetime.get();

			await this._insert(transaction);
			return transaction;
		}
		logger.log('warn', 'Не удалось создать транзакцию: данные карты недействительны');
		// throw new ApplicationError('Не удалось создать транзакцию: данные карты недействительны!', 400);
		return null;
	}

	static remove() {
		throw new ApplicationError('Transaction removing is prohibited!', 400);
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
