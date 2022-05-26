let backendURL = 'SERVER_URL_SED_WILDCARD';
if(process.env.NODE_ENV !== 'production') backendURL = process.env.VUE_APP_SERVER_URL;

export {backendURL}