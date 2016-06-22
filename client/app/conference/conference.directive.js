/* global angular */

angular
    .module('bemyapp-tech-env')
    .directive('conference', ConferenceDirective);

function ConferenceDirective() {
    return {
        restrict: 'E',
        templateUrl: 'app/conference/conference.html'
    };
}
