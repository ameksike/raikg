

```js
// import the library 
const Raikg = require("raikg");
// create a simple HTTP server instance
const server = new Raikg();
// add support for body parser and form-data parser
server.use(
    Raikg.cls.middleware.body, 
    Raikg.cls.middleware.form,
    (req, res, next) => {
        next()
    }
);
// add routing scheme
server.set([
    {
        path: '/api',
        handler: (req, res, next) => {
            res.send({
                query: req.query,
                body: req.body,
                pathname: req.pathname,
            });
        }
    }, {
        path: '/demo',
        method: 'post',
        handler: (req, res, next) => {
            res.send({
                query: req.query,
                body: req.body,
                pathname: req.pathname,
            });
        }
    }
])

server.start({ port: 3131 }).then(info => console.log(info));
```
