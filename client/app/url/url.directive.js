/* global angular */

angular
    .module('bemyapp-tech-env')
    .directive('url', UrlDirective);

function UrlDirective() {
    return {
        restrict: 'E',
        templateUrl: 'app/url/url.html',
        controller: 'UrlController',
        controllerAs:  'urlCtrl',
        scope: {
            url: '=target'
        }
    };
}