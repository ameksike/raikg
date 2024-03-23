/**
 * @callback TMiddleware
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */

/**
 * @typedef {Object} TRoute
 * @property {String} route
 * @property {String} [method]
 * @property {TMiddleware} handler
 * @property {Array<TMiddleware>} [middlewares]
 */

module.exports = {};