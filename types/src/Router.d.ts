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
     *
     * @param {String} key
     */
    get(key: string): any;
}
