'use strict';
(function() {

//https://github.com/danialfarid/ng-file-upload
var service = angular.module('sca-files', [ ]);
service.directive('scaFiles', 
['appconf', 'toaster', '$http', function(appconf, toaster, $http ) {
    return {
        restrict: 'E',
        scope: {
            resourceid: '=',
            path: '=',
            jwt: '=',
        }, 
        templateUrl: 'bower_components/sca-files/ui/files.html',
        link: function($scope, element) {
            $scope.appconf = appconf; 

            function load_files() {
                $http.get(appconf.sca_api+"/resource/ls", {
                    params: {
                        resource_id: $scope.resourceid,
                        path: $scope.path,
                    }
                })
                .then(function(res) {
                    $scope.files = res.data.files;
                    $scope.files.forEach(function(file) {
                        file.path = $scope.path+"/"+file.filename;
                    });
                }, function(res) {
                    if(res.data && res.data.message) toaster.error(res.data.message);
                    else toaster.error(res.statusText);
                });
            }

            $scope.$watch('resourceid', function() {
                console.log("resource id set to "+$scope.resourceid);
                if(!$scope.resourceid) return;
                load_files();
            });
        }
    };
}]);

service.filter('bytes', function() {
    return function(bytes, precision) {
        if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
        if (typeof precision === 'undefined') precision = 1;
        var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
            number = Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
    }
});

service.filter('encodeURI', function() {
  return window.encodeURIComponent;
});
    
//end of IIFE (immediately-invoked function expression)
})();


