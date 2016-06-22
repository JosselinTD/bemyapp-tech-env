var DefaultController = require('../utils/default.controller.js');
var Whiteboard = require('./whiteboard.model.js');

module.exports = function(socket, io) {
    DefaultController('whiteboard', Whiteboard, socket, io);
}
