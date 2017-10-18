import React from 'react';
import PropTypes from 'prop-types';
import styled from 'emotion/react';

const getData = () => {
	fetch(`/cards/`, {
		method: 'GET',
	})
	.then((response) => {
		if (response.status === 200) {
			// let cards = [];
			response.json().then(body => body);
			// return cards;
			// response.json().then(cardsData => this.setState({cardsList: this.prepareCardsData(cardsData)}));
		}
	})
	.catch((error) => {
		console.log('OMG! Smthng went wrong!');
	});
};


export default getData;
