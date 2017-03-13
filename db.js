const mongoose = require('mongoose'),
 config = require('./config.js');

// MONGO DB
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoUri);
var db = mongoose.connection;
db.on('error', console.error.bind('console', 'DB connection error: '));
db.once('open', function () {
	console.log('Connected to DB: ', config.mongoUri);
});

// END DB

module.exports = mongoose;