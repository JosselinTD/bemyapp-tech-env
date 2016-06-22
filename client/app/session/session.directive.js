/* global angular */

angular
    .module('bemyapp-tech-env')
    .directive('session', SessionDirective);

function SessionDirective() {
    return {
        restrict: 'E',
        templateUrl: 'app/session/session.html',
        controller: 'SessionController',
        controllerAs: 'sessionCtrl'
    };
}
