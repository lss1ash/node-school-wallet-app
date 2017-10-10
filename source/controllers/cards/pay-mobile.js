'use strict';

// const ApplicationError = require('../../libs/application-error');
const logger = require('../../libs/logger')('wallet-app:pay-mobile');

module.exports = async (ctx) => {
	const payMobile = ctx.request.body;
	payMobile.cardId = +ctx.params.id;
	// payMobile.amount = payMobile.amount > 0 ? -payMobile.amount : payMobile.amount;

	const isBalanceUpdated = await ctx.Cards.updateBalance(payMobile.cardId, -payMobile.amount);

	if (isBalanceUpdated) {
		const transaction = ctx.Transactions.getTransactionTemplate(
			payMobile.cardId, 'paymentMobile',
			payMobile.data, payMobile.amount.toString()
		);
		const transactionDone = await ctx.Transactions.create(transaction);

		if (transactionDone) {
			ctx.status = 201;
			ctx.body = `Выполнено списание с карты ${payMobile.cardId
			} за мобильник ${transaction.data} на сумму ${payMobile.amount}`;
			logger.log('info', 'Выполнено списание с карты за мобильник' +
				` ${payMobile.cardId} на сумму ${payMobile.amount}`);
		}	else {
			ctx.status = 500;
			ctx.body = 'Не удалось выполнить транзакцию по списанию с карты';
			logger.log('warn', 'Не удалось выполнить транзакцию по списанию' +
				` с карты ${payMobile.cardId} на сумму ${payMobile.amount}`);
		}
	}	else {
		ctx.status = 400;
		ctx.body = 'Не удалось оплатить мобильный телефон!';
		logger.log('warn', `Не удалось оплатить мобильничек! :( ${payMobile.cardId} на сумму ${payMobile.amount}`);
	}
};
