import moment from 'moment';

export const dateFormatter = (dateISOString, showTime = true) => {
    if(showTime)
        return moment(dateISOString).format('DD-MM-YYYY HH:mm:ss');
    else return moment(dateISOString).format('DD-MM-YYYY');
}