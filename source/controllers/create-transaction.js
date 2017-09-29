'use strict';

const ApplicationError = require('../libs/application-error');

module.exports = async (ctx) => {
	const transaction = ctx.request.body;
	transaction.cardId = +ctx.params.id;

	if (!ctx.Cards.existsId(transaction.cardId)) {
		throw new ApplicationError(`Card ${transaction.cardId} doesn't exist`, 400);
	}

	const newTransaction = await ctx.Transactions.create(transaction);
	ctx.status = 201;
	ctx.body = newTransaction;
};
