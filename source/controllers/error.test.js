'use strict';

const errorModule = require('./error');

test('should throw an error', () => {
	expect(errorModule).toThrowError();
});
