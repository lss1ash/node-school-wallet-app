import React, {Component} from 'react';
import PropTypes from 'prop-types';

import MobilePaymentContract from './MobilePaymentContract';
import MobilePaymentSuccess from './MobilePaymentSuccess';
import MobilePaymentReject from './MobilePaymentReject';

/**
 * Класс компонента MobilePayment
 */
class MobilePayment extends Component {
	/**
	 * Конструктор
	 * @param {Object} props свойства компонента MobilePayment
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
		this.props.onSuccess();
	}

	/**
	 * Обработка неуспешного платежа
	 * @param {Object} response данные об ответе
	 */
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
	 * Рендер компонента
	 *
	 * @override
	 * @returns {JSX}
	 */
	render() {
		const {activeCard} = this.props;

		if (this.state.stage === 'success') {
			return (
				<MobilePaymentSuccess
					activeCard={activeCard}
					transaction={this.state.transaction}
					repeatPayment={() => this.repeatPayment()} />
			);
		}

		if (this.state.stage === 'reject') {
			return (
				<MobilePaymentReject
					activeCard={activeCard}
					response={this.state.response}
					repeatPayment={() => this.repeatPayment()} />
			);
		}

		return (
			<MobilePaymentContract
				activeCard={activeCard}
				onPaymentSuccess={(transaction) => this.onPaymentSuccess(transaction)}
				onPaymentReject={(response) => this.onPaymentReject(response)} />
		);
	}
}

MobilePayment.propTypes = {
	activeCard: PropTypes.shape({
		id: PropTypes.number,
		theme: PropTypes.object
	}).isRequired,
	onSuccess: PropTypes.func.isRequired
};

export default MobilePayment;
