/* global angular */

angular
    .module('bemyapp-tech-env')
    .directive('navigation', NavigationDirective);

function NavigationDirective() {
    return {
        restrict: 'E',
        templateUrl: 'app/navigation/navigation.html',
        controller: 'NavigationController',
        controllerAs: 'navigationCtrl'
    };
}