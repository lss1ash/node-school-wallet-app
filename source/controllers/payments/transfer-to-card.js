'use strict';

const Payment = require('./payment');
const ApplicationError = require('../../libs/application-error');

module.exports = async (ctx) => {
	// First part of operation: withdraw amount
	const request = ctx.request.body;
	request.cardId = +ctx.params.id;
	request.paymentType = 'card2Card_from';
	let responseFrom = {};

	// Second part of operation: fill up amount
	const requestTo = Object.assign({}, ctx.request.body);
	requestTo.cardId = +ctx.request.body.data;
	requestTo.data = ctx.params.id;
	requestTo.paymentType = 'card2Card_to';
	let responseTo = {};

	// Rollback part of operation
	const requestRollback = Object.assign({}, ctx.request.body);
	requestRollback.cardId = +ctx.params.id;
	requestRollback.paymentType = 'card2Card_to';
	requestRollback.data += ' - {ROLLBACK}';

	// Starts here
	const paymentFrom = new Payment(request, ctx.Cards, ctx.Transactions);
	responseFrom = await paymentFrom.process();

	if (responseFrom && responseFrom.status >= 200 && responseFrom.status < 300) {
		// Second part of operation: fill up amount
		const paymentTo = new Payment(requestTo, ctx.Cards, ctx.Transactions);
		responseTo = await paymentTo.process();

		// Rollback first part
		if (!responseTo || responseTo.status < 200 || responseTo.status >= 300) {
			const rollbackPayment = new Payment(requestRollback, ctx.Cards, ctx.Transactions);
			const rollbackResponse = await rollbackPayment.process();

			if (!rollbackResponse || rollbackResponse.status < 200 || rollbackResponse.status >= 300) {
				throw new ApplicationError(500, 'Rollback card2Card operation error!');
			}
		} else {
			ctx.status = responseTo.status;
			ctx.body = responseTo.body;
		}
	} else {
		ctx.status = responseFrom ? responseFrom.status : 500;
		ctx.body = responseFrom ? responseFrom.body : 'Operation failed';
	}
};
