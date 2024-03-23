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
    let contentType = req.headers['content-type'];
    if (contentType?.startsWith('multipart/form-data')) {
        // Extract boundary string from content-type header
        const boundary = req.headers['content-type'].split('boundary=')[1];
        // Initialize variables to store form data
        let formData = {};
        let currentFieldName = '';
        let currentFieldValue = '';
        // Listen for data chunks
        req.on('data', (chunk) => {
            const data = chunk.toString();
            // Split data by boundary
            const parts = data.split(`--${boundary}`);
            // Loop through parts
            for (let part of parts) {
                // Remove leading and trailing whitespaces
                part = part.trim();
                // Skip empty parts
                if (part === '') continue;
                // Check if part is a form field or a file
                if (part.startsWith('Content-Disposition')) {
                    // Extract field name from content-disposition header
                    const match = part.match(/name=["|']([^']*)["|'][\r|\n|\s|;]*(.*)/);
                    if (match) {
                        formData[match[1]] = match[2];
                        if (part.includes('filename=')) {
                            currentFieldName = match[1];
                            currentFieldValue = '';
                            let tmp = part.split('\r\n\r\n');
                            tmp[1] && (currentFieldValue += tmp[1]);
                        }
                    }
                } else if (part.startsWith('Content-Type')) {
                    // This part is a file, handle it as needed
                    // Here you can save the file to disk or process its contents
                } else {
                    // This part is a form field value
                    currentFieldValue += part;
                }
            }
            currentFieldValue && (formData[currentFieldName] = currentFieldValue);
        });
        // Listen for end of request
        req.on('end', () => {
            // Store the last form field
            // formData[currentFieldName] = currentFieldValue;
            // Process the form data
            req.body = formData;
            next(req);
        });
    }
    else {
        let body = '';
        // RAW JSON data 
        // Listen for data chunks
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        // Listen for end of request
        req.on('end', () => {
            if (contentType?.startsWith('application/x-www-form-urlencoded')) {
                req.body = parseURLParams(body);
            } else if (contentType === 'application/json') {
                req.body = KsCryp.decode(body, 'json');
            } else {
                req.body = body;
            }
            next(req);
        });
    }
}


