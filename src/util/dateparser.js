const day_ms = 1000 * 60 * 60 * 24;
const td_tokyo = 1000 * 60 * 60 * 9;

export function unixtime2date(unixtime, isUTC){
	return Math.floor((unixtime + (isUTC ? 0 : td_tokyo)) / day_ms);
}
export function getTodayDate(){
	return unixtime2date(Date.now());
}
if(DEBUG) console.log("dateparser.getTodayDate():", getTodayDate());

export function getRelativeDateState(exp, now){
	if(!now)now = getTodayDate();
	const relativeDay = exp - now;
	const relativeDayAbs = Math.abs(relativeDay);
	if(relativeDay < 0){
		return relativeDayAbs + "日前";
	}
	return relativeDayAbs + "日後";
}
export function getRelativeDateState_markcolor(exp, now){
	if(!now)now = getTodayDate();
	const relativeDayAbs = Math.abs(now - exp);
	if(relativeDayAbs <= 1)return "#f00";
	if(relativeDayAbs <= 3)return "#f60";
	//return "#00f";
}
export function getAbsoluteDateState(exp, options){
	if(options === void 0)options = {};
	if(typeof options !== "object")options = {connector: options};
	const date = new Date(exp * day_ms);
	const ymd = [
		date.getUTCFullYear(),
		("0" + (date.getUTCMonth() + 1)).slice(-2),
		("0" + date.getUTCDate()).slice(-2),
	];
	let result = ymd.join(options.connector ? options.connector : "/");
	if(options.addDay){
		result += `(${"日月火水木金土"[date.getUTCDay()]})`;
	}
	return result;
}
