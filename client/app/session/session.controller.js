/* global angular */

angular
    .module('bemyapp-tech-env')
    .controller('SessionController', SessionController);

function SessionController(Session) {
    var ctrl = this;
    
    ctrl.sessions = Session.all;
    ctrl.hasSession = Session.hasSession;
    ctrl.current = Session.current;
    ctrl.selectSession = Session.set;
}
