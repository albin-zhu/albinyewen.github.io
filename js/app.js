'use strict';

/* App Module */

var phonecatApp = angular.module('phonecatApp', [
    'ngResource',
    'ngRoute',
    'ngAnimate',
    'ngSanitize',
    'ctrls',
    'servs',
    'wu.masonry',
    'ui.bootstrap'
    ]);

phonecatApp.config(['$routeProvider', '$sceDelegateProvider', function($routeProvider, $sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist(['**']);
    $routeProvider.
    when('/phones', {
        templateUrl: cdn_path + 'partials/phone-list.html',
        controller: 'PhoneListCtrl',
        title: 'test',
    }).
    when('/phones/:phoneId', {
        templateUrl: cdn_path + 'partials/phone-detail.html',
        controller: 'PhoneDetailCtrl',
        title: "test"
    }).
    when('/test', {
        templateUrl: cdn_path + 'partials/alert-demo.html',
        controller: 'AlertDemoCtrl',
        title: 'test'
    }).
    when('/index', {
        templateUrl: cdn_path + 'partials/welcome.html',
        controller: 'WelcomeCtrl'
    }).
    when('/orgs/:cat/:org', {
        templateUrl: cdn_path + 'partials/article.html',
        controller: 'ArticleCtrl'
    }).
    otherwise({
        redirectTo: '/index'
    });
}]);
