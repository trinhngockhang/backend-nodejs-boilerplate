/* eslint-disable no-prototype-builtins */
import _ from 'lodash';

export const filtersSql = (filters) => {
  let sql = '';
  if (_.isEmpty(filters)) return sql;
  for (const key in filters) {
    // eslint-disable-next-line no-prototype-builtins
    if (filters.hasOwnProperty(key)) {
      const element = filters[key];
      sql += ` AND ${key} = ${element} `;
    }
  }
  return sql;
};

export const sortsSql = (sorts) => {
  let sql = '';
  if (_.isEmpty(sorts)) return sql;
  sql += ' ORDER BY ';
  let first = true;
  for (const key in sorts) {
    // eslint-disable-next-line no-prototype-builtins
    if (sorts.hasOwnProperty(key)) {
      const element = sorts[key];
      sql += first ? '' : ' , ';
      const val = element === '1' ? 'DESC' : 'ASC';
      sql += ` ${key} ${val} `;
      first = false;
    }
  }
  return sql;
};

export const removeInvalid = (object, validElement = []) => {
  const newObj = Object.assign({}, object);
  for (const key in newObj) {
    if (newObj.hasOwnProperty(key)) {
      if (!validElement.includes(key)) {
        delete newObj[key];
      }
    }
  }
  return newObj;
};
