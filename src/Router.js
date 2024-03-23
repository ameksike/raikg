class Router {

    /**
     * @type  {Object}
     */
    store;

    constructor() {
        this.store = {};
    }

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
    set(payload) {
        this.store[payload?.route || '/'] = payload;
    }

    /**
     * 
     * @param {String} key 
     */
    get(key) {
        let controller = this.store[key];
        if (!controller) {
            return null;
        }
        if (!(controller.handler instanceof Function)) {
            return null;
        }
        controller.middlewares = Array.isArray(controller.middlewares) ? controller.middlewares : null;
        return controller;
    }
}

module.exports = Router;