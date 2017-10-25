'use strict';

// const DBCard = require('../../models/mongoose/database-cards');

module.exports = async (ctx) => {
	ctx.body = await ctx.Cards.getAll();
	// const cards = new DBCard();
	// ctx.body = await cards.getAll();
};
