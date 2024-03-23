const RaikgServer = require('./src/RaikgServer');
const FormParser = require('./src/middleware/FormParser');
const BodyParser = require('./src/middleware/BodyParser');

class RaikgPlugin extends RaikgServer {
    static cls = {
        Server: RaikgServer,
        middleware: {
            body: BodyParser,
            form: FormParser
        }
    };
};
module.exports = RaikgPlugin;