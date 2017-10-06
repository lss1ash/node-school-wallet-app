'use strict';

// const file = require('../../libs/file');
const fs = require('fs');
const path = require('path');

module.exports = (ctx) => {
	ctx.body = fs.readFileSync(path.join(__dirname, '../../views/client/index.html'), 'utf-8');
};
