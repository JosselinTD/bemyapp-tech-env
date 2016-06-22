/* global angular, initGoJSBPMN, goLoadJSON */

angular
    .module('bemyapp-tech-env')
    .constant('InitWhiteboard', initGoJSBPMN)
    .constant('LoadWhiteboard', goLoadJSON);