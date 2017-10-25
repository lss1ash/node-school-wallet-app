'use strict';

const fs = require('fs');
const path = require('path');
const ssr = require('../../views/server/bundle');

module.exports = async (ctx) => {
	const cards = await ctx.Cards.getAll();
	const transactions = await ctx.Transactions.getAll();
	// как-то пробрасывать не все транзакции?
	// только для первой карты в списке?

	const template = fs.readFileSync(path.join(__dirname, '../../views/client/index.html'), 'utf-8');
	const {html, css, data} = ssr(cards, transactions);

	ctx.body = template
		.replace('{{html}}', html)
		.replace('{{css}}', css)
		.replace('{{appData}}', data);
};
