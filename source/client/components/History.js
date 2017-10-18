import React from 'react';
import PropTypes from 'prop-types';
import styled from 'emotion/react';
import moment from 'moment';

import {Island} from './';

const HistoryLayout = styled(Island)`
	max-height: 440px;
	overflow-y: scroll;
	padding: 0;
	background-color: rgba(0, 0, 0, 0.05);

	width: 440px;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const HistoryTitle = styled.div`
	padding-left: 12px;
	color: rgba(0, 0, 0, 0.4);
	font-size: 15px;
	line-height: 30px;
	text-transform: uppercase;
`;

const HistoryItem = styled.div`
	display: flex;
	justify-content: space-around;
	align-items: center;
	height: 70px;
	font-size: 14px;
	white-space: nowrap;

	&:nth-child(even) {
		background-color: #fff;
	}

	&:nth-child(odd) {
		background-color: rgba(255, 255, 255, 0.72);
	}
`;

const HistoryItemIcon = styled.div`
	width: 30px;
	height: 30px;
	border-radius: 25px;
	margin: 0 5px;
	background-color: #159761;
	background-image: url(${({bankSmLogoUrl}) => bankSmLogoUrl});
	background-size: contain;
	background-repeat: no-repeat;
`;

const HistoryItemTitle = styled.div`
	width: 250px;
	overflow: hidden;
	text-overflow: ellipsis;
`;

const HistoryItemTime = styled.div`
	width: 50px;
`;

const HistoryItemSum = styled.div`
	width: 50px;
	overflow: hidden;
	text-overflow: ellipsis;
`;

const History = ({cardHistory, cardsList}) => {
	const getHistoryItemTitle = (item) => {
		let typeTitle = '';

		switch (item.type) {
			case 'paymentMobile': {
				typeTitle = 'Оплата телефона';
				break;
			}
			case 'prepaidCard': {
				typeTitle = 'Пополнение с кошелька';
				break;
			}
			case 'card2Card': {
				typeTitle = 'Перевод с карты на карту';
				break;
			}
			default: {
				typeTitle = 'Операция';
			}
		}

		return `${typeTitle}`;
	};

	const getHistoryAdditionalInfo = (item) => {
		if (item.type === 'card2Card') {
				const correspondingCard = cardsList.find(card => card.id.toString() === item.data.toString());
				return correspondingCard ? correspondingCard.number : undefined;
		}
		return item.data;
	};

	return (
		<HistoryLayout>
			<HistoryTitle>Сегодня</HistoryTitle>
			{cardHistory.map((item, index) => {
				const historyItemDate = moment(item.time, moment.ISO_8601);
				const today = moment().format('L');
				const isTodayHistoryItem = historyItemDate.format('L') === today;

				if (!isTodayHistoryItem) {
					return '';
				}

				return (
					<HistoryItem key={index}>
						<HistoryItemIcon bankSmLogoUrl={item.card.theme.bankSmLogoUrl} />
						<HistoryItemTitle>
							{getHistoryItemTitle(item)}
							<HistoryItemTitle>
								{getHistoryAdditionalInfo(item)}
							</HistoryItemTitle>
						</HistoryItemTitle>
						<HistoryItemTime>
							{historyItemDate.format('HH:mm')}
						</HistoryItemTime>
						<HistoryItemSum>
							{`${item.sum} ₽`}
						</HistoryItemSum>
					</HistoryItem>
				);
			})}
		</HistoryLayout>
	);
};

History.propTypes = {
	cardHistory: PropTypes.arrayOf(PropTypes.object).isRequired,
	cardsList: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default History;
