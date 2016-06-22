/* global angular, localStorage */

angular
    .module('bemyapp-tech-env')
    .service('Session', SessionService);

function SessionService(Socket, $rootScope) {
    var service = this;
    angular.extend(service, new Socket('session'));
    
    service.current = {};
    
    service.set = setCurrent;
    service.unset = unsetCurrent;
    service.hasSession = hasSession;
    service.goTo = goTo;
    
    $rootScope.$on('readed:session', readed);
    
    // /////////////////////////////////////////
    
    function setCurrent(name) {
        var exist = service.read({name: name});
        if (exist) {
            localStorage.setItem('session', name);
            return service.current = exist;
        }
        service.create({name: name});
    }
    
    function unsetCurrent() {
        localStorage.removeItem('session');
        service.current = {};
    }
    
    function hasSession() {
        return !!service.current.name;
    }
    
    function goTo(navigation) {
        if (service.hasSession()) {
            service.update(angular.extend({}, service.current, {navigation: navigation}));
        }
    }
    
    function readed() {
        var storedSession = localStorage.getItem('session');
        if (storedSession) {
            setCurrent(storedSession);
        }
    }
}
