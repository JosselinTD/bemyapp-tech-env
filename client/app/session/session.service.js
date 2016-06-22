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
