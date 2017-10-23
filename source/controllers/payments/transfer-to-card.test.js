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

test('transfer-to-card should return success code and last transaction', async () => {
	const request = {
		amount: '8500',
		data: 3
	};

	const response = await supertest(server)
		.post('/cards/1/transfer/')
		.set('Accept', 'application/json')
		.send(request);

	expect(response.statusCode).toBeGreaterThanOrEqual(200);
	expect(response.statusCode).toBeLessThan(300);

	expect(response.body).toHaveProperty('transaction');
	expect(response.body.transaction.sum).toEqual(request.amount);
	expect(response.body.transaction.cardId).toBe(request.data);
	expect(response.body.transaction.type).toBe('card2Card');
});

test('transfer-to-card should return 500 if invalid request passed', async () => {
	const request = {
		sasha: 'krut'
	};
	const response = await supertest(server)
		.post('/cards/1/transfer/')
		.set('Accept', 'application/json')
		.send(request);

	expect(response.statusCode).toBe(400);
});
