import {imageUrlGenerator} from "./imageUrlGenerator";

export const urlDownloader = function (relativeURL){
    window.open(imageUrlGenerator(relativeURL));
}