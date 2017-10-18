import React from 'react';
import styled from 'emotion/react';
import PropTypes from 'prop-types';

import {Island, Title} from './';

const PrepaidLayout = styled(Island)`
	width: 440px;
	display: flex;
	flex-direction: column;
	background-color: #FF3B3F;
	position: relative;
	color: #fff;
`;

const CheckIcom = styled.div`
	width: 48px;
	height: 48px;
	background-image: url(/assets/round-check.svg);
	position: absolute;
	top: 14;
	right: 20;
`;

const Header = styled(Title)`
	color: #fff;
`;

const SectionGroup = styled.div`
	margin-bottom: 20px;
`;

const Section = styled.div`
	margin-bottom: 20px;
	width: 100%;
`;

const SectionLabel = styled.div`
	font-size: 13px;
	text-align: left;
`;

const SectionValue = styled.div`
	font-size: 13px;
	letter-spacing: 0.6px;
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

const PrepaidSuccess = ({response, repeatPayment}) => {
	const {status, message} = response;

	return (
		<PrepaidLayout>
			<CheckIcom />
			<SectionGroup>
				<Header>Ошибка пополнения карты {status}</Header>
				<Section>
					<SectionLabel>{message}</SectionLabel>
				</Section>
			</SectionGroup>
			<RepeatPayment onClick={repeatPayment}>Отправить еще один перевод</RepeatPayment>
		</PrepaidLayout>
	);
};

PrepaidSuccess.propTypes = {
	response: PropTypes.shape({
		status: PropTypes.number,
		message: PropTypes.string
	}).isRequired,
	repeatPayment: PropTypes.func.isRequired
};

export default PrepaidSuccess;
