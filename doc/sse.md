
# SSE

```js
const fs = require('fs');
// ----------------------------
const store = {
    data: {
        message: 'This is a server-sent event',
        timestamp: new Date().toLocaleTimeString()
    }
};
// ----------------------------
const router = {
    /**
     * @description /home
     * @param {*} req 
     * @param {*} res 
     */
    "/": (req, res) => {
        fs.readFile('sse.client.html', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
        return true;
    },

    /**
     * @description /send
     * @param {*} req 
     * @param {*} res 
     */
    "/send": (req, res) => {
        store.data = {
            message: req.query.message,
            timestamp: new Date().toLocaleTimeString()
        }
        res.send({
            query: req.query,
            body: req.body,
            pathname: req.pathname,
        });
    },

    /**
     * @description /event
     * @param {*} req 
     * @param {*} res 
     */
    "/event": (req, res) => {
        // Set headers for SSE
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        });

        // Send data at regular intervals
        const interval = setInterval(() => {
            // Send data as an event
            res.write(`event: message\n`);
            res.write(`data: ${JSON.stringify(store.data)}\n\n`);
            console.log(`data: ${JSON.stringify(store.data)}\n\n`);
        }, 1000);

        // When the client closes the connection, stop sending data
        req.on('close', () => {
            clearInterval(interval);
            res.end();
        });
    },

    /**
     * @description /404
     * @param {*} req 
     * @param {*} res 
     */
    "404": (req, res) => {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Page not founds');
    }
};

module.exports = router;
```

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Server-Sent Events Example</title>
</head>

<body>
  <h3>SSE Demo</h3>
  <div id="sse-data"></div>

  <script>
    // Connect to the SSE server
    const sseSource = new EventSource('/event'); 

    // Listen for events
    sseSource.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      write(data);
    });

    // Handle errors
    sseSource.onerror = (error) => {
      console.error('SSE Error:', error);
      sseSource.close();
    };

    // Handle UI
    function write(data) {
      const sseDataElement = document.getElementById('sse-data');
      sseDataElement.innerHTML += `<p>${data.message} - ${data.timestamp}</p>`;
    }
  </script>
</body>

</html>
```

```js

const Raikg = require("raikg");
const Router = require("./sse.router");

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

server.route(Router);

server.start({ port: 3131 }).then(data => console.log(data))
```