angular.module('ngApp')
.config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider) {
    $routeProvider.when('/first', {
        template: '<h1>this is the #/first hashtag route</h1>',
//     }).when('/ats', {
//         // template: "<h1>{{notice}}</h1><h3>click browser's <b>&larr;</b> arrow to go back</h3>",
//         templateUrl: 'ats.html',
//         controller : 'atsController'
    }).when('/fileUpload', {
        templateUrl : 'fileUpload.html',
        controller  : 'uploadController'
    }).when('/deleteDoc', {
        templateUrl : 'deleteDoc.html',
        controller  : 'deleteDocController'
    }).otherwise({ redirectTo: '/'});

    $locationProvider.hashPrefix('');
}]);
