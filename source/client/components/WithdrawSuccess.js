import React from 'react';
import styled from 'emotion/react';
import PropTypes from 'prop-types';

import {Island} from './';

const WithdrawLayout = styled(Island)`
	width: 440px;
	background: #4ABDAC;
	position: relative;
	color: #fff;
`;

const SuccessIcon = styled.div`
	width: 48px;
	height: 48px;
	background-image: url(/assets/round-check.svg);
	position: absolute;
	top: 27;
	right: 32;
`;

const Header = styled.div`
	font-size: 24px;
`;

const Sum = styled.div`
	font-size: 48px;
`;

const Section = styled.div`
	position: relative;
	padding-left: 160px;
	margin-bottom: 20px;
`;

const SectionLabel = styled.div`
	font-size: 15px;
	position: absolute;
	left: 0px;
`;

const SectionValue = styled.div`
	font-size: 15px;
`;

const Instruction = styled.div`
	margin-bottom: 40px;
	font-size: 15px;
`;

const RepeatPayment = styled.button`
	font-size: 13px;
	background-color: rgba(0, 0, 0, 0.08);
	height: 42px;
	display: flex;
	justify-content: center;
	align-items: center;
	border: none;
	width: 100%;
	position: absolute;
	left: 0;
	bottom: 0;
	cursor: pointer;
	text-transform: uppercase;
`;

const WithdrawSuccess = ({transaction, repeatPayment}) => {
	const {sum, cardNumber, transactionNumber} = transaction;


	return (
		<WithdrawLayout>
			<SuccessIcon />
			<Header>Перевод выполнен</Header>
			<Sum>{sum} ₽</Sum>
			<Section>
				<SectionLabel>Номер транзакции</SectionLabel>
				<SectionValue>{transactionNumber}</SectionValue>
			</Section>
			<Section>
				<SectionLabel>Карта получателя</SectionLabel>
				<SectionValue>{cardNumber}</SectionValue>
			</Section>
			<Instruction>
				Мы пришлем чек на sam@yandex.ru. Вы можете изменить email в «Настройках».
			</Instruction>
			<RepeatPayment onClick={repeatPayment}>Выполнить ещё один перевод</RepeatPayment>
		</WithdrawLayout>
	);
};

WithdrawSuccess.propTypes = {
	transaction: PropTypes.shape({
		sum: PropTypes.number,
		cardNumber: PropTypes.string,
		transactionNumber: PropTypes.string
	}).isRequired,
	repeatPayment: PropTypes.func.isRequired
};

export default WithdrawSuccess;
