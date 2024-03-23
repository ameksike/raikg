const KsCryp = require('kscryp');

module.exports = function (res, option) {
    const { status = 200, type } = option || {};
    res.send = (data) => {
        if (typeof data === 'object') {
            res.writeHead(status, { 'Content-Type': type || 'application/json' });
            data = KsCryp.encode(data, 'json');
        } else {
            res.writeHead(status, { 'Content-Type': type || 'text/html' });
        }
        res.end(data);
    }
};