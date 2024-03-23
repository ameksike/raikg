const ksmf = require('ksmf');
const Router = require('./Router');
const mwReqURL = require('./middleware/ReqURL');
const mwResJSON = require('./middleware/ResJSON');

/**
 * @typedef {import("./types").TRoute} TRoute
 */

class RaikgServer extends ksmf.server.Base {
    /**
     * @type  {Object}
     */
    driver;

    /**
     * @type {Array}
     */
    middleware;

    /**
     * @type {Router}
     */
    router;

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
    constructor(payload = undefined) {
        super(payload);
        this.middleware = [];
        this.driver = {
            http: require('http'),
            https: require('https'),
        };
        this.router = new Router();
    }

    /**
     * @description run middleware
     * @param {TMiddleware} mw 
     * @param {Object} req 
     * @param {Object} res 
     */
    #runMw(mw, req, res) {
        return new Promise((next) => {
            try {
                mw instanceof Function && mw(req, res, next);
            }
            catch (error) {
                this.logger?.error({
                    src: 'Raikge:Run:Middleware',
                    error
                });
                next();
            }
        });
    }

    use(...middlewares) {
        for (let mw of middlewares) {
            mw instanceof Function && this.middleware.push(mw);
        }
    }

    /**
     * @description set a route
     * @param {TRoute|Array<TRoute>} payload 
     */
    set(payload) {
        if (Array.isArray(payload)) {
            for (let item of payload) {
                this.router?.set(item);
            }
        } else {
            this.router?.set(payload);
        }
    }

    /**
     * @description set a router config
     * @param {Object} payload 
     */
    route(payload) {
        this.router?.add(payload);
    }

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
    async start(payload = null) {
        const { key, cert, protocol = 'http', port = 3003, host = '127.0.0.1' } = payload || {};
        const drv = this.driver[protocol];
        const options = {};
        if (protocol === 'https' && key && cert) {
            options.key = key;
            options.cert = cert;
        }
        return new Promise((resolve, reject) => {
            this.web = drv.createServer(options, async (req, res) => {
                try {
                    mwReqURL(req);
                    mwResJSON(res);
                    for (let middleware of this.middleware) {
                        await this.#runMw(middleware, req, res);
                    }
                    let controller = this.router.get(req.pathname);
                    controller = controller || this.router.get(404);
                    if (!controller || (controller.method && controller.method.toUpperCase() !== req.method)) {
                        this.onError(null, { req, res });
                        return reject({ req, res, error });
                    }
                    return this.#runMw(controller.handler, req, res);
                }
                catch (error) {
                    this.onError(null, { req, res });
                    return reject({ req, res, error });
                }
            });
            this.web.listen(port, () => {
                resolve({ port, host, protocol: 'http', url: `${protocol}://${host}:${port}`, provider: 'raikg' });
            });
        })

    }

    onError(callback, context = null) {
        if (!context?.res) {
            return null;
        }
        if (callback instanceof Function) {
            callback(context);
        } else {
            let status = context.error ? 500 : 404;
            let body = context?.error?.message || 'Page not found';
            if (!context.res.finished) {
                context.res.writeHead(status, { 'Content-Type': 'text/html' });
                context.res.end(body);
            }
        }
    }
}
module.exports = RaikgServer;