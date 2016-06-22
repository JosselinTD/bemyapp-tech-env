/* global angular */

angular
    .module('bemyapp-tech-env', []);

/* global angular, io */

angular
    .module('bemyapp-tech-env')
    .constant('io', io);

/* global angular, _ */

angular
    .module('bemyapp-tech-env')
    .constant('_', _);
/* global angular */

angular
    .module('bemyapp-tech-env')
    .controller('ConferenceController', ConferenceController);

function ConferenceController() {
    
}
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

/* global angular */

angular
    .module('bemyapp-tech-env')
    .controller('NavigationController', NavigationController);

function NavigationController($scope, $rootScope, Session) {
    var ctrl = this;
    
    $scope.Session = Session;
    
    $rootScope.href = 'login';
    $rootScope.id = '';
    
    ctrl.goTo = Session.goTo;
    
    $scope.$watch('Session.current', function() {
        var current = Session.current.navigation;
        
        if (!Session.hasSession()) {
            $rootScope.href = 'login';
            return;
        }
        
        if (!current) {
            $rootScope.href = 'home';
            return;
        }
        
        if (current === 'whiteboard-list') {
            $rootScope.href = 'whiteboard-list';
            return;
        }
        
        if (current === 'conference') {
            $rootScope.href = 'conference';
            return;
        }
        
        if (current === 'videos-playlist') {
            $rootScope.href = 'videos-playlist';
            return;
        }
        
        if (current === 'videos-player') {
            $rootScope.href = 'videos-player';
            return;
        }
        
        if (current === 'videos-plalist') {
            $rootScope.href = 'videos-plalist';
            return;
        }
        
        if (current === 'url' && Session.current.url) {
            $rootScope.href = 'url';
            $rootScope.url = Session.current.url;
            return;
        }
        
        if (current.indexOf('whiteboard') !== -1) {
            $rootScope.id = current.split('/')[1];
            $rootScope.href = 'whiteboard';
            return;
        }
        
        $rootScope.href = 'home';
        return;
    }, true);
}
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
/* global angular */

angular
    .module('bemyapp-tech-env')
    .controller('SessionController', SessionController);

function SessionController(Session) {
    var ctrl = this;
    
    ctrl.sessions = Session.all;
    ctrl.hasSession = Session.hasSession;
    ctrl.current = Session.current;
    ctrl.selectSession = Session.set;
}

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

/* global angular */

angular
    .module('bemyapp-tech-env')
    .service('Session', SessionService);

function SessionService(Socket) {
    var service = this;
    angular.extend(service, new Socket('session'));
    
    service.current = {};
    
    service.set = setCurrent;
    service.hasSession = hasSession;
    service.goTo = goTo;
    
    // /////////////////////////////////////////
    
    function setCurrent(name) {
        var exist = service.read({name: name});
        if (exist) {
            return service.current = exist;
        }
        service.create({name: name});
    }
    
    function hasSession() {
        return !!service.current.name;
    }
    
    function goTo(navigation) {
        if (service.hasSession()) {
            service.update(angular.extend({}, service.current, {navigation: navigation}));
        }
    }
}

/* global angular */

angular
    .module('bemyapp-tech-env')
    .factory('Socket', SocketService);

function SocketService(SocketWrapper) {
    return function(model) {
        var service = this;
        var isReaded = false;
    
        service.all = [];
        
        // CRUD
        service.read = read;
        service.create = create;
        service.update = update;
        service.remove = remove;
        
        // Server talk
        SocketWrapper.on('readed:' + model, readed);
        SocketWrapper.on('created:' + model, created);
        SocketWrapper.on('updated:' + model, updated);
        SocketWrapper.on('removed:' + model, removed);
        
        //Utils
        service.isFilled = isFilled;
        
        activate();
        
        // /////////////////////////////////////////////
        
        function activate() {
            SocketWrapper.emit('read:' + model);
        }
        
        function read(search) {
            if (search) {
                return service.all.find(function(model) {
                    var ko = Object.keys(search).some(function(s) {
                        if (search[s] !== model[s]) {
                            return true;
                        }
                        return false;
                    });
                    
                    return !ko;
                });
            }
            return service.all;
        }
        
        function create(datas) {
            SocketWrapper.emit('create:' + model, datas);
        }
        
        function update(datas) {
            SocketWrapper.emit('update:' + model, datas);
        }
        
        function remove(datas) {
            SocketWrapper.emit('remove:' + model, datas);
        }
        
        function readed(sModels) {
            isReaded = true;
            sModels.forEach(function(sModel) {
                var model = read({_id: sModel._id});
                if (model && !Array.isArray(model)) {
                    return angular.extend(model, sModel);
                }
                service.all.push(sModel);
            });
        }
        
        function created(model) {
            readed([model]);
        }
        
        function updated(model) {
            readed([model]);
        }
        
        function removed(id) {
            var toDelete = read({_id: id});
            if (toDelete && !Array.isArray(toDelete)) {
                service.all.splice(service.all.indexOf(toDelete), 1);
            }
        }
        
        function isFilled() {
            return isReaded;
        }
    }
}
/* global angular */

