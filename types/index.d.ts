export = RaikgPlugin;
declare class RaikgPlugin extends RaikgServer {
    static cls: {
        Server: typeof RaikgServer;
        middleware: {
            body: (req: any, res: any, next: Function) => any;
        };
    };
}
import RaikgServer = require("./src/RaikgServer");
