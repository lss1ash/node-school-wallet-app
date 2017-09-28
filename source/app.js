'use strict';

const Koa = require('koa');
const serve = require('koa-static');
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser')();

const getCardsController = require('./controllers/get-cards');
const createCardController = require('./controllers/create-card');
const deleteCardController = require('./controllers/delete-card');
const errorController = require('./controllers/error');

const getTransactionsController = require('./controllers/get-transactions');
const createTransactionController = require('./controllers/create-transaction');

const Cards = require('./models/cards');
const Transactions = require('./models/transactions');

const app = new Koa();

// Сохраним параметр id в ctx.params.id
router.param('id', (id, ctx, next) => next());

router.get('/cards/', getCardsController);
router.post('/cards/', createCardController);
router.delete('/cards/:id', deleteCardController);

router.get('/cards/:id/transactions', getTransactionsController);
router.post('/cards/:id/transactions', createTransactionController);

router.all('/error', errorController);

// logger
app.use(async function(ctx, next) {
	const start = new Date();
	await next();
	const ms = new Date() - start;
	console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// error handler
app.use(async (ctx, next) => {
	try {
		await next();
	} catch (err) {
		console.log('Error detected', err);
		ctx.status = err instanceof ApplicationError ? err.status : 500;
		ctx.body = `Error [${err.message}] :(`;
	}
});

// Создадим модель Cards на уровне приложения и проинициализируем ее
app.use(async (ctx, next) => {
	ctx.Cards = new Cards();
	await ctx.Cards.getAll();
	await next();
});

// Создадим модель Cards на уровне приложения и проинициализируем ее
app.use(async (ctx, next) => {
	ctx.Transactions = new Transactions();
	await ctx.Transactions.getAll();
	await next();
});

app.use(bodyParser);
app.use(router.routes());
app.use(serve('./public'));

app.listen(3000, () => {
	console.log('Application started');
});
