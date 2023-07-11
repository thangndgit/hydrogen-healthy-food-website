import {ORIGIN_URL} from '../constants/urls';

export function imagePathToUrl(imagePath) {
  if (imagePath.includes('http')) return imagePath;
  return ORIGIN_URL + imagePath;
}

export function fieldsToObject(fields) {
  return fields.reduce((obj, field) => {
    let value;
    try {
      value = JSON.parse(field.value);
    } catch (error) {
      value = field.value;
    }
    obj[field.key] = value;
    return obj;
  }, {});
}

export function strToStandard(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function strIncludeStandard(str1, str2) {
  return strToStandard(str1).includes(strToStandard(str2));
}
