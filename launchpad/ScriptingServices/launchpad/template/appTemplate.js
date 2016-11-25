/*eslint-env browser, jquery*/
/*globals angular*/

var app = angular.module('launchpad', ['ngRoute', 'defaultControllers']);

var controllers = angular.module('defaultControllers', []);
 
app.config(function($routeProvider) {

	$routeProvider
${routes}
.otherwise({
	redirectTo: '/home'
});
});

${controllers}
