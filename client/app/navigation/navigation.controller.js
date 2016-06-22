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
    ctrl.logout = logout;
    
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
    
    function logout() {
        Session.unset();
    }
}