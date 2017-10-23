
'use strict';

jest.mock('fs');

// eslint-disable-next-line
const mockLogger = () => {
	return {log() {}};
};

// eslint-disable-next-line
jest.mock('../../libs/logger', () => {
	return jest.fn(mockLogger);
});

const supertest = require('supertest');
const app = require('../../app.js');

let server = null;

beforeAll(() => {
	server = app.listen();
});
afterAll(() => server.close());

test('pay-mobile should create a pay payment for a card', async () => {
	const request = {
		amount: '0.55',
		data: '8-800-1122-332'
	};
	const response = await supertest(server)
		.post('/cards/1/pay/')
		.set('Accept', 'application/json')
		.send(request);

	expect(response.statusCode).toBe(201);
	expect(response.body).toHaveProperty('transaction');
	expect(response.body.transaction.sum).toEqual((-request.amount).toString());
	expect(response.body.transaction.cardId).toBe(1);
	expect(response.body.transaction.type).toBe('paymentMobile');
});

test('pay-mobile returns 400 if invalid request passed', async () => {
	const request = {
		data: '8-800-1122-332'
	};
	const response = await supertest(server)
		.post('/cards/1/pay/')
		.set('Accept', 'application/json')
		.send(request);

	expect(response.statusCode).toBe(400);
});
