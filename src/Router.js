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
     * @param {import("./types").TRoute} payload 
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