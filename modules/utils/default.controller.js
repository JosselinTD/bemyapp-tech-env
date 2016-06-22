var _ = require('lodash');

module.exports = function(modelName, Model, socket, io) {
    socket.on('read:' + modelName, function(data) {
        Model.findAsync()
            .then(docs => socket.emit('readed:' + modelName, docs))
            .catch(onError);
    });
    
    socket.on('create:' + modelName, function(data) {
        Model.createAsync(data)
            .then(doc => io.emit('created:' + modelName, doc))
            .catch(onError);
    });
    
    socket.on('update:' + modelName, function(data) {
        var result;
        
        Model.findByIdAsync(data._id)
            .then(result => _.extend(result, data).saveAsync())
            .then(doc => io.emit('updated:' + modelName, doc))
            .catch(onError);
    });
    
    socket.on('remove:' + modelName, function(data) {
        Model.removeAsync({_id: data._id})
            .then(() => io.emit('removed:' + modelName, data._id))
            .catch(onError);
    })

    function onError(err) {
        console.error(err);
        socket.emit('error:' + modelName);
    }
}