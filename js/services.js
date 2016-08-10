'use strict';

/* Services */

var servs = angular.module('servs', ['ngResource']);


servs.factory('DataProxy', ['$resource', function($resource){
    // support http,https,etc.
    return $resource('data/:act.json', {}, {
        query: {method: 'GET', params:{act:'common'}, isArray:false}
    });
}]);
