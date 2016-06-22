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