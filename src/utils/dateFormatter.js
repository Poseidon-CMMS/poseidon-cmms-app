import moment from 'moment';

export const dateFormatter = (dateISOString, showTime = true) => {
    if(showTime)
        return moment.format(dateISOString, 'DD-MM-YYYY HH:mm:ss');
    else return moment.format(dateISOString, 'DD-MM-YYYY');
}