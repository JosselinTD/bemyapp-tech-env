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
    ctrl.grab = grab;
    
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
    
    function grab(toGrab) {
        var toGrab = angular.copy(Session.read({name: toGrab}));
        if (toGrab) {
            toGrab.url = Session.current.url;
            toGrab.navigation = Session.current.navigation;
            Session.update(toGrab);
        }
    }
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
    .service('Videos', VideosService);

function VideosService(Socket) {
    var service = this;
    angular.extend(service, new Socket('videos'));
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

/* global angular, go */

angular
    .module('bemyapp-tech-env')
    .constant('InitWhiteboard', init)
    .constant('LoadWhiteboard', load)
    .constant('go', go);

function init(go, diagramId) {
    var $ = go.GraphObject.make;  // for conciseness in defining templates
    
    var yellowgrad = $(go.Brush, "Linear", { 0: "rgb(254, 201, 0)", 1: "rgb(254, 162, 0)" });
    var greengrad = $(go.Brush, "Linear", { 0: "#98FB98", 1: "#9ACD32" });
    var bluegrad = $(go.Brush, "Linear", { 0: "#B0E0E6", 1: "#87CEEB" });
    var redgrad = $(go.Brush, "Linear", { 0: "#C45245", 1: "#871E1B" });
    var whitegrad = $(go.Brush, "Linear", { 0: "#F0F8FF", 1: "#E6E6FA" });
    
    var bigfont = "bold 13pt Helvetica, Arial, sans-serif";
    var smallfont = "bold 11pt Helvetica, Arial, sans-serif";
    
    // Common text styling
    function textStyle() {
      return {
        margin: 6,
        wrap: go.TextBlock.WrapFit,
        textAlign: "center",
        editable: true,
        font: bigfont
      }
    }

    var myDiagram =
      $(go.Diagram, diagramId,
        {
          // have mouse wheel events zoom in and out instead of scroll up and down
          "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
          allowDrop: true,  // support drag-and-drop from the Palette
          initialAutoScale: go.Diagram.Uniform,
          "linkingTool.direction": go.LinkingTool.ForwardsOnly,
          initialContentAlignment: go.Spot.Center,
          layout: $(go.LayeredDigraphLayout, { isInitial: false, isOngoing: false, layerSpacing: 50 }),
          "undoManager.isEnabled": true,
          "animationManager.isEnabled": false
        });

    var defaultAdornment =
      $(go.Adornment, "Spot",
        $(go.Panel, "Auto",
          $(go.Shape, { fill: null, stroke: "dodgerblue", strokeWidth: 4 }),
          $(go.Placeholder)),
        // the button to create a "next" node, at the top-right corner
        $("Button",
          { alignment: go.Spot.TopRight,
            click: addNodeAndLink },  // this function is defined below
          new go.Binding("visible", "", function(a) { return !a.diagram.isReadOnly; }).ofObject(),
          $(go.Shape, "PlusLine", { desiredSize: new go.Size(6, 6) })
        )
      );

    // define the Node template
    myDiagram.nodeTemplate =
      $(go.Node, "Auto",
        { selectionAdornmentTemplate: defaultAdornment },
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        // define the node's outer shape, which will surround the TextBlock
        $(go.Shape, "Rectangle",
          { fill: yellowgrad, stroke: "black",
            portId: "", fromLinkable: true, toLinkable: true, cursor: "pointer",
            toEndSegmentLength: 50, fromEndSegmentLength: 40 }),
        $(go.TextBlock, "Page",
          { margin: 6,
            font: bigfont,
            editable: true },
          new go.Binding("text", "text").makeTwoWay()));

    myDiagram.nodeTemplateMap.add("Source",
      $(go.Node, "Auto",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Shape, "RoundedRectangle",
          { fill: bluegrad,
          portId: "", fromLinkable: true, cursor: "pointer", fromEndSegmentLength: 40}),
        $(go.TextBlock, "Source", textStyle(),
          new go.Binding("text", "text").makeTwoWay())
        ));

    myDiagram.nodeTemplateMap.add("DesiredEvent",
      $(go.Node, "Auto",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Shape, "RoundedRectangle",
          { fill: greengrad, portId: "", toLinkable: true, toEndSegmentLength: 50 }),
        $(go.TextBlock, "Success!", textStyle(),
          new go.Binding("text", "text").makeTwoWay())
        ));

    // Undesired events have a special adornment that allows adding additional "reasons"
    var UndesiredEventAdornment =
      $(go.Adornment, "Spot",
        $(go.Panel, "Auto",
          $(go.Shape, { fill: null, stroke: "dodgerblue", strokeWidth: 4 }),
          $(go.Placeholder)),
        // the button to create a "next" node, at the top-right corner
        $("Button",
          { alignment: go.Spot.BottomRight,
            click: addReason },  // this function is defined below
          new go.Binding("visible", "", function(a) { return !a.diagram.isReadOnly; }).ofObject(),
          $(go.Shape, "TriangleDown", { desiredSize: new go.Size(10, 10) })
        )
      );

    var reasonTemplate = $(go.Panel, "Horizontal",
      $(go.TextBlock, "Reason",
        {
          margin: new go.Margin(4,0,0,0),
          maxSize: new go.Size(200, NaN),
          wrap: go.TextBlock.WrapFit,
          stroke: "whitesmoke",
          editable: true,
          font: smallfont
        },
        new go.Binding("text", "text").makeTwoWay())
      );


    myDiagram.nodeTemplateMap.add("UndesiredEvent",
      $(go.Node, "Auto",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        { selectionAdornmentTemplate: UndesiredEventAdornment },
        $(go.Shape, "Rectangle",
          { fill: redgrad, portId: "", toLinkable: true, toEndSegmentLength: 50 }),
        $(go.TextBlock, "Error",
          { margin: 9,
            maxSize: new go.Size(200, NaN),
            wrap: go.TextBlock.WrapFit,
            editable: true,
            font: smallfont,
            stroke: "whitesmoke"},
          new go.Binding("text", "text").makeTwoWay())
        ));

    myDiagram.nodeTemplateMap.add("Comment",
      $(go.Node, "Auto",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Shape, "Rectangle",
          { portId: "", fill: whitegrad, fromLinkable: true }),
        $(go.TextBlock, "A comment",
          { margin: 9,
            maxSize: new go.Size(200, NaN),
            wrap: go.TextBlock.WrapFit,
            editable: true,
            font: smallfont },
          new go.Binding("text", "text").makeTwoWay())
        // no ports, because no links are allowed to connect with a comment
        ));

    // clicking the button on an UndesiredEvent node inserts a new text object into the panel
    function addReason(e, obj) {
      var adorn = obj.part;
      if (adorn === null) return;
      e.handled = true;
      var arr = adorn.adornedPart.data.reasonsList;
      myDiagram.startTransaction("add reason");
      myDiagram.model.addArrayItem(arr, {});
      myDiagram.commitTransaction("add reason");
    }
    
    // clicking the button of a default node inserts a new node to the right of the selected node,
    // and adds a link to that new node
    function addNodeAndLink(e, obj) {
      var adorn = obj.part;
      if (adorn === null) return;
      e.handled = true;
      var diagram = adorn.diagram;
      diagram.startTransaction("Add State");
      // get the node data for which the user clicked the button
      var fromNode = adorn.adornedPart;
      var fromData = fromNode.data;
      // create a new "State" data object, positioned off to the right of the adorned Node
      var toData = { text: "new" };
      var p = fromNode.location;
      toData.loc = p.x + 200 + " " + p.y;  // the "loc" property is a string, not a Point object
      // add the new node data to the model
      var model = diagram.model;
      model.addNodeData(toData);
      // create a link data from the old node data to the new node data
      var linkdata = {};
      linkdata[model.linkFromKeyProperty] = model.getKeyForNodeData(fromData);
      linkdata[model.linkToKeyProperty] = model.getKeyForNodeData(toData);
      linkdata.text = "Transition";
      // and add the link data to the model
      model.addLinkData(linkdata);
      // select the new Node
      var newnode = diagram.findNodeForData(toData);
      diagram.select(newnode);
      diagram.commitTransaction("Add State");
    }

    myDiagram.linkTemplate =
      $(go.Link,  // the whole link panel
        {
          curve: go.Link.Bezier, adjusting: go.Link.Stretch,
          reshapable: true, relinkableFrom: true, relinkableTo: true,
          toShortLength: 3
        },
        new go.Binding("points").makeTwoWay(),
        new go.Binding("curviness"),
        $(go.Shape,  // the link shape
          { strokeWidth: 1.5 }),
        $(go.Shape,  // the arrowhead
          { toArrow: "standard", stroke: null }),
        $(go.Panel, "Auto",
          $(go.Shape,  // the label background, which becomes transparent around the edges
            {
              fill: $(go.Brush, "Radial",
                      { 0: "rgb(240, 240, 240)", 0.3: "rgb(240, 240, 240)", 1: "rgba(240, 240, 240, 0)" }),
              stroke: null
            }),
          $(go.TextBlock, "Transition",  // the label text
            {
              textAlign: "center",
              font: "9pt helvetica, arial, sans-serif",
              margin: 4,
              editable: true  // enable in-place editing
            },
            // editing the text automatically updates the model data
            new go.Binding("text").makeTwoWay())
        )
      );

    myDiagram.linkTemplateMap.add("Comment",
      $(go.Link, { selectable: false },
        $(go.Shape, { strokeWidth: 2, stroke: "darkgreen" })));


    var palette =
      $(go.Palette, "palette",  // create a new Palette in the HTML DIV element "palette"
        {
          // share the template map with the Palette
          nodeTemplateMap: myDiagram.nodeTemplateMap,
          autoScale: go.Diagram.Uniform  // everything always fits in viewport
        });
    
    palette.model.nodeDataArray = [
      { category: "Source" },
      { }, // default node
      { category: "DesiredEvent" },
      { category: "UndesiredEvent", reasonsList: [{}] },
      { category: "Comment" }
    ];

    layout(myDiagram);
    
    return myDiagram;
}

function layout(diagram) {
    diagram.layoutDiagram(true);
}

function load(go, diagram, json) {
    diagram.model = go.Model.fromJson(json);
}
/* global angular */

angular
    .module('bemyapp-tech-env')
    .controller('WhiteboardController', WhiteboardController);

function WhiteboardController($scope, LoadWhiteboard, InitWhiteboard, Whiteboard, Session, _, go) {
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
            
            $scope.diagram = InitWhiteboard(go, 'myDiagramDiv');
            
            $scope.diagram.addModelChangedListener(function(e) {
                if (e.um === 'CommittedTransaction') {
                    fromHere();
                }
            });
            
            LoadWhiteboard(go, $scope.diagram, ctrl.whiteboard.datas || {});
            
            $scope.$watch('whiteboardCtrl.whiteboard', function() {
                fromInternet();
            }, true);
            
            watcher();
        }, true);
    }
    
    function fromInternet() {
        if (!_.isEqual(JSON.parse($scope.diagram.model.toJson()), ctrl.whiteboard.datas)) {
            LoadWhiteboard(go, $scope.diagram, ctrl.whiteboard.datas);
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
