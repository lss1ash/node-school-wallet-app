'use strict';

const fs = require('fs');
const path = require('path');
const ssr = require('../../views/server/bundle');

module.exports = (ctx) => {
	const template = fs.readFileSync(path.join(__dirname, '../../views/client/index.html'), 'utf-8');
	const {html, css, data} = ssr();
	ctx.body = template
		.replace('{{html}}', html)
		.replace('{{css}}', css)
		.replace('{{appData}}', data);
};
