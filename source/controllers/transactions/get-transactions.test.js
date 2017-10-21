
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

test('get-transactions ALL must return array of 4 (mocked) and status 200', async () => {
	const response = await supertest(server)
		.get('/cards/all/transactions/')
		.set('Accept', 'application/json')
		.send();

	expect(response.statusCode).toBe(200);
	expect(response.body.length).toBe(4);
});

test('get-transactions id must return transaction and status 200', async () => {
	const response = await supertest(server)
		.get('/cards/3/transactions/')
		.set('Accept', 'application/json')
		.send();

	expect(response.statusCode).toBe(200);
	expect(response.body).toEqual(expect.arrayContaining([{
		cardId: 3,
		type: 'card2Card',
		data: '4',
		sum: '650',
		id: 4,
		time: '2017-10-19T00:40:32+03:00'
	}]));
});

test('get-transactions passes 404 if an invalid object sent', async () => {
	const response = await supertest(server)
		.get('/cards/888/transactions/')
		.set('Accept', 'application/json')
		.send();

	expect(response.statusCode).toBe(404);
});
