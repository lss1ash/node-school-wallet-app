'use strict';

// const ApplicationError = require('../../libs/application-error');
const logger = require('../../libs/logger')('wallet-app:payMobile');

module.exports = async (ctx) => {
	const payMobile = ctx.request.body;
	payMobile.cardId = +ctx.params.id;

	if (ctx.Cards.updateBalance(payMobile.cardId, -payMobile.amount)) {
		const transaction = {
			cardId: payMobile.cardId,
			type: 'paymentMobile',
			data: '+666(012)345-67-89', // HARDCODED MOBILE NUMBER!!!!
			sum: -payMobile.amount
		};

		const transactionDone = await ctx.Transactions.create(transaction);
		if (transactionDone) {
			ctx.status = 201;
			ctx.body = `Выполнено списание с карты за мобильник ${payMobile.cardId} на сумму ${payMobile.amount}`;
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
		ctx.body = 'Не удалось оплатить мобильничек! :(';
		logger.log('warn', `Не удалось оплатить мобильничек! :( ${payMobile.cardId} на сумму ${payMobile.amount}`);
	}
};
