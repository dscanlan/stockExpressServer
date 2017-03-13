const http = require('http');
const config = require('./config');

const server = (app) => {
    const server = http.Server(app);
    const port = process.env.PORT || config.port;
    server.listen(config.port, () => {
        console.log('server listening on : ', port);
	});
};

module.exports = server;
