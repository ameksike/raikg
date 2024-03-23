const ksmf = require('ksmf');
const Router = require('./Router');
const mwReqURL = require('./middleware/ReqURL');
const mwResJSON = require('./middleware/ResJSON');

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

    runMw(mw, req, res) {
        return new Promise((next) => {
            try {
                mw instanceof Function && mw(req, res, next);
            }
            catch (error) {
                this.logger?.error({
                    src: 'Raikge:runMw',
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
     * @param {import("./types").TRoute} payload 
     */
    set(payload) {
        this.router?.set(payload);
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
        const protocol = this.driver[payload?.protocol] ? payload?.protocol : 'http';
        const options = {};
        this.web = this.driver[protocol].createServer(options, async (req, res) => {
            try {
                mwReqURL(req);
                mwResJSON(res);
                for (let middleware of this.middleware) {
                    await this.runMw(middleware, req, res);
                }
                let controller = this.router.get(req.pathname);
                if (!controller) {
                    return this.onError(null, { req, res });
                }
                return await this.runMw(controller.handler, req, res);
            }
            catch (error) {
                this.onError(null, { req, res, error });
            }
        });
        this.web.listen(payload?.port || 3333, () => {
            console.log('Server running on http://localhost:3000');
        });
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
            context.res.writeHead(status, { 'Content-Type': 'text/html' });
            context.res.end(body);
        }
    }
}
module.exports = RaikgServer;