angular
    .module('bemyapp-tech-env')
    .factory('SocketWrapper', SocketWrapperService);

function SocketWrapperService(io, $rootScope) {
    var socket = io.connect();
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {  
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                if (callback) {
                    callback.apply(socket, args);
                }
                });
            })
        }
    };
}

/* global angular */

angular
    .module('bemyapp-tech-env')
    .controller('UrlController', UrlController);

function UrlController(Session, $sce, $scope) {
    var ctrl = this;
    ctrl.trustedUrl = $sce.trustAsResourceUrl($scope.url);
}
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
/* global angular */

angular
    .module('bemyapp-tech-env')
    .service('Videos', VideosService);

function VideosService(Socket) {
    var service = this;
    angular.extend(service, new Socket('videos'));
}

/* global angular */

angular
    .module('bemyapp-tech-env')
    .service('Whiteboard', WhiteboardService);

function WhiteboardService(Socket) {
    var service = this;
    angular.extend(service, new Socket('whiteboard'));
}
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

/* global angular, initGoJSBPMN, goLoadJSON */

angular
    .module('bemyapp-tech-env')
    .constant('InitWhiteboard', initGoJSBPMN)
    .constant('LoadWhiteboard', goLoadJSON);
/* global angular */

angular
    .module('bemyapp-tech-env')
    .controller('WhiteboardController', WhiteboardController);

function WhiteboardController($scope, LoadWhiteboard, InitWhiteboard, Whiteboard, Session, _) {
    var ctrl = this;
    
    $scope.initDiagram = initDiagram;
    $scope.Whiteboard = Whiteboard;
    
    ctrl.whiteboard;
    
    // ////////////////////////////////////////
    
    function initDiagram() {
        var watcher = $scope.$watch('Whiteboard.all', function() {
            ctrl.whiteboard = Whiteboard.read({_id: $scope.id});
            
            if (!ctrl.whiteboard) {
                Session.goTo('whiteboard-list');
                watcher();
                return;
            }
            
            $scope.diagram = InitWhiteboard('myDiagramDiv');
            
            $scope.diagram.addModelChangedListener(function(e) {
                if (e.um === 'CommittedTransaction') {
                    fromHere();
                }
            });
            /* $scope.diagram.addDiagramListener('LayoutCompleted', fromHere);
            $scope.diagram.addDiagramListener('SelectionMoved', fromHere); */
            
            LoadWhiteboard($scope.diagram, ctrl.whiteboard.datas || {});
            
            $scope.$watch('whiteboardCtrl.whiteboard', function() {
                fromInternet();
            }, true);
            
            watcher();
        }, true);
    }
    
    function fromInternet() {
        if (!_.isEqual(JSON.parse($scope.diagram.model.toJson()), ctrl.whiteboard.datas)) {
            LoadWhiteboard($scope.diagram, ctrl.whiteboard.datas);
        }
    }
    
    function fromHere() {
        // Update internet
        Whiteboard.update(angular.extend({}, ctrl.whiteboard, {datas: JSON.parse($scope.diagram.model.toJson())}));
    }
}
/* global angular */

angular
    .module('bemyapp-tech-env')
    .directive('whiteboard', WhiteboardDirective);

function WhiteboardDirective(InitWhiteboard, LoadWhiteboard) {
    return {
        restrict: 'E',
        templateUrl: 'app/whiteboard/editor/whiteboard.html',
        controller: 'WhiteboardController',
        controllerAs: 'whiteboardCtrl',
        replace: true,
        scope: {
            id: '=wid'
        },
        link: function(scope, elements, attr) {
            scope.initDiagram();
        }
    };
}
/* global angular */

angular
    .module('bemyapp-tech-env')
    .controller('WhiteboardListController', WhiteboardListController);

function WhiteboardListController(Whiteboard, Session) {
    var ctrl = this;
    
    ctrl.whiteboards = Whiteboard.read();
    ctrl.add = add;
    ctrl.goTo = Session.goTo;
    
    // //////////////////////////////////////////
    
    function add(title) {
        Whiteboard.create({title: title, datas: {}});
    }
}
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
