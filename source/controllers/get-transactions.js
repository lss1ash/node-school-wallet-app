'use strict';

module.exports = async (ctx) => {
	ctx.body = await ctx.Transactions.get(ctx.params.id);
};
