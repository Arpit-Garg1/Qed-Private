import * as moment from 'moment';
import * as AppUtil from './AppUtil';



export const SERVER_DATE_FORMAT = 'YYYY-MM-DD';
export const GET_SERVER_DATE_FORMAT = 'DD/MM/YYYY';
export const GET_DISPLAY_DATE_FORMATE = 'DD-MMM-YYYY';
export const GET_RULES_DISPLAY_DATE_FORMAT = 'DD-MM-YYYY';

export const getStandardTime = (serverdatestr, serverformat, reqformat) => {
  return moment(moment(serverdatestr, serverformat).toDate()).format(reqformat);
  // return moment(moment.utc(serverdatestr, serverformat).toDate()).format(reqformat);
}

export const convertUtc = (date) => {
  const ts = moment(date).local();
  // console.log(ts);
  const time = ts.local().format('HH:mm');
  // console.log(time);
  // console.log(moment(date).utc().format('HH:mm'));
  // console.log(moment(date).utc(false).format('HH:mm'));
}

export const getStringDatefromJSON = (json, reqformat) => {
  return moment(moment(json).toISOString()).format(reqformat);
}

export const getStringDatefromDate = (date, dateFormat) => {
  if (date) {
    return moment(moment(date)).format(dateFormat);
  } else {
    return ''
  }
}

export const getServerDateFormat = (date) => {
  // tslint:disable-next-line: triple-equals
  if (date != null && date != undefined) {
    date = getDateAfterRemovingTime(date);
    return getStringDatefromDate(date, SERVER_DATE_FORMAT);
  } else {
  }

  // return d;
}

export const getDateAfterRemovingTime = (date) => {
  if (date != null && date !== undefined) {
    const dateString = getStringDatefromDate(date, 'YYYY-MM-DD');
    return getDatefromString(dateString, 'YYYY-MM-DD');
  }
  return date;
}

export const getDateValueAfterRemovingTime = (dateString) => {
  if (!AppUtil.isNullOrEmpty(dateString)) {
    const date = getDateAfterRemovingTime(new Date(dateString));
    return date;
  }
}

export const getInitationDateFormat = (date) => {
  return moment(moment(date)).format('D-MMM-YYYY');
}

export const getQedRulesDateFormat = (date) => {
  return moment(date).format('YYYY-MM-DD');
}

export const getTimeFormat = (date) => {
  // let d = moment(date).format('YYYY-MM-DDTHH:mm:ss.SSS');
  // let timeStamp = getDatefromString(d, 'YYYY-MM-DDTHH:mm:ss.SSS').getTime();
  if (AppUtil.isNotNull(date)) {
    const timeStamp = date.getTime();
    // console.log(timeStamp);
    return timeStamp + '';
  }
}

export const getDisplayDateFormat = (date) => {
  return getStringDatefromDate(date, GET_DISPLAY_DATE_FORMATE);
}

export const getRulesDisplayDateFormat = (date) => {
  return getStringDatefromDate(date, GET_RULES_DISPLAY_DATE_FORMAT);
};

export const getDisplayTimeFormat = (date) => {
  return getStringDatefromDate(date, 'hh:mm a');
}


export const getDatefromString = (datestring, format) => {
  return moment(datestring, format).toDate();
}

export const convertDateFormat = (datestring, currentFormat) => {
  const d = getDatefromString(datestring, currentFormat);
  return getDisplayDateFormat(d);
}

export const getDatefromMs = (milliseconds, reqdateformat) => {
  return moment(milliseconds).format(reqdateformat);
}

export const addMonthToDate = (date, numOfMonth) => {
  return moment(date).add(numOfMonth, 'months').toDate();
}

export const addDaysToDate = (date, numOfDays, dateFormat) => {
  if (dateFormat) {
    let newdate = moment(date).add(numOfDays, 'd').toDate();
    return moment(newdate).format(dateFormat);
  } else {
    return moment(date).add(numOfDays, 'd').toDate();
  }
}

export const removeDaysToDate = (date, numOfDays) => {
  return moment(date).subtract(numOfDays, 'd').toDate();
}

export const addMinutesToDate = (date, minutes) => {
  return moment(date).add(minutes, 'minutes').toDate();
}

export const removeMinutesFromDate = (date, minutes) => {
  return moment(date).subtract(minutes, 'minutes').toDate();
}

export const addYearsToDate = (d, years) => {
  return moment(d).add(years, 'year').toDate();
}

export const removeYearsToDate = (d, years) => {
  return moment(d).subtract(years, 'year').toDate();
}

export const isValid = (date) => {
  return moment(date).isValid();
}

export const getYear = (d, years) => {
  const date = moment(d).add(years, 'year').toDate();
  return moment(moment(date)).format('YYYY');
}

export const getDate = (dateString) => {
  let d = null;
  if (!AppUtil.isNullOrEmpty(dateString)) {
    d = new Date(dateString);
  }
  return getDateAfterRemovingTime(d);
}
export const getStringDateToMiliseonds = (dateString, currentFormat) => {
  return getDatefromString(dateString, currentFormat).getTime();
}



export const checkHoursDiffrenceBetweenTowMSDate = (date1, date2) => {
  const now = moment(new Date(msToTimeConversion(date1, 'DD-MMM-YYYY HH:mm')));
  const end = moment(new Date(msToTimeConversion(date2, 'DD-MMM-YYYY HH:mm')));
  return moment.duration(now.diff(end)).asHours();
}

export const msToTimeConversion = (msTime, format) => {
  return moment(msTime).format(format);
}

export const getTooltipDisplayDateFormat = (date) => {
  return getDisplayDateFormat(getDateAfterRemovingTime(date));
}


