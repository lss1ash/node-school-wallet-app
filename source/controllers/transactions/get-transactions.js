'use strict';

module.exports = async (ctx) => {
	const transactions = await ctx.Transactions.get(ctx.params.id);
	if (transactions) {
		ctx.body = transactions;
		ctx.status = 201;
		return;
	}
	ctx.status = 404;
	ctx.body = 'Transaction not found';
};
