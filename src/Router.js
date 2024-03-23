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
        this.store[payload?.path || payload?.route || '/'] = payload;
    }

    /**
     * @description set a route
     * @param {Object} payload 
     */
    add(payload) {
        for (let i in payload) {
            let controller = payload[i];
            if (controller instanceof Function) {
                controller = { handler: controller, path: i };
            }
            this.set(controller);
        }
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