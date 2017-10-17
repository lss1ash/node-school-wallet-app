import React from 'react';
import styled from 'emotion/react';
import PropTypes from 'prop-types';

import {Island} from './';

const WithdrawLayout = styled(Island)`
	width: 440px;
	background: #FF3B3F;
	position: relative;
	color: #fff;
`;

const CancelIcon = styled.div`
	width: 48px;
	height: 48px;
	background-image: url(/assets/round-cancel.svg);
	position: absolute;
	top: 27;
	right: 32;
`;

const Header = styled.div`
	font-size: 24px;
`;

const Instruction = styled.div`
	margin-bottom: 40px;
	font-size: 15px;
	top: 40%;
	position: absolute;
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

const WithdrawReject = ({response, repeatPayment}) => {
	const {status, message} = response;

	return (
		<WithdrawLayout>
			<Header>Не удалось выполнить перевод с карты на карту</Header>
			<Instruction>
				{message}
			</Instruction>
			<RepeatPayment onClick={repeatPayment}>Попробовать снова</RepeatPayment>
		</WithdrawLayout>
	);
};

WithdrawReject.propTypes = {
	response: PropTypes.shape({
		status: PropTypes.number,
		message: PropTypes.string
	}).isRequired,
	repeatPayment: PropTypes.func.isRequired
};

export default WithdrawReject;
