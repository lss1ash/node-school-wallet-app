'use strict';

const file = require('file');
const path = require('path');

const ApplicationError = require('../libs/application-error');

const DATA_SOURCE = 'cards.json';

class Cards {
	constructor () {
		this._dataSource = path.join(__dirname, '..', 'data', DATA_SOURCE);
		this._data = null;
	}

	/**
	 * Возвращает все карты
	 * @returns {Object[]}
	 */
	async getAll () {
		if(!this._data) {
			this._data = await file.read(this._dataSource);
		}
		return this._data;
	}

	// /**
	//  * Добавляет карту
	//  *
	//  * @param {Object} card описание карты
	//  * @returns {Object}
	//  */
	// create (card) {
	// 	const isDataValid = card && card.hasOwnProperty('cardNumber') && card.hasOwnProperty('balance');
	// 	if (isDataValid) {
	// 		card.id = this._data.length + 1;
	// 		this._data.push(card);
	// 		this._saveUpdates();
	// 		return card;
	// 	} else {
	// 		throw new ApplicationError('Card data is invalid', 400);
	// 	}
	// }
	//
	// /**
	//  * Удалет карту
	//  * @param {Number} id идентификатор карты
	//  */
	// remove (id) {
	// 	const card = this._data.find((item) => {
	// 		return item.id === id;
	// 	});
	//
	// 	if (!card) {
	// 		throw new ApplicationError(`Card with ID=${id} not found`, 404);
	// 	}
	// 	const cardIndex = this._data.indexOf(card);
	// 	this._data.splice(cardIndex, 1);
	// 	this._saveUpdates();
	// }
	//
	// /**
	//  * Сохраняет изменения
	//  * @private
	//  */
	// _saveUpdates () {
	// 	fs.writeFileSync(DATA_SOURCE, JSON.stringify(this._data, null, 4));
	// }
}

module.exports = Cards;
