export = RaikgServer;
declare const RaikgServer_base: typeof import("ksmf/types/src/server/BaseServer");
/**
 * @typedef {import("./types").TRoute} TRoute
 * @typedef {import("./types").TMiddleware} TMiddleware
 */
declare class RaikgServer extends RaikgServer_base {
    /**
     * @description configure the web server
     * @param {Object} [payload]
     * @param {Object} [payload.web]
     * @param {Object} [payload.drv]
     * @param {Object} [payload.logger]
     * @param {Object} [payload.helper]
     * @param {Object} [payload.option]
     * @param {Object} [payload.cookie]
     * @param {Object} [payload.static]
     * @param {Object} [payload.session]
     */
    constructor(payload?: {
        web?: any;
        drv?: any;
        logger?: any;
        helper?: any;
        option?: any;
        cookie?: any;
        static?: any;
        session?: any;
    });
    /**
     * @type  {Object}
     */
    driver: any;
    /**
     * @type {Array}
     */
    middleware: any[];
    /**
     * @type {Router}
     */
    router: Router;
    /**
     * @description configure the web server
     * @param {Object} [payload]
     * @param {Object} [payload.web]
     * @param {Object} [payload.drv]
     * @param {Object} [payload.logger]
     * @param {Object} [payload.helper]
     * @param {Object} [payload.option]
     * @param {Object} [payload.static]
     * @param {Boolean} [payload.cookie]
     * @returns {Promise<RaikgServer>} self
     */
    configure(payload?: {
        web?: any;
        drv?: any;
        logger?: any;
        helper?: any;
        option?: any;
        static?: any;
        cookie?: boolean;
    }): Promise<RaikgServer>;
    /**
     * @description set a route
     * @param {TRoute|Array<TRoute>} payload
     */
    set(payload: TRoute | Array<TRoute>): void;
    /**
     * @description set a router config
     * @param {Object} payload
     */
    route(payload: any): void;
    /**
     * @description start the server
     * @param {Object} [payload]
     * @param {Number} [payload.port]
     * @param {String} [payload.key]
     * @param {String} [payload.cert]
     * @param {String} [payload.host]
     * @param {String} [payload.protocol]
     * @param {Boolean} [payload.secure]
     * @param {Object} [payload.app]
     * @param {Function} [payload.callback]
     */
    start(payload?: {
        port?: number;
        key?: string;
        cert?: string;
        host?: string;
        protocol?: string;
        secure?: boolean;
        app?: any;
        callback?: Function;
    }): Promise<any>;
    onError(callback: any, context?: any): any;
    #private;
}
declare namespace RaikgServer {
    export { TRoute, TMiddleware };
}
import Router = require("./Router");
type TRoute = import("./types").TRoute;
type TMiddleware = import("./types").TMiddleware;
