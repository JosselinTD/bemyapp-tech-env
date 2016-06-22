/* global angular */

angular
    .module('bemyapp-tech-env')
    .directive('videosPlaylist', VideosPlaylistDirective);

function VideosPlaylistDirective() {
    return {
        restrict: 'E',
        templateUrl: 'app/videos/playlist/videos-playlist.html',
        controller : 'VideosPlaylistController',
        controllerAs: 'videosPlaylistCtrl'
    };
}
