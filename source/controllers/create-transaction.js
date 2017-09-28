'use strict';

module.exports = async (ctx) => {
	const transaction = ctx.request.body;
	transaction.cardId = ctx.params.id;
	const newTransaction = await ctx.Transactions.create(transaction);
	ctx.status = 201;
	ctx.body = newTransaction;
};
