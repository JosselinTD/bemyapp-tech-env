/* global angular */

angular
    .module('bemyapp-tech-env')
    .service('Whiteboard', WhiteboardService);

function WhiteboardService(Socket) {
    var service = this;
    angular.extend(service, new Socket('whiteboard'));
}