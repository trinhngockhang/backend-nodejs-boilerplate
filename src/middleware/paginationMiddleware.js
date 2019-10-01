const _ = require('lodash');

export const paginationMiddleware = ({ maxSize = 20, defaultSize = 10, filterKeys = null, sortKeys = null }) => (req, res, next) => {
  const limit = Math.min(Math.max(1, _.get(req, 'query.size', defaultSize)), maxSize);

  const page = Math.max(1, _.get(req, 'query.page', 1));

  const offset = limit * (page - 1);

  // condition and sort (sequelize)
  const _filters = req.query.filters || {};
  const _sorts = req.query.sorts || {};

  const filters = filterKeys ? _.pick(_filters, filterKeys) : _filters;
  const sorts = sortKeys ? _.pickBy(_sorts, (v, k) => sortKeys.includes(k) && !isNaN(v)) : _.pickBy(_sorts, v => !isNaN(v));
  // normalize sorts
  req.pagination = {
    page,
    offset,
    limit,

    filters,
    sorts: _.mapValues(sorts, v => Number(v)),
    keyword: req.query._keyword,
  };
  next();
};
