import React from 'react';
import ReactDOM from 'react-dom';
import {hydrate} from 'emotion';
// import {hydrate as emotionHydrate} from 'emotion';
import {App} from '../../client/components';

// eslint-disable-next-line
const {ids, appData} = window.__data;

hydrate(ids);
ReactDOM.hydrate(<App data={appData} />, document.getElementById('root'));
