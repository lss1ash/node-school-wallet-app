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

test('create-transaction passes 201 and a transaction object in case of success', async () => {
	const response = await supertest(server)
		.post('/cards/1/transactions/')
		.set('Accept', 'application/json')
		.send({
			type: 'card2Card',
			data: '4276 1234 9090 5544',
			sum: '-3399',
		});

	expect(response.statusCode).toBe(201);
});

test('create-transaction passes 400 if an invalid object sent', async () => {
	const response = await supertest(server)
		.post('/cards/888/transactions/')
		.set('Accept', 'application/json')
		.send({});

	expect(response.statusCode).toBe(400);
});

test('create-transaction passes 400 if no object sent', async () => {
	const response = await supertest(server)
		.post('/cards/888/transactions/')
		.set('Accept', 'application/json')
		.send();

	expect(response.statusCode).toBe(400);
});
