export const imageUrlGenerator = function(relativeUrl){
    return process.env.VUE_APP_BACKEND_URL + relativeUrl
}