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