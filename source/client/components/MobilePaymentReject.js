import React from 'react';
import styled from 'emotion/react';
import PropTypes from 'prop-types';

import {Island} from './';

const MobilePaymentLayout = styled(Island)`
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

// const Sum = styled.div`
// 	font-size: 48px;
// `;
//
// const CommissionTips = styled.div`
// 	font-size: 13px;
// 	opacity: 0.6;
// 	margin-bottom: 20px;
// `;
//
// const Section = styled.div`
// 	position: relative;
// 	padding-left: 160px;
// 	margin-bottom: 20px;
// `;
//
// const SectionLabel = styled.div`
// 	font-size: 15px;
// 	position: absolute;
// 	left: 0px;
// `;
//
// const SectionValue = styled.div`
// 	font-size: 15px;
// `;

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

const MobilePaymentReject = ({response, repeatPayment}) => {
	const {status, message} = response;

	return (
		<MobilePaymentLayout>
			<Header>Не удалось оплатить мобильный телефон</Header>
			<Instruction>
				{message}
			</Instruction>
			<RepeatPayment onClick={repeatPayment}>Попробовать снова</RepeatPayment>
		</MobilePaymentLayout>
	);
};

MobilePaymentReject.propTypes = {
	response: PropTypes.shape({
		status: PropTypes.number,
		message: PropTypes.string
	}).isRequired,
	repeatPayment: PropTypes.func.isRequired
};

export default MobilePaymentReject;
