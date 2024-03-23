const KsCryp = require('kscryp');
const { URLSearchParams } = require('url');

function parseURLParams(urlString) {
    const params = new URLSearchParams(urlString);
    const queryParams = {};
    for (const [key, value] of params.entries()) {
        queryParams[key] = value;
    }
    return queryParams;
}

/**
 * @description middleware for body parser 
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 */
module.exports = function (req, res, next) {
    if (req.method !== 'POST' && req.method !== 'PUT' && req.method !== 'PATCH') {
        return next(req);
    }
    let body = '';
    let contentType = req.headers['content-type'];
    let type = contentType?.startsWith('application/x-www-form-urlencoded') ? 'form' : '';
    type = type ? type : (contentType?.startsWith('application/json') ? 'json' : '');
    if (!type) {
        return next(req);
    }
    // Listen for data chunks
    req.on('data', (chunk) => body += chunk.toString());
    // Listen for end of request
    req.on('end', () => {
        if (type === 'form') {
            req.body = parseURLParams(body);
        } else if (type === 'json') {
            req.body = KsCryp.decode(body, 'json');
        }
        next(req);
    });
}


