/* global angular */

angular
    .module('bemyapp-tech-env')
    .service('Videos', VideosService);

function VideosService(Socket) {
    var service = this;
    angular.extend(service, new Socket('videos'));
}
