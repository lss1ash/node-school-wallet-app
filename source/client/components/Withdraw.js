import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'emotion/react';

import WithdrawContract from './WithdrawContract';
import WithdrawSuccess from './WithdrawSuccess';
import WithdrawReject from './WithdrawReject';

/**
 * Класс компонента Withdraw
 */
class Withdraw extends Component {
	/**
	 * Конструктор
	 * @param {Object} props свойства компонента Withdraw
	 */
	constructor(props) {
		super(props);

		this.state = {stage: 'contract'};
	}

	/**
	 * Обработка успешного платежа
	 * @param {Object} transaction данные о транзакции
	 */
	onPaymentSuccess(transaction) {
		this.setState({
			stage: 'success',
			transaction
		});
	}

	onPaymentReject(response) {
		this.setState({
			stage: 'reject',
			response
		});
	}

	/**
	 * Повторить платеж
	 */
	repeatPayment() {
		this.setState({stage: 'contract'});
	}

	/**
	 * Функция отрисовки компонента
	 * @returns {JSX}
	 */
	render() {
		const {transaction} = this.state;
		const {activeCard, inactiveCardsList} = this.props;

		if (this.state.stage === 'success') {
			return (
				<WithdrawSuccess transaction={this.state.transaction} repeatPayment={() => this.repeatPayment()} />
			);
		}

		if (this.state.stage === 'reject') {
			return (
				<WithdrawReject response={this.state.response} repeatPayment={() => this.repeatPayment()} />
			);
		}

		return (
			<WithdrawContract
				activeCard={activeCard}
				inactiveCardsList={inactiveCardsList}
				onPaymentSuccess={(transaction) => this.onPaymentSuccess(transaction)}
				onPaymentReject={(response) => this.onPaymentReject(response)} />
		);
	}
}

Withdraw.propTypes = {
	activeCard: PropTypes.shape({
		id: PropTypes.number,
		theme: PropTypes.object
	}).isRequired,
	inactiveCardsList: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default Withdraw;
