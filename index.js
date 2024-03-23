const RaikgServer = require('./src/RaikgServer');
const BodyParser = require('./src/middleware/BodyParser');

class RaikgPlugin extends RaikgServer {
    static cls = {
        Server: RaikgServer,
        middleware: {
            body: BodyParser
        }
    };
};
module.exports = RaikgPlugin;