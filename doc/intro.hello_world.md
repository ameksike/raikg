

```js
// import the library 
const Raikg = require("raikg");
// create a simple HTTP server instance
const server = new Raikg();
// add routing scheme
server.set({
    path: '/',
    handler: (req, res, next) => {
        res.send("Hello world!");
    }
});

server.start({ port: 3131 }).then(info => console.log(info));
```
