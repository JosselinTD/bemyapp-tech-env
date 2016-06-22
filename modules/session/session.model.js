var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var SessionSchema = new mongoose.Schema({
    name: String,
    navigation: String,
    url: String
});

var Session = mongoose.model('session', SessionSchema);

module.exports = Session;