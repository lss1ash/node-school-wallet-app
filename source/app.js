'use strict';

const https = require('https');
const fs = require('fs');

const Koa = require('koa');
const serve = require('koa-static');
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser')();
const logger = require('./libs/logger')('wallet-app');

const mongoose = require('mongoose');

const getAppController = require('./controllers/app/get-root');
const getCardsController = require('./controllers/cards/get-cards');
const createCardController = require('./controllers/cards/create-card');
const deleteCardController = require('./controllers/cards/delete-card');
const errorController = require('./controllers/error');

const mobilePaymentController = require('./controllers/payments/pay-mobile');
const fillCardController = require('./controllers/payments/fill-card');
const card2CardController = require('./controllers/payments/transfer-to-card');

const getTransactionsController = require('./controllers/transactions/get-transactions');
const createTransactionController = require('./controllers/transactions/create-transaction');

const Cards = require('./models/cards');
const Transactions = require('./models/transactions');

const ApplicationError = require('./libs/application-error');

const app = new Koa();

// Сохраним параметр id в ctx.params.id
router.param('id', (id, ctx, next) => next());

router.get('/', getAppController);

router.get('/cards/', getCardsController);
router.post('/cards/', createCardController);
router.delete('/cards/:id', deleteCardController);

router.post('/cards/:id/pay', mobilePaymentController);
router.post('/cards/:id/fill', fillCardController);
router.post('/cards/:id/transfer', card2CardController);

router.get('/cards/:id/transactions', getTransactionsController);
router.post('/cards/:id/transactions', createTransactionController);

router.all('/error', errorController);

mongoose.connect('mongodb://localhost/wallet-app', {useMongoClient: true});
mongoose.Promise = global.Promise;

// logger
app.use(async (ctx, next) => {
	const start = new Date();
	await next();
	const ms = new Date() - start;
	logger.log('info', `${ctx.method} ${ctx.url} - ${ms}ms`);
});

// error handler
app.use(async (ctx, next) => {
	try {
		await next();
	} catch (err) {
		logger.log('error', 'Error detected', err);
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

// Создадим модель Transactions на уровне приложения и проинициализируем ее
app.use(async (ctx, next) => {
	ctx.Transactions = new Transactions();
	await ctx.Transactions.getAll();
	await next();
});

app.use(bodyParser);
app.use(router.routes());
app.use(serve('./public'));

if (!module.parent) {
	const options = {
		key: fs.readFileSync('ssl/key.pem'),
		cert: fs.readFileSync('ssl/cert.pem')
	};
	https.createServer(options, app.callback()).listen(3000, () => {
		logger.log('info', 'Application started');
	});
}

module.exports = app;
