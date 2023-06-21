import {ORIGIN_URL} from '../constants/urls';

export function imagePathToUrl(imagePath) {
  if (imagePath.includes('http')) return imagePath;
  return ORIGIN_URL + imagePath;
}
