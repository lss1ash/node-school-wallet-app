'use strict';

const Payment = require('./payment');

module.exports = async (ctx) => {
	const request = ctx.request.body;
	request.cardId = +ctx.params.id;
	request.paymentType = 'prepaidCard';

	const payment = new Payment(request, ctx.Cards, ctx.Transactions);
	const response = await payment.process();
	ctx.status = response.status;
	ctx.body = response.body;
};
