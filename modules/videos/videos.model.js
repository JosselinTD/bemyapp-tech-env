var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var VideosSchema = new mongoose.Schema({
    videoId: String,
});

var Videos = mongoose.model('videos', VideosSchema);

module.exports = Videos;
