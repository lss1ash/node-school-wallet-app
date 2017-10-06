import React from 'react';
import ReactDOM from 'react-dom/server';
// import {hydrate as emotionHydrate} from 'emotion';
import {App} from '../../client/components';

// const {ids, appData} = window.__data;

// emotionHydrate(ids);
// reactHydrate(<App data={appData} />, document.getElementById('root'));

ReactDOM.render(<App />, document.getElementById('root'));
