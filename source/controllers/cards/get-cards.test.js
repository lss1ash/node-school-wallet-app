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

test('get-cards passes 200 and an array of card objects', async () => {
	const response = await supertest(server)
		.get('/cards/')
		.set('Accept', 'application/json')
		.send();

	expect(response.statusCode).toBe(200);
	expect(response.body).toEqual(expect.arrayContaining([{
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
	}]));
});
