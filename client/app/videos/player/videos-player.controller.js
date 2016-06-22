/* global angular, YT */

// Can't angularize YT without a lot of work

angular
    .module('bemyapp-tech-env')
    .controller('VideosPlayerController', VideosPlayerController);

function VideosPlayerController(Videos, $scope) {
    var ctrl = this;
    var player;
    var currentVideo;
    
    ctrl.initPlayer = initPlayer;
    ctrl.Videos = Videos;

    activate();
    
    // /////////////////////////////////////:
    
    function activate() {
        $scope.$watchCollection('videosPlayerCtrl.Videos.all', function() {
            if (!Videos.all.length) {
                return;
            }
            if (!currentVideo || Videos.all[0].videoId !== currentVideo.videoId) {
                loadVideo();
            }
        });
    }
    
    function initPlayer(id) {
        player = new YT.Player(id, {
            height: '390',
            width: '640',
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange,
                'onError': onError
            }
        });
    }
    
    function onPlayerReady() {
        loadVideo();
    }
    
    function onPlayerStateChange(event) {
        if(event.data === 0) {
            Videos.remove(currentVideo);
        }
    }
    
    function loadVideo() {
        currentVideo = Videos.all[0];
        if (player.loadVideoById && currentVideo) {
            player.loadVideoById(currentVideo.videoId);
        }
    }
    
    function onError(event) {
        console.log('On Error : ', event);
        Videos.remove(currentVideo);
    }
}