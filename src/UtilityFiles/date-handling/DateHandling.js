// can be used for handling date types 
import moment from 'moment';
import { isStringValue } from '../data-handling/DataHandling';

export const GET_DISPLAY_DATE_FORMAT = 'DD-MMM-YYYY';
export const GET_DISPLAY_TIME_FORMAT = 'LT';
export const CURRENT_DATE = new Date();

export const getCurrentDate = () => {
    return moment(CURRENT_DATE).format(GET_DISPLAY_DATE_FORMAT);
};

export const getCurrentTime = () => {
    return moment(CURRENT_DATE).format(GET_DISPLAY_TIME_FORMAT);
};

export const getDateFormat = (data) => {
    if (isStringValue(data)) {
        return moment(data).format(GET_DISPLAY_DATE_FORMAT);
    } else {
        return '';
    }
};

export const addMonthToDate = (date, month) => {
    return moment(date).add(month, 'months').toDate();
};

export const removeMonthFromDate = (date, month) => {
    return moment(date).subtract(month, 'months').toDate();
};

export const addDaysToDate = (date, numOfDays) => {
    return moment(date).add(numOfDays, 'd').toDate();
};

export const removeDaysToFromDate = (date, numOfDays) => {
    return moment(date).subtract(numOfDays, 'd').toDate();
};

export const addMinutesToDate = (date, minutes) => {
    return moment(date).add(minutes, 'minutes').toDate();
};

export const removeMinutesFromDate = (date, minutes) => {
    return moment(date).subtract(minutes, 'minutes').toDate();
};

export const addYearsToDate = (d, years) => {
    return moment(d).add(years, 'year').toDate();
};

export const removeYearsFromDate = (d, years) => {
    return moment(d).subtract(years, 'year').toDate();
};