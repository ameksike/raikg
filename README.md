# Raikg
Minimalist web server for Node.Js

```js
const server = new Raikg();

server.use(
    Raikg.cls.middleware.body,
    Raikg.cls.middleware.form,
    (req, res, next) => {
        next()
    }
);

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
