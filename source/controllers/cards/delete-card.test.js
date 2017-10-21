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

test('delete-card should response with 200 if correct id is passed', async () => {
	const response = await supertest(server)
		.delete('/cards/1')
		.set('Accept', 'application/json')
		.send();

	expect(response.statusCode).toBe(200);
});

test('delete-card should response with 400 if id is invalid', async () => {
	const response = await supertest(server)
		.delete('/cards/6')
		.set('Accept', 'application/json')
		.send();

	expect(response.statusCode).toBe(400);
});
