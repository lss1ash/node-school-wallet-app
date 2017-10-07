import React from 'react';
import {renderToString} from 'react-dom/server';
import {extractCritical} from 'emotion-server';
import serialize from 'serialize-javascript';
import {App} from '../../client/components';

const appData = {
	user: {
		login: 'samuel_johnson',
		name: 'Samuel Johnson'
	}
};

module.exports = () => {
	const app = renderToString(<App data={appData} />);
	const {html, ids, css} = extractCritical(app);
	const data = serialize({ids, appData});

	return {
		html, css, data
	};
};
