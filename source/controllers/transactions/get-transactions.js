'use strict';

const logger = require('../../libs/logger')('wallet-app');

module.exports = async (ctx) => {
	const transactions = await ctx.Transactions.get(ctx.params.id);
	if (transactions) {
		ctx.body = transactions;
		ctx.status = 201;
		return;
	}
	logger.log('info', `Не найдены транзакции по карте ${ctx.params.id}`);
	ctx.status = 404;
	ctx.body = 'Не найдены транзакции по карте';
};
