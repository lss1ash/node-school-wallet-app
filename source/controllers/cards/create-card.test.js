'use strict';

jest.mock('fs');

const supertest = require('supertest');
const app = require('../../app.js');

test('create-card should response with 201 and created card', async () => {
	const server = app.listen();
	const response = await supertest(server)
		.post('/cards/')
		.set('Accept', 'application/json')
		.send({cardNumber: '1234567890123456', balance: '555'});
	server.close();

	expect(response.statusCode).toBe(201);
	expect(response.body).objectContaining({cardNumber: '1234567890123456', balance: '555'});
});
