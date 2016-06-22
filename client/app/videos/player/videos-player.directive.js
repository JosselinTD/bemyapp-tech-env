/* global angular */

angular
    .module('bemyapp-tech-env')
    .directive('videosPlayer', VideosPlayerDirective);

function VideosPlayerDirective() {
    return {
        restrict: 'E',
        templateUrl: 'app/videos/player/videos-player.html',
        controller: 'VideosPlayerController',
        controllerAs: 'videosPlayerCtrl',
        link: function(scope, el) {
            scope.videosPlayerCtrl.initPlayer('player');
        }
    };
}