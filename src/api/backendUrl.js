let backendURL = 'SERVER_URL_SED_WILDCARD';

const isLocalDeployment = backendURL.includes('SED_WILDCARD'); // if the backendURL has not been edited by sed
console.log(`idd: ${isDockerDeployment} ${backendURL} V9`);
if(isLocalDeployment) backendURL = process.env.VUE_APP_SERVER_URL;

export {backendURL}
