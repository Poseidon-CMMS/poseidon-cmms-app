export const dateFormatter = (dateISOString, showTime = true) => {
    const dateObject = new Date(dateISOString);
    const dateString = `${dateObject.getFullYear()}/${('0' + (dateObject.getMonth()+1)).slice(-2)}/${('0' + dateObject.getDate()).slice(-2)}`;
    const timeString = showTime? ` ${dateObject.getHours()}:${dateObject.getMinutes()}`:""
    return dateString+timeString;
}