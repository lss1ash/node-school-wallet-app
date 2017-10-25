'use strict';

const logger = require('../../libs/logger')('wallet-app');

module.exports = async (ctx) => {
	let transactions = [];
	if (ctx.params.id.toLowerCase() === 'all') {
		transactions = await ctx.Transactions.getAll();
	} else {
		transactions = await ctx.Transactions.getBy({cardId: ctx.params.id});
	}
	if (transactions) {
		ctx.body = transactions;
		ctx.status = 200;
		return;
	}
	logger.log('info', `Не найдены транзакции по карте ${ctx.params.id}`);
	ctx.status = 404;
	ctx.body = 'Не найдены транзакции по карте';
};
