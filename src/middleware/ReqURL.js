const url = require('url');

module.exports = function (req) {
    const parsedUrl = url.parse(req.url, true);
    req.query = parsedUrl.query;
    req.pathname = parsedUrl.pathname;
    return req;
};