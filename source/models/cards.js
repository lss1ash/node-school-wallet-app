'use strict';

const path = require('path');
const logger = require('../libs/logger')('wallet-app');

const file = require('../libs/file');
// const ApplicationError = require('../libs/application-error');

const DATA_SOURCE = 'datasource/cards.json';

class Cards {
	constructor() {
		this._dataSource = path.join(__dirname, '..', DATA_SOURCE);
		this._cards = null;
	}

	/**
	 * Возвращает все карты
	 * @returns {Object[]}
	 */
	async getAll() {
		if (!this._cards) {
			this._cards = JSON.parse(await file.read(this._dataSource));
		}
		return this._cards;
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
			const existentCard = this.getExistent(card);
			if (existentCard) {
				this._cards[this._cards.indexOf(existentCard)].balance = card.balance;
			} else {
				card.id = this._cards.length + 1;
				this._cards.push(card);
			}
			await file.write(this._dataSource, this._cards);
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
		const card = this._cards.find((item) => item.id === id);

		if (!card) {
			logger.log('info', 'Карта с указанным идентификатором не найдена', id);
			// throw new ApplicationError(`Card with ID=${id} not found`, 404);
		}

		const cardIndex = this._cards.indexOf(card);
		this._cards.splice(cardIndex, 1);
		await file.write(this._dataSource, this._cards);
	}

	/**
	* Получает id карты (новый или существующей карты, если нашлась)
	*
	* @param {Object} card описание карты
	* @returns {Boolean, Number} существует?, индекс
	*/
	getExistent(card) {
		const foundOne = this._cards.find((item) => item.cardNumber === card.cardNumber);
		if (foundOne) {
			return foundOne;
		}
		return false;
	}

	existsId(cardId) {
		const foundOne = this._cards.find((item, index) => index === cardId);
		if (foundOne) {
			return true;
		}
		return false;
	}
}

module.exports = Cards;
