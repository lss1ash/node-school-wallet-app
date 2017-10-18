import React, {Component} from 'react';
import axios from 'axios';
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
	Withdraw
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

		const cardsList = this.prepareCardsData(cardsData);
		const cardHistory = this.prepareTransactionsData(cardsList, transactionsData);

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

	getAllCardsData() {
		return axios.get('/cards/');
	}

	getAllTransactionsData() {
		return axios.get('/cards/all/transactions');
	}

	getAllBankingData() {
		axios.all([this.getAllCardsData(), this.getAllTransactionsData()])
		  .then(axios.spread((cards, transactions) => {
				const cardsList = this.prepareCardsData(cards.data);
				const cardHistory = this.prepareTransactionsData(cardsList, transactions.data);
				this.setState({cardsList, cardHistory});
		  }))
			.catch(error => {
				console.error('Не удалось загрузить данные с сервера:', error.message);
			});
	}

	/**
	 * Обработчик переключения карты
	 *
	 * @param {Number} activeCardIndex индекс выбранной карты
	 */
	onCardChange(activeCardIndex) {
		this.setState({activeCardIndex});
		// this.getAllBankingData();
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
						<History
							cardHistory={filteredHistory}
							cardsList={cardsList} />
						<Prepaid
							activeCard={activeCard}
							inactiveCardsList={inactiveCardsList}
							onSuccess={() => this.getAllBankingData()}
							onCardChange={(newActiveCardIndex) => this.onCardChange(newActiveCardIndex)} />
						<MobilePayment
							activeCard={activeCard}
							onSuccess={() => this.getAllBankingData()}/>
						<Withdraw
							activeCard={activeCard}
							inactiveCardsList={inactiveCardsList}
							onSuccess={() => this.getAllBankingData()} />
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
