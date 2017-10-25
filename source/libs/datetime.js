'use strict';

// format: 2017-08-9T05:28:31+03:00 (.length must be 25)
const datetime = {
	get() {
		const now = new Date();
		const YYYY = now.getFullYear();
		let MM = now.getMonth() + 1;
		let DD = now.getDate();
		let HH = now.getHours();
		let MI = now.getMinutes();
		let SS = now.getSeconds();
		MM = MM < 10 ? `0${MM}` : MM;
		DD = DD < 10 ? `0${DD}` : DD;
		HH = HH < 10 ? `0${HH}` : HH;
		MI = MI < 10 ? `0${MI}` : MI;
		SS = SS < 10 ? `0${SS}` : SS;

		// Timezone
		let TZ = -now.getTimezoneOffset() / 60;
		const sign = TZ < 0 ? '-' : '+';
		TZ = Math.abs(TZ);
		let TZ_HH = Math.floor(TZ);
		let TZ_MM = (TZ - TZ_HH) * 60;
		TZ_HH = TZ_HH < 10 ? `0${TZ_HH}` : TZ_HH;
		TZ_MM = TZ_MM < 10 ? `0${TZ_MM}` : TZ_MM;

		return `${YYYY}-${MM}-${DD}T${HH}:${MI}:${SS}${sign}${TZ_HH}:${TZ_MM}`;
	}
};

module.exports = datetime;
