'use strict';

const mongoose = require('mongoose');
const logger = require('../libs/logger')('wallet-app: cards.js');
const Database = require('./database');

const CardModel = mongoose.model('Card', {
	id: {
		type: Number,
		required: true
	},
	cardNumber: {
		type: String,
		required: [true, 'Card number required']
	},
	balance: {
		type: String,
		required: true
	}
});

// const path = require('path');

// const file = require('../libs/file');
// const ApplicationError = require('../libs/application-error');

// const DATA_SOURCE = 'datasource/cards.json';

class Cards extends Database {
	constructor() {
		super();
		this._db = CardModel;
	}

	// /**
	//  * Возвращает все карты
	//  * @returns {Object[]}
	//  */
	// async getAll() {
	// 	if (!this._cards) {
	// 		this._cards = JSON.parse(await file.read(this._dataSource));
	// 	}
	// 	return this._cards;
	// }

	async updateBalance(cardId, amountDelta) {
		const card = await this.get(cardId);
		if (card) {
			try {
				if (+card.balance + amountDelta < 0) {
					return {updated: false, message: 'Недостаточно средств на карте'};
				}

				card.balance = (+card.balance + amountDelta).toFixed(2);
				await this._update({id: cardId}, {balance: card.balance});

				return {updated: true, message: 'Успешное обновление баланса карты'};
			} catch (err) {
				logger.log('ERROR', 'Error updating card balance', err);
				return {updated: false, message: 'Ошибка обновления баланса карты'};
			}
		}
		return false;
	}

	/**
	 * Добавляет карту
	 *
	 * @param {Object} card описание карты
	 * @returns {Object}
	 */
	async create(card) {
		const isDataValid = card &&
			Object.prototype.hasOwnProperty.call(card, 'cardNumber') &&
			Object.prototype.hasOwnProperty.call(card, 'balance');

		if (isDataValid) {
			const existentCard = await this.getBy({cardNumber: card.cardNumber});
			if (existentCard) {
				await this._update({cardNumber: card.cardNumber}, {balance: card.balance});
			} else {
				card.id = await this._generateId();
				await this._insert(card);
			}
			return card;
		}
		// throw new ApplicationError('Card data is invalid', 400);
		logger.log('info', 'Введены некорректные данные карты', card);
		return null;
	}

	/**
	 * Удалет карту
	 * @param {Number} id идентификатор карты
	 */
	async remove(id) {
		const card = await this.get();

		if (!card) {
			logger.log('info', 'Карта с указанным идентификатором не найдена', id);
			return false;
			// throw new ApplicationError(`Card with ID=${id} not found`, 404);
		}

		await this.remove(id);
		return true;
	}

	/**
	* Получает id карты (новый или существующей карты, если нашлась)
	*
	* @param {Object} card описание карты
	* @returns {Boolean, Number} существует?, индекс
	*/
	// getExistent(card) {
	// 	if (!card || !Object.prototype.hasOwnProperty.call(card, 'cardNumber')) return false;
	// 	const foundOne = this.getBy({cardNumber: card.cardNumber});
	// 	if (foundOne) {
	// 		return foundOne;
	// 	}
	// 	return false;
	// }
//
// 	existsId(cardId) {
// 		if (!cardId) return false;
// 		const foundOne = this.get(cardId);
// 		if (foundOne) {
// 			return true;
// 		}
// 		return false;
// 	}
}

module.exports = Cards;
