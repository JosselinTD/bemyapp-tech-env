/* global angular */

angular
    .module('bemyapp-tech-env')
    .controller('VideosPlaylistController', VideosPlaylistController);

function VideosPlaylistController(Videos) {
    var ctrl = this;
    
    ctrl.videos = Videos.all;
    
    ctrl.add = add;
    
    // /////////////////////////////
    
    function add(videoId) {
        Videos.create({videoId: videoId});
    }
}
