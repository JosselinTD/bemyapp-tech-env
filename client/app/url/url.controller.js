/* global angular */

angular
    .module('bemyapp-tech-env')
    .controller('UrlController', UrlController);

function UrlController(Session, $sce, $scope) {
    var ctrl = this;
    ctrl.trustedUrl = $sce.trustAsResourceUrl($scope.url);
}