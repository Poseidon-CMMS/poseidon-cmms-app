export const imageUrlGenerator = function(relativeUrl){
    return process.env.VUE_APP_IMAGE_SERVER_URL + relativeUrl
}