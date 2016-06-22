var DefaultController = require('../utils/default.controller.js');
var Videos = require('./videos.model.js');

module.exports = function(socket, io) {
    DefaultController('videos', Videos, socket, io);
};
