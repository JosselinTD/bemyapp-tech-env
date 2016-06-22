var DefaultController = require('../utils/default.controller.js');
var Session = require('./session.model.js');

module.exports = function(socket, io) {
    DefaultController('session', Session, socket, io);
}