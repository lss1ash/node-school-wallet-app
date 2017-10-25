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

test('create-card should response with 201 and created card', async () => {
	const response = await supertest(server)
		.post('/cards/')
		.set('Accept', 'application/json')
		.send({cardNumber: '1234567890123456', balance: '555'});

	expect(response.statusCode).toBe(201);
	expect(response.body).toEqual(expect.objectContaining({cardNumber: '1234567890123456', balance: '555'}));
});

test('create-card should response with 400 if the card is not valid', async () => {
	const response = await supertest(server)
		.post('/cards/')
		.set('Accept', 'application/json')
		.send();

	expect(response.statusCode).toBe(400);
	expect(response.body).toEqual(expect.anything());
});
