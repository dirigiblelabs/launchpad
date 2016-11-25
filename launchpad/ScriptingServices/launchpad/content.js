/*eslint-env browser, jquery*/
/*globals angular*/

var app = angular.module('launchpad', [
	'ngRoute',
	'defaultControllers'
]);

var controllers = angular.module('defaultControllers', []);
 
app.config(/* @callback */ function($routeProvider) {

	/*globals $routeProvider */
	/*eslint-env jquery */

	$routeProvider.when('/home', {
		controller: 'HomeCtrl',
		templateUrl: 'templates/home/home.html'
    })
    // Inject Routes Here!!!
	.when('/develop', {controller: 'DevelopCtrl', templateUrl: 'templates/develop/develop.html'})
	.when('/workspace', {controller: 'WorkspaceCtrl', templateUrl: 'templates/workspace/workspace.html'})
	.when('/discover', {controller: 'DiscoverCtrl', templateUrl: 'templates/discover/discover.html'})
	.when('/scripting/command', {controller: 'CommandCtrl', templateUrl: 'templates/scripting/command/command.html'})
	.when('/integration/flow', {controller: 'FlowCtrl', templateUrl: 'templates/integration/flows/flows.html'})
	.when('/integration/job', {controller: 'JobCtrl', templateUrl: 'templates/integration/jobs/jobs.html'})
	.when('/scripting/javascript', {controller: 'JavaScriptCtrl', templateUrl: 'templates/scripting/javascript/javascript.html'})
	.when('/integration/listener', {controller: 'ListenerCtrl', templateUrl: 'templates/integration/listeners/listeners.html'})
	.when('/mobile', {controller: 'MobileCtrl', templateUrl: 'templates/mobile/mobile.html'})
	.when('/content', {controller: 'ContentCtrl', templateUrl: 'templates/content/content.html'})
	.when('/scripting/sql', {controller: 'SQLCtrl', templateUrl: 'templates/scripting/sql/sql.html'})
	.when('/scripting/tests', {controller: 'TestsCtrl', templateUrl: 'templates/scripting/tests/tests.html'})
	.when('/web/content', {controller: 'WebContentCtrl', templateUrl: 'templates/web/content/content.html'})
	.when('/web/wiki', {controller: 'WebWikiCtrl', templateUrl: 'templates/web/wiki/wiki.html'})
	.when('/monitoring', {controller: 'MonitoringCtrl', templateUrl: 'templates/monitoring/monitoring.html'})
	.when('/monitoring/manage', {controller: 'MonitoringManageCtrl', templateUrl: 'templates/monitoring/manage/manage.html'})
	.when('/monitoring/hits', {templateUrl: 'templates/monitoring/hits/hits.html'})
	.when('/monitoring/response', {templateUrl: 'templates/monitoring/response/response.html'})
	.when('/monitoring/memory', {templateUrl: 'templates/monitoring/memory/memory.html'})
	.when('/monitoring/acclog', {controller: 'MonitoringAccessCtrl', templateUrl: 'templates/monitoring/acclog/acclog.html'})
	.when('/monitoring/logging', {templateUrl: 'templates/monitoring/logging/logging.html'})
	.when('/monitoring/log-console', {templateUrl: 'templates/monitoring/logging/log-console.html'})
	.when('/monitoring/log', {templateUrl: 'templates/monitoring/logging/log.html'})
	.when('/operate', {controller: 'OperateCtrl', templateUrl: 'templates/operate/operate.html'})
	.when('/content/clone', {controller: 'CloneCtrl', templateUrl: 'templates/content/import/import.html'})
	.when('/content/cmis', {controller: 'explorerCtrl', templateUrl: 'templates/content/cmis/cmis.html'})
	.when('/content/project', {controller: 'ProjectCtrl', templateUrl: 'templates/content/import/import.html'})
	.when('/content/import', {controller: 'ImportCtrl', templateUrl: 'templates/content/import/import.html'})
    .otherwise({
    	redirectTo: '/home'
    });
});

// Inject Controllers Here!!!

controllers.controller('CommandCtrl', function($scope, $resource) {
  $scope.restService = $resource('../../scripting/command');
});

controllers.controller('MenuCtrl', ['$scope', '$http',
	function($scope, $http) {
		const API_MENU = '../../js/launchpad/api/menu.js';

		$http.get(API_MENU).success(function (data) {
			$scope.menu = data;
		});
	}
]);

controllers.controller('HomeCtrl', ['$scope', '$http',
	function($scope, $http) {
		const API_HOME = '../../js/launchpad/api/home.js';

		$http.get(API_HOME).success(function (data) {
			$scope.homeData = data;
		});
	}
]);