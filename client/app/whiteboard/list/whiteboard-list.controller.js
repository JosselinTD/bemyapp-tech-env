/* global angular */

angular
    .module('bemyapp-tech-env')
    .controller('WhiteboardListController', WhiteboardListController);

function WhiteboardListController(Whiteboard, Session) {
    var ctrl = this;
    
    ctrl.whiteboards = Whiteboard.read();
    ctrl.add = add;
    ctrl.goTo = Session.goTo;
    
    // //////////////////////////////////////////
    
    function add(title) {
        Whiteboard.create({title: title, datas: {}});
    }
}