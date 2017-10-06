'use strict';

const {file} = require('../../libs/');
const path = require('path');

module.exports = async (ctx) => {
	ctx.body = await file.read(path.join(__dirname, '../../views/client/index.html'));
};
