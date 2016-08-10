'use strict';

/* Controllers */

var ctrls = angular.module('ctrls', []);

ctrls.controller('PhoneListCtrl', ['$scope', 'Phone', function($scope, Phone) {
    $scope.phones = Phone.query();
    $scope.orderProp = 'age';
    $scope.title = "test";
}]);

ctrls.controller('PhoneDetailCtrl', ['$scope', '$routeParams', 'Phone', function($scope, $routeParams, Phone) {
    $scope.phone = Phone.get({phoneId: $routeParams.phoneId}, function(phone) {
        $scope.mainImageUrl = phone.images[0];
    });

    $scope.setImage = function(imageUrl) {
        $scope.mainImageUrl = imageUrl;
    };
}]);

ctrls.controller('AlertDemoCtrl', ['$scope', function($scope){
    $scope.alerts = [
        {type: "danger", msg: "Oh snap! Change a few things up and try submitting agagin!"},
        {type: "success", msg: "Well down! You successfully read this important aleart message."}
    ];

    $scope.addAlert = function() {
        $scope.alerts.push({msg: "Another alert!"});
    }

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    }
}]);

ctrls.controller('WelcomeCtrl', ['$scope', 'DataProxy', '$uibModal', function($scope, DataProxy, $uibModal) {
    $scope.active = 0;
    $scope.cdn_path = cdn_path;
    $scope.query = {};
    $scope.query.cat = "";
    $scope.query.tags = "";
    $scope.query.date = "";

    $scope.filter = "cat";
    $scope.changefilter = function(f){
        $scope.filter = f;
        $scope.query.cat = "";
        $scope.query.tags = "";
        $scope.query.date = "";
    }

    DataProxy.get({act:"carousel"}, function(carousel){
        $scope.slides = carousel.slides;
        $scope.myInterval = 5000;
        $scope.noWrapSlides = false;
        $scope.active = 0;
        $scope.whatido = carousel.whatido;
        
    });

    DataProxy.get({act:"data"}, function(data){
        $scope.articles = data.articles;
        $scope.dp = {
            cat: data.cats,
            tags: data.tags,
            date:  data.years
        };

         $scope.orgs = data.orgs;
         
    });


    $scope.open = function(data) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: cdn_path + "partials/preview.html",
            controller: "ModalCtrl",
            resolve: {
                items: function () {
                    return data;
                }
            }
        });
    }
  
    setTimeout(on_ng_ready, 1000);
}]);


ctrls.controller('ModalCtrl', ['$scope', 'items', function($scope, items){
    $scope.item = items;
    $scope.cdn_path = cdn_path;
    setTimeout(function(){
                $('.screen.flexslider').flexslider({
                    prevText: '<i class="fa fa-angle-left"></i>',
                    nextText: '<i class="fa fa-angle-right"></i>',
                    slideshowSpeed: 3000,
                    animation: 'slide',
                    controlNav: false,
                    pauseOnAction: false, 
                    pauseOnHover: true,
                    start: function(){
                        $('#project-modal .screen')
                        .addClass('done')
                        .prev('.loader').fadeOut();
                    }
                });
            },1000);
}])

ctrls.controller('ArticleCtrl', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http){
    $scope.uri = cdn_path + 'orgs/' + $routeParams.cat + '/';
    $http({
        method: 'GET',
        url: cdn_path + 'orgs/' + $routeParams.cat + '/' + $routeParams.org
    }).then(function successCallback(code) {
        var orgParser = new Org.Parser();
        try {
            var doc = orgParser.parse(code.data);
            $("#result").html(doc.convert(Org.ConverterHTML, {
                translateSymbolArrow: true,
                uri: $scope.uri
            }).toString());
            prettyPrint();
        } catch (x) {
           $("#result").html(x);
        }
        on_ng_ready();
        document.title += ' | ' + doc.title;
    }, function errorCallback(response) {
        $scope.org = response;
    });
}])
