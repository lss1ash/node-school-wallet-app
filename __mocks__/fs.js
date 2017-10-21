'use strict';

const path = require('path');

const fs = jest.genMockFromModule('fs');

const CARDS = [
	{
		id: 1,
		cardNumber: '5469250000000001',
		balance: '8500'
	},
	{
		id: 2,
		cardNumber: '6762300000000002',
		balance: '1521'
	},
	{
		id: 3,
		cardNumber: '4058700000000003',
		balance: '3650.51'
	}
];

const TRANSACTIONS = [
	{
		cardId: 4,
		type: 'paymentMobile',
		data: '+79218908064',
		sum: '-50',
		id: 2,
		time: '2017-10-18T21:38:13+00:00'
	},
	{
		cardId: 4,
		type: 'card2Card',
		data: 3,
		sum: '-650',
		id: 3,
		time: '2017-10-19T00:40:32+03:00'
	},
	{
		cardId: 3,
		type: 'card2Card',
		data: '4',
		sum: '650',
		id: 4,
		time: '2017-10-19T00:40:32+03:00'
	},
	{
		cardId: 4,
		type: 'prepaidCard',
		data: '2424249999',
		sum: '123',
		id: 4,
		time: '2017-10-19T01:08:02+03:00'
	}
];

fs.readFile = (fileName, callback) => {
	let data = [{file: 'mocked'}];
	switch (path.basename(fileName)) {
		case 'cards.json': data = CARDS; break;
		case 'transactions.json': data = TRANSACTIONS; break;
		default:
	}

	callback(null, JSON.stringify(data, null, '  '));
};

fs.writeFile = (fileName, data, codepage, callback) => {
	callback();
};

module.exports = fs;
