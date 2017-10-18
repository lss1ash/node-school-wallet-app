import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'emotion/react';
import {injectGlobal} from 'emotion';
import CardInfo from 'card-info';
import {
	CardsBar,
	Header,
	History,
	Prepaid,
	MobilePayment,
	Withdraw,
	getData
} from './';

import './fonts.css';

import cardsData from '../../datasource/cards';
import transactionsData from '../../datasource/transactions';

injectGlobal`
	html,
	body {
		margin: 0;
	}

	#root {
		height: 100%;
		font-family: 'Open Sans';
		color: #000;
	}
`;

const Wallet = styled.div`
	display: flex;
	min-height: 100%;
	background-color: #fcfcfc;
`;

const CardPane = styled.div`
	flex-grow: 1;
`;

const Workspace = styled.div`
	display: flex;
	flex-wrap: wrap;
	max-width: 970px;
	padding: 15px;
`;

/**
 * Приложение
 */
class App extends Component {
	/**
	 * Конструктор
	 */
	constructor() {
		super();

		// const cardsList = this.prepareCardsData(this.getAllCardsData());
		// const cardHistory = this.prepareTransactionsData(cardsList, this.getAllTransactionsData());

		const cardsList = this.prepareCardsData(cardsData);
		const cardHistory = this.prepareTransactionsData(cardsList, transactionsData);

		this.getAllCardsData();

		this.state = {
			cardsList,
			cardHistory,
			activeCardIndex: 0
		};
	}

	/**
	 * Подготавливает данные карт
	 *
	 * @param {Object} cardsData данные карт
	 * @returns {Object[]}
	 */
	prepareCardsData(cardsData) {
		return cardsData.map((card) => {
			const cardInfo = new CardInfo(card.cardNumber, {
				banksLogosPath: '/assets/',
				brandsLogosPath: '/assets/'
			});

			return {
				id: card.id,
				balance: card.balance,
				number: cardInfo.numberNice,
				bankName: cardInfo.bankName,
				theme: {
					bgColor: cardInfo.backgroundColor,
					textColor: cardInfo.textColor,
					bankLogoUrl: cardInfo.bankLogoSvg,
					brandLogoUrl: cardInfo.brandLogoSvg,
					bankSmLogoUrl: `/assets/${cardInfo.bankAlias}-history.svg`
				}
			};
		});
	}

	prepareTransactionsData(cardsList, transactionsData) {
		return transactionsData.map((data) => {
			const card = cardsList.find((card) => card.id === data.cardId);
			return card ? Object.assign({}, data, {card}) : data;
		});
	}

	/**
	 * Обработчик переключения карты
	 *
	 * @param {Number} activeCardIndex индекс выбранной карты
	 */
	onCardChange(activeCardIndex) {
		this.setState({activeCardIndex});
	}

	getAllCardsData() {
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
	}

	getAllTransactionsData() {
		// window.fetch(`/cards/all/transactions`, {
		// 	method: 'GET',
		// })
		// .then((response) => {
		// 	if (response.status === 200) {
		// 		let transactions = [];
		// 		response.json().then(body => transactions = body);
		// 		return transactions;
		// 	}
		// })
		// .catch((error) => {
		// 	console.log('OMG! Smthng went wrong!');
		// });
	}



	/**
	 * Рендер компонента
	 *
	 * @override
	 * @returns {JSX}
	 */
	render() {
		const {data} = this.props;
		const {cardsList, activeCardIndex, cardHistory} = this.state;
		const activeCard = cardsList[activeCardIndex];

		const inactiveCardsList = cardsList.filter((card, index) => (index === activeCardIndex ? false : card));
		const filteredHistory = cardHistory.filter((data) => data.cardId === activeCard.id);

		return (
			<Wallet>
				<CardsBar
					activeCardIndex={activeCardIndex}
					cardsList={cardsList}
					onCardChange={(activeCardIndex) => this.onCardChange(activeCardIndex)} />
				<CardPane>
					<Header activeCard={activeCard} user={data.user} />
					<Workspace>
						<History cardHistory={filteredHistory} />
						<Prepaid
							activeCard={activeCard}
							inactiveCardsList={inactiveCardsList}
							onCardChange={(newActiveCardIndex) => this.onCardChange(newActiveCardIndex)} />
						<MobilePayment activeCard={activeCard} />
						<Withdraw
							activeCard={activeCard}
							inactiveCardsList={inactiveCardsList} />
					</Workspace>
				</CardPane>
			</Wallet>
		);
	}
}

App.propTypes = {
	data: PropTypes.shape({
		user: PropTypes.object
	})
};

App.defaultProps = {
	data: {}
};

export default App;
