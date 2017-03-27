//mongo db 연결
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_AZURE_URL);
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function() {
	console.log("Connected to "+process.env.MONGODB_AZURE_URL+" server");
});

module.exports = db;