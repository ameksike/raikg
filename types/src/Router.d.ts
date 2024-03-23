export = Router;
declare class Router {
    /**
     * @type  {Object}
     */
    store: any;
    /**
     * @description set a route
     * @param {import("./types").TRoute} payload
     */
    set(payload: import("./types").TRoute): void;
    /**
     * @description set a route
     * @param {Object} payload
     */
    add(payload: any): void;
    /**
     *
     * @param {String|Number} key
     */
    get(key: string | number): any;
}
