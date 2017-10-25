'use strict';

module.exports = async (ctx) => {
	const card = ctx.request.body;
	const newCard = await ctx.Cards.create(card);

	if (newCard) {
		ctx.status = 201;
		ctx.body = newCard;
		return;
	}

	ctx.status = 400;
	ctx.body = 'Неверно заданы параметры запроса';
};
