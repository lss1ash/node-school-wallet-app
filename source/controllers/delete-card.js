'use strict';

module.exports = async (ctx) => {
	const cardId = Number(ctx.params.id);
	await ctx.Cards.remove(cardId);
	ctx.status = 200;
};
