const express = require('express');
const bodyParser = require('body-parser');
const server = require('./server');

const app = express();

app.use(bodyParser.json({ limit: '5mb' })); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({
    limit: '5mb', // to support URL-encoded bodies
    extended: true
}));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
  next(err);
});

app.use('/', (req, res) => {
    res.send('Serving');
});

server(app);