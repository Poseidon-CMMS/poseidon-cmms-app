let backendURL = 'SERVER_URL_SED_WILDCARD';

const isDockerDeployment = backendURL !== ('SERVER_URL_'+'SED_WILDCARD')
if(!isDockerDeployment) backendURL = process.env.VUE_APP_SERVER_URL;

export {backendURL}