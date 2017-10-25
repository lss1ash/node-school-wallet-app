'use strict';

module.exports = async (ctx) => {
	const cardId = Number(ctx.params.id);
	if (await ctx.Cards.remove(cardId)) {
		ctx.status = 200;
		return;
	}
	ctx.status = 400;
};
