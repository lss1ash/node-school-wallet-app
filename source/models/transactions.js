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
		// if (!this._transactions) {
		this._transactions = JSON.parse(await file.read(this._dataSource));
		// }
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
			transaction.time = Transactions.getTime();
			this._transactions.push(transaction);

			await file.write(this._dataSource, this._transactions);
			return transaction;
		}
		logger.log('warn', 'Не удалось создать транзакцию: данные карты недействительны');
		// throw new ApplicationError('Не удалось создать транзакцию: данные карты недействительны!', 400);
		return null;
	}

	static remove() {
		throw new ApplicationError('Transaction removing is prohibited!', 400);
	}

	// Вынести в отдельный модуль?
	// format: 2017-08-9T05:28:31+03:00 (.length must be 25)
	static getTime() {
		const now = new Date();
		const YYYY = now.getFullYear();
		let MM = now.getMonth() + 1;
		let DD = now.getDate();
		let HH = now.getHours();
		let MI = now.getMinutes();
		let SS = now.getSeconds();
		MM = MM < 10 ? `0${MM}` : MM;
		DD = DD < 10 ? `0${DD}` : DD;
		HH = HH < 10 ? `0${HH}` : HH;
		MI = MI < 10 ? `0${MI}` : MI;
		SS = SS < 10 ? `0${SS}` : SS;

		// Timezone
		let TZ = -now.getTimezoneOffset() / 60;
		const sign = TZ < 0 ? '-' : '+';
		TZ = Math.abs(TZ);
		let TZ_HH = Math.floor(TZ);
		let TZ_MM = (TZ - TZ_HH) * 60;
		TZ_HH = TZ_HH < 10 ? `0${TZ_HH}` : TZ_HH;
		TZ_MM = TZ_MM < 10 ? `0${TZ_MM}` : TZ_MM;

		return `${YYYY}-${MM}-${DD}T${HH}:${MI}:${SS}${sign}${TZ_HH}:${TZ_MM}`;
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
