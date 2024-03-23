
# SSE Demo
Server-Sent Events (SSE) is a technology that allows a server to push real-time updates to a web browser over an HTTP connection. It enables servers to send data to a client asynchronously once the client establishes a connection to the server. SSE is commonly used for streaming real-time data, such as news updates, social media feeds, stock tickers, and other types of event-driven content.

Here are some key points about SSE and its usage:
- Unidirectional Communication: SSE provides a unidirectional channel for server-to-client communication. Once the connection is established, the server can send data to the client without the client needing to request it explicitly.

- Text-Based Format: Data sent over SSE is text-based, typically in the form of plain text or JSON. Each message sent from the server consists of a series of fields, including an optional event name, data payload, and a mandatory "event ID" for tracking message order.

- Automatic Reconnection: SSE handles automatic reconnection in case the connection is interrupted. The client will automatically attempt to reconnect to the server if the connection is lost, ensuring a reliable stream of updates.

- Browser Compatibility: SSE is well-supported by modern web browsers, including Chrome, Firefox, Safari, and Edge. However, support for Internet Explorer is limited or requires polyfills.

- Usage Scenarios: SSE is commonly used in applications where real-time updates are required, such as live news feeds, social media timelines, online gaming, chat applications, monitoring dashboards, and financial data streams.

- Lightweight Protocol: SSE is a lightweight protocol compared to other real-time communication techniques like WebSockets. It uses standard HTTP connections, making it easier to implement and deploy without the need for additional libraries or frameworks.

Overall, SSE provides a simple and efficient way to implement real-time communication between a server and a client over HTTP, making it suitable for a wide range of web applications that require live updates and notifications.


## Server 
To implement server-sent events (SSE) in Node.js, you can use the built-in HTTP module along with the EventSource object in the client-side JavaScript. Here's a basic example to demonstrate how to set up an SSE server in Node.js:

File: ```server.js```
```js
// import the library 
const Raikg = require("raikg");
// create a simple HTTP server instance
const server = new Raikg();
// add support for body parser and form-data parser
server.use(
    Raikg.cls.middleware.body, 
    Raikg.cls.middleware.form
);
// add routing scheme
server.route(require("./sse.router"));
// start the server
server.start({ port: 3000 }).then(data => console.log(data));
```

## Controller 
This code sets up a basic HTTP server in Node.js that sends server-sent events to any connected clients. It sends a simple JSON object with a message and a timestamp every second.
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

## View 
On the client side, you can use JavaScript to receive these events using the EventSource object:
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


This HTML file sets up an EventSource object that listens for events from the server. When an event is received, it updates the content of a < div > element with the message and timestamp received from the server.

To run the server, save the server code in a file named server.js and the client code in a file named index.html, then run the following command in your terminal:

```
node server.js
```

Access http://localhost:3000 in your web browser to see the SSE messages being displayed in the browser.

For further information about this topic, check this link [Using server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)