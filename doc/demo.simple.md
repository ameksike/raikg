

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
// add routing list
server.set([
    /**
     * @descriotion path /demo_1 for (GET,POST,PUT,DELETE,PATCH)
     */
    {
        path: '/demo_1',
        handler: (req, res, next) => {
            res.send({
                query: req.query,
                body: req.body,
                pathname: req.pathname,
            });
        }
    }, 
    /**
     * @descriotion path /demo_2 only POST
     */
    {
        path: '/demo_2',
        method: 'post',
        handler: (req, res, next) => {
            res.send({
                query: req.query,
                body: req.body,
                pathname: req.pathname,
            });
        }
    },
    /**
     * @descriotion In case the URL does not match
     */
    {
        path: '404',
        handler: (req, res, next) => {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Page not founds');
        }
    }
])

server.start({ port: 3131 }).then(info => console.log(info));
```
