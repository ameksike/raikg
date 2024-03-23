
const Raikg = require('../');

const server = new Raikg();

server.use(Raikg.cls.middleware.body, (req, res, next) => {
    next();
});

server.set({
    
})

server.start({
    port: 3131
})