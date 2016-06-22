/* global angular */

angular
    .module('bemyapp-tech-env')
    .directive('whiteboard', WhiteboardDirective);

function WhiteboardDirective(InitWhiteboard, LoadWhiteboard) {
    return {
        restrict: 'E',
        templateUrl: 'app/whiteboard/editor/whiteboard.html',
        controller: 'WhiteboardController',
        controllerAs: 'whiteboardCtrl',
        replace: true,
        scope: {
            id: '=wid'
        },
        link: function(scope, elements, attr) {
            scope.initDiagram();
        }
    };
}