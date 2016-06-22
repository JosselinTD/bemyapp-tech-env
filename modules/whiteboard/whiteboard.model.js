var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var WhiteboardSchema = new mongoose.Schema({
    title: String,
    datas: mongoose.Schema.Types.Mixed
});

var Whiteboard = mongoose.model('whiteboard', WhiteboardSchema);

module.exports = Whiteboard;
