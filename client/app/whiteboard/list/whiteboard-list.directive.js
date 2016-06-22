/* global angular */

angular
    .module('bemyapp-tech-env')
    .directive('whiteboardList', WhiteboardListDirective);

function WhiteboardListDirective() {
    return {
        restrict: 'E',
        templateUrl: 'app/whiteboard/list/whiteboard-list.html',
        controller: 'WhiteboardListController',
        controllerAs: 'whiteboardListCtrl'
    };
}
