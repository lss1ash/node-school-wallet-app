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

const Cards = require('./cards');

const cards = new Cards();

describe('Cards model operations testing', () => {
	let returnedCards = null;

	test('constructor: _cards must be null first', async () => {
		// eslint-disable-next-line
		expect(cards._cards).toBeNull();
	});

	test('getAll: gets all the data from file', async () => {
		returnedCards = await cards.getAll();
		expect(returnedCards.length).toEqual(3);
	});

	test('getAll: returned value and ._cards are equal', () => {
		// eslint-disable-next-line
		expect(returnedCards).toEqual(cards._cards);
	});

	test('updateBalance: недостаточно средств на карте', async () => {
		expect(await cards.updateBalance(1, -12345))
			.toEqual({updated: false, message: 'Недостаточно средств на карте'});
	});

	test('updateBalance: id карты не найден', async () => {
		expect(await cards.updateBalance(123, 1)).toBeFalsy();
	});

	test('updateBalance: successful', async () => {
		expect(await cards.updateBalance(1, -500))
			.toEqual({updated: true, message: 'Успешное обновление баланса карты'});
		// eslint-disable-next-line
		expect(cards._cards[0].balance.toString()).toBe('8000');
	});

	test('create: create a new card', async () => {
		const cardObj = {
			cardNumber: '1234567890111213',
			balance: '123.45'
		};

		// eslint-disable-next-line
		const newId = cards._cards.length + 1;
		const result = await cards.create(cardObj);
		cardObj.id = newId;

		expect(result).toEqual(cardObj);
		// eslint-disable-next-line
		expect(cards._cards.length).toBe(4);
	});

	test('create: некорректные данные карты на входе', async () => {
		expect(await cards.create({})).toBeNull();
		expect(await cards.create({cardNumber: '1234567890'})).toBeNull();
		expect(await cards.create({balance: '12345'})).toBeNull();
	});

	// ====
	// remove method should appear soon
	// ====

	test('getExistent: по номеру карты проверяем существование', () => {
		// eslint-disable-next-line
		expect(cards.getExistent({cardNumber: '5469250000000001'})).toEqual(cards._cards[0]);
		expect(cards.getExistent({cardNumber: '12345678900987654321'})).toBeFalsy();
		expect(cards.getExistent()).toBeFalsy();
	});

	test('existsId: по id карты проверяем существование', () => {
		// eslint-disable-next-line
		expect(cards.existsId(1)).toBeTruthy();
		expect(cards.existsId(999)).toBeFalsy();
		expect(cards.existsId()).toBeFalsy();
	});
});
