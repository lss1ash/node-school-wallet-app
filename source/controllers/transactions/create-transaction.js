'use strict';

// const ApplicationError = require('../../libs/application-error');
const logger = require('../../libs/logger')('wallet-app');

module.exports = async (ctx) => {
	const transaction = ctx.request.body;

	if (!transaction) {
		ctx.status = 400;
		return;
	}
	transaction.cardId = +ctx.params.id;

	if (!ctx.Cards.get(transaction.cardId)) {
		// throw new ApplicationError(`Card ${transaction.cardId} doesn't exist`, 400);
		logger.log('warn', `Не удалось найти карту с идентификатором ${transaction.cardId}`);
		ctx.status = 400;
		ctx.body = `Не удалось найти карту с идентификатором ${transaction.cardId}`;
		return;
	}

	const newTransaction = await ctx.Transactions.create(transaction);
	if (newTransaction) {
		ctx.status = 201;
		ctx.body = newTransaction;
		return;
	}
	ctx.status = 400;
};
