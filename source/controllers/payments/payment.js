'use strict';

// const path = require('path');
// const logger = require('../../libs/logger')('wallet-app:payment');
// const ApplicationError = require('../libs/application-error');

class Payment {
	constructor(request, Cards, Transactions) {
		this.TYPES_WITHDRAW = {
			paymentMobile: 'paymentMobile',
			card2Card_from: 'card2Card'
		};
		this.TYPES_FILLUP = {
			prepaidCard: 'prepaidCard',
			card2Card_to: 'card2Card'
		};

		this.Transactions = Transactions;
		this.Cards = Cards;
		this.params = request;
		this._checkParams();
	}

	/**
	 * Валидация параметров запроса на выполнение операции
	 * @returns {Boolean}
	 */
	_validate() {
		return this.params &&
			Object.prototype.hasOwnProperty.call(this.params, 'cardId') &&
			Object.prototype.hasOwnProperty.call(this.params, 'data') &&
			Object.prototype.hasOwnProperty.call(this.params, 'amount');
	}

	_checkParams() {
		if (!this._validate()) { return {status: 400, body: 'Invalid request!'}; }

		if (Object.prototype.hasOwnProperty.call(this.TYPES_WITHDRAW, this.params.paymentType)) {
			this.params.amount = -this.params.amount;
			this.params.paymentType = this.TYPES_WITHDRAW[this.params.paymentType];
		} else {
			this.params.amount = +this.params.amount;
			this.params.paymentType = this.TYPES_FILLUP[this.params.paymentType];
		}
		return true;
	}

	/**
	* Отменяет списание с карты (если не была создана запись о транзакции, но баланс уже изменился)
	* @returns {Boolean}
	*/
	async _rollback() {
		return this.Cards.updateBalance(this.params.cardId, -this.params.amount);
	}

	async _makeTransaction() {
		const transaction = this.Transactions.getTransactionTemplate(
			this.params.cardId, this.params.paymentType,
			this.params.data, this.params.amount.toString()
		);
		return this.Transactions.create(transaction);
	}

	/**
	 * Общий метод проведения платежа (списание с карты/пополнение карты + транзакция)
	 * @returns {Object}
	 */
	async process() {
		const response = {
			status: 400,
			body: 'Invalid request!'
		};

		if (!this._validate()) { return response; }

		const balance = await this.Cards.updateBalance(this.params.cardId, this.params.amount);

		if (balance.updated) {
			const transactionDone = await this._makeTransaction();
			if (transactionDone) {
				response.status = 201;
				response.body = {transaction: transactionDone};
			} else {
				response.status = 500;
				response.body = {
					message: `Не удалось создать транзакцию по карте ${this.cardId} на сумму ${this.amount}`
				};
				this._rollback();
			}
		}	else {
			response.status = 500;
			response.body = {
				message: 'Не удалось выполнить операцию по карте' +
						` ${this.params.cardId} на сумму ${this.params.amount}!\n${balance.message}`
			};
		}
		return response;
	}
}

module.exports = Payment;
