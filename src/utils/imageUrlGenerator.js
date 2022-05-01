import { backendURL } from "../api/backendUrl"

export const imageUrlGenerator = function(relativeUrl){
    return backendURL + relativeUrl
}