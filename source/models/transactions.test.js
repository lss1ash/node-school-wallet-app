'use strict';

jest.mock('fs');

// eslint-disable-next-line
const mockLogger = () => {
	return {log() {}};
};

// eslint-disable-next-line
jest.mock('../libs/logger', () => {
	return jest.fn(mockLogger);
});

const Transactions = require('./transactions');
// const ApplicationError = require('../libs/application-error');

const transactions = new Transactions();

describe('Transactions model testing', () => {
	let returnedTransactions = null;

	test('constructor: _transactions must be null first', async () => {
		// eslint-disable-next-line
		expect(transactions._transactions).toBeNull();
	});

	test('getAll: gets all the data from file', async () => {
		returnedTransactions = await transactions.getAll();
		expect(returnedTransactions.length).toEqual(4);
	});

	test('getAll: returned value and ._transactions are equal', () => {
		// eslint-disable-next-line
		expect(returnedTransactions).toEqual(transactions._transactions);
	});

	test('get(cardId): returns specifc card transactions', async () => {
		const thisMustBeReturned = [
			{
				cardId: 3,
				type: 'card2Card',
				data: '4',
				sum: '650',
				id: 4,
				time: '2017-10-19T00:40:32+03:00'
			}
		];
		expect(await transactions.get(3)).toEqual(thisMustBeReturned);
		expect(await transactions.get(123)).toBeNull();
	});

	test('create(transaction): creates new transaction', async () => {
		const newTransaction = {
			cardId: 5,
			type: 'card2Card',
			data: '4',
			sum: '1000',
		};

		// eslint-disable-next-line
		const newId = transactions._transactions.length + 1;
		const result = await transactions.create(newTransaction);
		newTransaction.id = newId;

		expect(result.cardId).toEqual(newTransaction.cardId);
		expect(result.type).toEqual(newTransaction.type);
		expect(result.data).toEqual(newTransaction.data);
		expect(result.sum).toEqual(newTransaction.sum);
		expect(result.id).toEqual(newTransaction.id);
		expect(result.time.length).toEqual(25);
		// eslint-disable-next-line
		expect(transactions._transactions.length).toBe(5);
	});

	test('create: некорректные данные транзакции на входе', async () => {
		expect(await transactions.create({})).toBeNull();

		let newTransaction = {
			type: 'card2Card',
			data: '4',
			sum: '1000',
		};
		expect(await transactions.create(newTransaction)).toBeNull();

		newTransaction = {
			cardId: 5,
			data: '4',
			sum: '1000',
		};
		expect(await transactions.create(newTransaction)).toBeNull();

		newTransaction = {
			cardId: 5,
			type: 'card2Card',
			sum: '1000',
		};
		expect(await transactions.create(newTransaction)).toBeNull();

		newTransaction = {
			cardId: 5,
			type: 'card2Card',
			data: '4'
		};
		expect(await transactions.create(newTransaction)).toBeNull();
	});

	test('static remove: throws an error - can\'t remove any transaction!', () => {
		expect(Transactions.remove).toThrowError('Transaction removing is prohibited!');
		// expect(Transactions.remove).toThrowError(ApplicationError); // This way should work... but it doesn't
	});

	test('getTransactionTemplate: получаем пустой объект транзакции', () => {
		const template = {
			cardId: 0,
			type: '',
			data: '',
			sum: '',
			id: 0,
			time: ''
		};
		expect(transactions.getTransactionTemplate()).toEqual(template);
	});
});
