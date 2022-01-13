export const dateFormatter = (dateISOString, showTime = true) => {
    const dateObject = new Date(dateISOString);
    const dateString = `${dateObject.getFullYear()}/${ dateObject.getMonth() + 1}/${dateObject.getDate()}`;
    const timeString = showTime? ` ${dateObject.getHours()}:${dateObject.getMinutes()}`:""
    return dateString+timeString;
}