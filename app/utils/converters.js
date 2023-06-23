import {ORIGIN_URL} from '../constants/urls';

export function imagePathToUrl(imagePath) {
  if (imagePath.includes('http')) return imagePath;
  return ORIGIN_URL + imagePath;
}

export function fieldsToObject(fields) {
  return fields.reduce((obj, field) => {
    obj[field.key] = field.value;
    return obj;
  }, {});
}
