export = Router;
declare class Router {
    /**
     * @type  {Object}
     */
    store: any;
    /**
     * @description set a route
     *
     * @callback Handler
     * @param {Object} [req]
     * @param {Object} [res]
     * @param {Function} [next]
     *
     * @param {Object} payload
     * @param {String} payload.route
     * @param {String} payload.method
     * @param {Handler} payload.handler
     * @param {Array} payload.middlewares
     * @returns {Object}
     */
    set(payload: any): void;
    /**
     *
     * @param {String} key
     */
    get(key: string): any;
}
