# Raikg
Minimalist web server for Node.Js

### Topics 
- [Demo: Hello world](./doc/intro.hello_world.md)
- [Demo: Simple](./doc/demo.simple.md)
- [Demo: Server-Sent Events (SSE)](./doc/demo.sse.md)

### Get started
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
