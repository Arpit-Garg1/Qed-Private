import moment from 'moment';
import { isStringValue } from '../data-handling/DataHandling';

export const GET_DISPLAY_DATE_FORMAT = 'DD-MMM-YYYY';

export const getDateFormat = (data) => {
    if (isStringValue(data)) {
        return moment(data).format(GET_DISPLAY_DATE_FORMAT);
    } else {
        return '';
    }
};