/*eslint-env browser, jquery*/
/*globals angular*/

var app = angular.module('launchpad', ['ngRoute', 'defaultServices', 'workspaceServices',
  'menuControllers', 'defaultControllers', 'workspaceControllers', 'angularFileUpload'
]);

angular.module('workspaceServices', ['ngResource']).factory('FilesSearch', ['$resource', function($resource) {
	return $resource('../searchw');
}]);

var defaultServices = angular.module('defaultServices', ['ngResource']);
var controllers = angular.module('defaultControllers', []);
var menuControllers = angular.module('menuControllers', []);
var workspaceControllers = angular.module('workspaceControllers', []);

defaultServices.factory('FilesSearch', ['$resource',
  function($resource) {
    return $resource('../search');
  }
]);

controllers.controller('DefaultListCtrl', ['$scope', '$sce', 'FilesSearch',

  function($scope, $sce, FilesSearch) {
    /*    if (!$routeParams.pathName) {
      $routeParams.pathName = 'content';
    }*/
    var backupRoot;
    var timeOutDelay;

    $scope.caseSensitive = false;
    $scope.mainError = undefined;
    $scope.searchError = undefined;
    $scope.search = undefined;

    if ($scope.objectContent) {
      $scope.restService.get({}, function(data) {
        $scope.mainError = undefined;
        backupRoot = $scope.selected = data;
        $scope.paths = [data];
      }, onError);
    } else {
      $scope.restService.query({}, onArrayQuery, onError);
    }

    $scope.change = function(newData) {
      if (!newData.folder) {
        $scope.iframeSrc = newData.path;
      } else if (newData.files) {
        $scope.selected = newData;
        $scope.paths.push(newData);
      }
    };

    $scope.copyFile = function(file) {
      window.prompt("Copy to clipboard: Ctrl+C, Enter", file.path);
    };

    $scope.crumbsChanged = function(path) {
      var inx = this.paths.indexOf(path);
      $scope.paths.splice(inx + 1);
      $scope.selected = this.paths[inx];
    };

    $scope.securedUrl = function(src) {
      return $sce.trustAsResourceUrl(src);
    };

    $scope.$watch('search', function(newVal, oldVal) {
      if (!oldVal) {
        return;
      }
      if (!newVal) {
        $scope.searchError = undefined;
        $scope.selected = backupRoot;
        return;
      }
      clearTimeout(timeOutDelay);
      timeOutDelay = setTimeout(function() {
        FilesSearch.query({
          q: newVal
        }, onArrayQuery, function(er) {
          $scope.searchError = er;
        });
      }, 300);
    });

    function onArrayQuery(data) {
      $scope.searchError = undefined;
      $scope.paths = undefined;
      $scope.selected = {
        files: data
      };
    }

    function onError(er) {
      $scope.mainError = er;
    }
  }
]);

controllers.controller('MonitoringAccessCtrl', function($scope, $resource) {
  $resource('../../acclog').query({}, function(data) {
    $scope.logs = data;
  });
});

menuControllers.controller('UserCtrl', ['$scope', '$http',
	function($scope, $http) {
		$scope.name = "Unknown";
		$http.get('../../op?user').success(function(data) {
			$scope.name = data;
		});
	}
]);
/*globals launchpad */
/*eslint-env jquery */

app.config(/* @callback */ function($routeProvider) {

	/*globals $routeProvider */
	/*eslint-env jquery */

	$routeProvider.when('/home', {
      controller: 'HomeCtrl',
      templateUrl: 'templates/home/home.html'
    })
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
    });});/*globals launchpad */

app.controller('CloneCtrl', function($scope, FileUploader) {
	$scope.pageHeader = 'Import Cloned Content';
  	$scope.exportTitle = 'Export Cloned Content';
  	$scope.exportUrl = '../../clone-export';
  	$scope.exportButtonText = 'Download Zipped Cloned Content';
  	$scope.overrideContent = false;

  	var uploader = $scope.uploader = new FileUploader({
    	url: '../../clone-import?reset=false'
  	});

  	$scope.$watch('overrideContent', function (newVal) {
    	$scope.uploader.url = '../clone-import?reset=' + newVal;
    	for (var i=0; i<$scope.uploader.queue.length; i++) {
      		$scope.uploader.queue[i].url = $scope.uploader.url;
    	}
  	});

  	uploader.filters.push({
    	name: 'onlyZip',
    	fn: function(item) {
    	  	return item.name.lastIndexOf('.zip') === item.name.length - 4;
    	}
  	});
});

/*eslint-env node, browser, jquery*/
/*globals angular mKeyBinding*/

workspaceControllers.controller('WorkspaceListCtrl', ['$scope', '$sce', 'FilesSearch', '$http', function($scope, $sce, FilesSearch, $http) {

    var backupRoot;
    var timeOutDelay;

    $scope.caseSensitive = false;
    $scope.mainError = undefined;
    $scope.searchError = undefined;
    $scope.search = undefined;

    $scope.mapping = {
    		"application/javascript": ["js"],
			"application/json": ["json", "odata", "ws", "table", "view", "entity", "menu", "access", "extensionpoint", "extension", "command", "flow", "job", "listener"],
			"application/xml": ["xml", "xsd", "wsdl", "xsl", "xslt", "routes"],
			"text/html": ["html"],
			"text/x-java-source": ["java"],
			"text/css": ["css"],
			"text/plain": ["txt"]
	};

    if ($scope.objectContent) {
    	$scope.restService.get({}, function(data) {
    		$scope.mainError = undefined;
    		backupRoot = $scope.selected = data;
    		$scope.paths = [data];
    	}, onError);
    } else {
    	$scope.restService.query({}, onArrayQuery, onError);
    }

    var codeEdit = null;
    require.config({waitSeconds: 0});
    require(["orion/code_edit/built-codeEdit.min", "orion/keyBinding"], function(widget, mKeyBinding) {
        codeEdit = new widget();
    });

    $scope.change = function(newData) {
    	if (!newData.folder) {
    		$http.get(newData.path, {
    			transformResponse: [function (data) {
    				return data;
    			}]
    		}).success(function(response) {
    			setText(response, $scope.getModeModule(newData.path));
        		$scope.path = newData.path;
    		}).error(function(response) {
    			$scope.mainError = "Error loading " + newData.path;
    		});
    	} else if (newData.files) {
    		$scope.selected = newData;
    		if (!$scope.paths) {
    			$scope.paths = [backupRoot];
    		}
    		$scope.paths.push(newData);
    		$scope.editor = null;
    	}
    };

    $scope.getModeModule = function(resourcePath) {
    	var m = resourcePath.match(/(.*)[\/\\]([^\/\\]+)\.(\w+)$/);
		var extension = m && m.length>3 && m[3] ? m[3] : "txt";

		var modules = Object.keys($scope.mapping);
		for (var i in modules) {
			if ($scope.mapping[modules[i]].indexOf(extension) > -1) {
				return modules[i];
			}
		} 
		return "text";
    };

    $scope.copyFile = function(file) {
      window.prompt("Copy to clipboard: Ctrl+C, Enter", file.path);
    };

    $scope.crumbsChanged = function(path) {
    	var inx = this.paths.indexOf(path);
    	$scope.paths.splice(inx + 1);
    	$scope.selected = this.paths[inx];
    	$scope.editor = null;
    };

    $scope.securedUrl = function(src) {
    	return $sce.trustAsResourceUrl(src);
    };

    $scope.$watch('search', function(newVal, oldVal) {
    	if (oldVal && newVal) {
    		clearTimeout(timeOutDelay);
    		timeOutDelay = setTimeout(function() {
    			FilesSearch.query({
    				q: newVal
    			}, onArrayQuery, function(er) {
    				$scope.searchError = er;
    			});
    		}, 300);
    	} else if (!newVal) {
    		$scope.searchError = undefined;
    		$scope.selected = backupRoot;
    	}
	});

    $scope.saveCalled = function() {
    	$http.put($scope.path, getText()).success(function(response) {
    		onSuccess("Save of " + $scope.path + " passed successfully");
    	}).error(function(response) {
			onError("Error saving " + $scope.path + "\n" + response);
    	});
    };

    $scope.publishCalled = function() {
    	$http.put($scope.path, getText()).success(function(response) {
    		onSuccess("Save of " + $scope.path + " passed successfully");

    		var publishPath = $scope.path;
    		publishPath = publishPath.replace("/workspace", "/publish");

    		$http.post(publishPath).success(function(response) {
        		onSuccess("Publish of " + publishPath + " passed successfully");
    		}).error(function(response) {
    			onError("Error publishing " + publishPath + "\n" + response);
    		});
    	}).error(function(response) {
    		onError("Error saving " + $scope.path + "\n" + response);
    	});
    };
    
    $scope.newFile = function() {
    	var fileName = prompt("Please enter the full path of the new file", $scope.selected.path);

    	if (fileName != null) {
    		$scope.path = fileName;
	    	$http.put($scope.path, "").success(function(response) {
	    		onSuccess("Save of " + $scope.path + " passed successfully");
	    	}).error(function(response) {
				onError("Error saving " + $scope.path + "\n" + response);
	    	});
    	}
    };
    

    function onArrayQuery(data) {
    	$scope.searchError = undefined;
    	$scope.paths = undefined;
    	$scope.selected = {
    			files: data
    	};
    }

    function onSuccess(message) {
    	console.log(message);
    	$scope.successfullMessage = message;
    	$scope.mainError = null;
//    	$("#successMessageAlert").fadeIn();
//    	setTimeout(function() {
//    		$("#successMessageAlert").fadeOut();
//    	}, 1500);
    	dirtyChanged(false);
    	$.notify({message: $scope.successfullMessage}, {type: "success"});
    }

    function onError(error) {
    	console.error(error);
    	$scope.successfullMessage = null;
    	$scope.mainError = error;
    	$.notify({message: $scope.mainError = error}, {type: "danger"});
    }

    function createEditor(content, contentType) {
    	
        $scope.editor = {};
        codeEdit.create({
        	parent: "editor",
        	contentType: contentType,
        	contents: content
        }).then(function(editorViewer) {
        	$scope.editor = editorViewer.editor;
        	var savedText = content;
        	var isDirty = false;
        	$scope.editor.getTextView().setKeyBinding(new mKeyBinding.KeyBinding("s", true), "save");
        	$scope.editor.getTextView().setKeyBinding(new mKeyBinding.KeyBinding("p", true), "toggleZoomRuler");

        	editorViewer.editor.getTextView().setAction("save", function(){ //$NON-NLS-0$
        		isDirty = false;
        		$scope.saveCalled();
        		return true;
        	});

        	editorViewer.editor.getTextView().setAction("toggleZoomRuler", function(){ //$NON-NLS-0$
        		isDirty = false;
        		$scope.publishCalled();
        		return true;
        	});

        	$scope.editor.addEventListener("DirtyChanged", function(event) {
        		var newText = $scope.editor.getText();
        		if (savedText !== newText && !isDirty) {
        			isDirty = true;
        			dirtyChanged(true);
        		} else if (savedText === newText && isDirty) {
        			isDirty = false;
        			dirtyChanged(false);
        		}
        	});

	        // explicitly set the read only mode for empty files
	        $scope.editor.getTextView()._readonly = false;
        });
    
    }

    function getText() {
        return $scope.editor.getText();
    }

    function setText(text, mode) {
    	createEditor(text, mode);
    }

    function dirtyChanged(value) {
    	$scope.isDirty = value;
    }
    
    $scope.isFullscreen = false;
    
    $scope.toggleFullscreen = function() {
      $scope.isFullscreen=!$scope.isFullscreen;
    }
}]);

workspaceControllers.controller('WorkspaceCtrl', function($scope, $resource) {
  $scope.objectContent = true;
  $scope.restService = $resource('../../workspace');
});

/*globals controllers */

controllers.controller('CommandCtrl', function($scope, $resource) {
  $scope.restService = $resource('../../scripting/command');
});
/*globals controllers */

controllers.controller('FlowCtrl', function($scope, $resource) {
  $scope.restService = $resource('../../flow/flow');
});
/*globals controllers */

controllers.controller('JobCtrl', function($scope, $resource) {
  $scope.restService = $resource('../../flow/job');
});
/*globals controllers */

controllers.controller('JavaScriptCtrl', function($scope, $resource) {
  $scope.restService = $resource('../../scripting/javascript');
});
/*globals controllers */

controllers.controller('ListenerCtrl', function($scope, $resource) {
  $scope.restService = $resource('../../flow/listener');
});
/*globals controllers */

controllers.controller('MobileCtrl', function($scope, $resource) {
  $scope.objectContent = true;
  $scope.restService = $resource('../../mobile');
});
/*globals controllers */

controllers.controller('ContentCtrl', function($scope, $resource) {
  $scope.objectContent = true;
  $scope.restService = $resource('../../content');
});
/*globals controllers */

controllers.controller('SQLCtrl', function($scope, $resource) {
  $scope.restService = $resource('../../scripting/sql');
});
/*globals controllers */

controllers.controller('TestsCtrl', function($scope, $resource) {
  $scope.restService = $resource('../../scripting/tests');
});

controllers.controller('WebContentCtrl', function($scope, $resource) {
  $scope.objectContent = true;
  $scope.restService = $resource('../../web');
});

controllers.controller('WebWikiCtrl', function($scope, $resource) {
  $scope.objectContent = true;
  $scope.restService = $resource('../../wiki');
});

app.controller('ImportCtrl', function($scope, FileUploader) {
	$scope.pageHeader = 'Import Registry Content';
  	$scope.exportTitle = 'Export Registry Content';
  	$scope.exportUrl = '../../export';
  	$scope.exportButtonText = 'Download Zipped Registry Content';
  	$scope.overrideContent = false;

  	$scope.uploader = new FileUploader({
  		url: '../../import?override=false'
  	});

	$scope.$watch('overrideContent', function (newVal) {
    	$scope.uploader.url = '../../import?override=' + newVal;
    	for (var i=0; i<$scope.uploader.queue.length; i++) {
    	  	$scope.uploader.queue[i].url = $scope.uploader.url;
    	}
  	});

  	$scope.uploader.filters.push({
    	name: 'onlyZip',
    	fn: function(item) {
      		return item.name.lastIndexOf(".zip") === item.name.length - 4;
    	}
  	});
});

menuControllers.controller('DevelopCtrl', ['$scope', '$http',
	function($scope, $http) {
		$scope.descriptionInfoItems = [];
		$scope.developData = [];

		loadDescriptions();

		function loadDescriptions() {
			$http.get('../../js/registry/data/develop/data.js').success(function(data){
				for (var i = 0 ; i < data.length; i++) {
					$scope.descriptionInfoItems.push(data[i].data);
				}
			});
		}

$scope.developData.push({image:"laptop", color:"blue", path:"../../index.html", title:"Web IDE", description:"Development Toolkit", newTab:true});
$scope.developData.push({image:"mobile", color:"lblue", path:"#/workspace", title:"Light IDE", description:"Lightweight Development"});
$scope.developData.push({image:"desktop", color:"lila", path:"http://download.eclipse.org/dirigible/drops/M20160119-1919/p2/rcp/", title:"Desktop IDE", description:"Eclipse Plugins"});
	}
]);

/*globals menuControllers */
/*eslint-env browser */

menuControllers.controller('DiscoverCtrl', ['$scope', '$http',
	function($scope, $http) {
		$scope.descriptionInfoItems = [];
		$scope.discoverData = [];

		loadDescriptions();

		function loadDescriptions() {
			$http.get('../../js/registry/data/discover/data.js').success(function(data){
				for (var i = 0 ; i < data.length; i++) {
					$scope.descriptionInfoItems.push(data[i].data);
				}
			});
		}
$scope.discoverData.push({image:"search", color:"blue", path:"#/content", title:"Registry", description:"Browse Registry Content"});
$scope.discoverData.push({image:"globe", color:"yellow", path:"#/web/content", title:"Web", description:"Browse User Interfaces"});
$scope.discoverData.push({image:"book", color:"yellow", path:"#/web/wiki", title:"Wiki", description:"Browse Documentation"});
$scope.discoverData.push({image:"mobile-phone", color:"lila", path:"#/mobile", title:"Mobile", description:"Native Mobile Apps"});
$scope.discoverData.push({image:"file-code-o", color:"lblue", path:"#/scripting/javascript", title:"JavaScript", description:"JavaScript Services"});
$scope.discoverData.push({image:"database", color:"lblue", path:"#/scripting/sql", title:"SQL", description:"SQL Services"});
$scope.discoverData.push({image:"gear", color:"lblue", path:"#/scripting/command", title:"Command", description:"Command Services"});
$scope.discoverData.push({image:"cogs", color:"red", path:"#/scripting/tests", title:"Tests", description:"Test Cases"});
$scope.discoverData.push({image:"caret-square-o-right", color:"orange", path:"#/integration/flow", title:"Flows", description:"Integration Flows"});
$scope.discoverData.push({image:"tasks", color:"orange", path:"#/integration/job", title:"Jobs", description:"Integration Jobs"});
$scope.discoverData.push({image:"deaf", color:"orange", path:"#/integration/listener", title:"Listeners", description:"Integration Listeners"});
	}
]);

menuControllers.controller('MonitoringCtrl', ['$scope', '$http',
	function($scope, $http) {
		$scope.descriptionInfoItems = [];
		$scope.monitoringData = [{
			image: 'wrench',
			color: 'blue',
			path: '#/monitoring/manage',
			title: 'Configure',
			description: 'Configure locations'
		}, {
			image: 'bar-chart',
			color: 'green',
			path: '#/monitoring/hits',
			title: 'Hits',
			description: 'Hit count statistics'
		}, {
			image: 'hourglass-o',
			color: 'orange',
			path: '#/monitoring/response',
			title: 'Response',
			description: 'Response time statistics'
		}, {
			image: 'line-chart',
			color: 'red',
			path: '#/monitoring/memory',
			title: 'Memory',
			description: 'Memory statistics'
		}, {
			image: 'ticket',
			color: 'purple',
			path: '#/monitoring/acclog',
			title: 'Access Log',
			description: 'Access Log'
		}, {
			image: 'search',
			color: 'lblue',
			path: '#/monitoring/logging',
			title: 'Apps Log',
			description: 'Applications Log'
		}, {  
		   image:'film',
		   color:'lila',
		   path:'#/monitoring/log-console',
		   title:'Log Console',
		   description:'Real-time Logs'
		}];

		loadDescriptions();
	
		function loadDescriptions() {
			$http.get('../../js/registry/data/monitor/data.js').success(function(data){
				for (var i = 0 ; i < data.length; i++) {
					$scope.descriptionInfoItems.push(data[i].data);
				}
			});
		}
	}
]);

menuControllers.controller('MonitoringManageCtrl', ['$scope', '$http',
	function($scope, $http) {
		var accessLogUrl = "../../acclog";
		$scope.locations = null;
		$scope.newLocation;

		loadData();

		function loadData() {
			$http.get(accessLogUrl + "/locations").success(function(result) {
				$scope.locations = result;
			}).error(function() {
				alert('Could not fetch access log data!');
			});
		}

		$scope.remove = function(removeLocation) {
			$http.delete(accessLogUrl + removeLocation).success(function() {
				loadData();
			}).error(function() {
				alert('Error while removing location!');
			});
		};

		$scope.addNewLocation = function() {
			$http.post(accessLogUrl + $scope.newLocation).success(function() {
				loadData();
			}).error(function() {
				alert('Unable to add location ' + '"' + $scope.newLocation + '"'
				+ '\nLocation must be in "project/index.html" format!');
      });
    };
  }
]);

/*globals menuControllers */
/*eslint-env browser */

menuControllers.controller('OperateCtrl', ['$scope', '$http',
	function($scope, $http) {
		$scope.descriptionInfoItems = [];
		$scope.operateData = [];

		loadDescriptions();
	
		function loadDescriptions() {
			$http.get('../../js/registry/data/operate/data.js').success(function(data){
				for (var i = 0 ; i < data.length; i++) {
					$scope.descriptionInfoItems.push(data[i].data);
				}
			});
		}
$scope.operateData.push({image:"truck", color:"blue", path:"#/content/import", title:"Transport", description:"Transport Registry"});
$scope.operateData.push({image:"toggle-on", color:"green", path:"#/content/clone", title:"Clone", description:"Clone Instance"});
$scope.operateData.push({image:"sign-in", color:"yellow", path:"#/content/project", title:"Import", description:"Import Project"});
$scope.operateData.push({image:"book", color:"red", path:"#/content/cmis", title:"Documents", description:"Manage Documents"});
	}
]);

app.controller('explorerCtrl', ['$scope', '$http', 'FileUploader', function($scope, $http, FileUploader) {
	var folderUrl = '../../js-secured/ext_registry_cmis_explorer/folder.js';
	$scope.paths = [];
	$scope.docsUrl = '../../js-secured/ext_registry_cmis_explorer/document.js';
	
	function getFolder(folderId){
		var requestUrl = folderUrl;
		if(folderId != null){
			requestUrl += '?id=' + folderId;
		}
		
		return $http.get(requestUrl);
	};
	
	function addFolderToPaths(folder){
		var nextIndex = $scope.paths.length;
		$scope.paths.push({index: nextIndex, name: folder.name, id: folder.id});
	}
	
	function refreshFolder(){
		getFolder($scope.folder.id)
		.success(function(data){
			$scope.folder = data;
		});
	}
	
	function setUploaderFolder(folderId){
		$scope.uploader.url = $scope.docsUrl + '?id=' + folderId;
	}
	
	function setCurrentFolder(folderData){
		$scope.folder = folderData;
		setUploaderFolder($scope.folder.id);
	};
	
	function openErrorModal(titleText, bodyText){
		$("#errorModal .modal-header #title-text").text(titleText);
     	$("#errorModal .modal-body #body-text").text(bodyText);
     	$('#errorModal').modal('show');
	};
	
	getFolder()
	.success(function(data){
		setCurrentFolder(data);
		addFolderToPaths(data);
	});
	
	$scope.handleExplorerClick = function(cmisObject){
		if (cmisObject.type === "cmis:folder" && !$scope.inDeleteSession){
			getFolder(cmisObject.id)
			.success(function(data){
				setCurrentFolder(data);
				addFolderToPaths(data);
			});
		}
	};
	
	$scope.crumbsChanged = function(path){
		getFolder(path.id)
		.success(function(data){
			setCurrentFolder(data);
			$scope.paths.splice(path.index + 1);
		});
	};
	
	$scope.createFolder = function(newFolderName){
		var postData = { parentFolderId: $scope.folder.id, name: newFolderName };
		$http.post(folderUrl, postData)
		.success(function(){
			$scope.newFolderName = undefined;
			$('#newFolderModal').modal('hide');
			refreshFolder();
		})
		.error(function(data){
			$('#newFolderModal').modal('hide');
			openErrorModal("Failed to create folder", data.err.message);
		});
	};
	
	$scope.enterDeleteSession = function(){
		$scope.inDeleteSession = true; 
	};
	
	$scope.exitDeleteSession = function(){
		$scope.inDeleteSession = false;
	};
	
	$scope.deleteItems = function(){
		var idsToDelete = []
		for (var i in $scope.itemsToDelete)
			idsToDelete.push($scope.itemsToDelete[i].id);
		
		$http({ url: $scope.docsUrl, 
                method: 'DELETE', 
                data: idsToDelete, 
                headers: {"Content-Type": "application/json;charset=utf-8"}
        }).success(function() {
            $scope.inDeleteSession = false;
            refreshFolder();
        }).error(function(error) {
        	$scope.inDeleteSession = false;
            openErrorModal("Failed to delete items", error.err.message);
        });
	
		$scope.inDeleteSession = false;
	};
	
	$scope.handleSingleDelete = function($event, item){
		$event.stopPropagation();
		$scope.itemsToDelete = [item];
		$('#confirmDeleteModal').modal('show');
	};
	
	$scope.handleDeleteButton = function(){
		var itemsToDelete = [];
		for (var i in $scope.folder.children)
			if ($scope.folder.children[i].selected === true)
				itemsToDelete.push({name: $scope.folder.children[i].name, id: $scope.folder.children[i].id});
				
		if (itemsToDelete.length > 0){
			$scope.itemsToDelete = itemsToDelete;
			$('#confirmDeleteModal').modal('show');		
		} else {
			$scope.inDeleteSession = false;
		}
	};
	
	$scope.handleRenameButton = function($event, item){
		$event.stopPropagation();
		$scope.itemToRename = item;
		$('#renameModal').modal('show');
	};
	
	$scope.renameItem = function(itemId, newName){
		$http({ url: $scope.docsUrl, 
                method: 'PUT', 
                data: {id: itemId, name: newName }, 
                headers: {"Content-Type": "application/json;charset=utf-8"}
        }).success(function() {
        	$('#renameModal').modal('hide');
            refreshFolder();
        }).error(function(error) {
        	$('#renameModal').modal('hide');
        	var title = "Failed to rename item" + $scope.itemToDelete.name;
            openErrorModal(title, error.err.message);
        });
	}
	
	$scope.hoverIn = function(){
        this.hoverEdit = true;
    };

    $scope.hoverOut = function(){
        this.hoverEdit = false;
    };
	
	// FILE UPLOADER
	
    var uploader = $scope.uploader = new FileUploader({
        url: '../../js-secured/ext_registry_cmis_explorer/document'
    });

    // UPLOADER FILTERS

    uploader.filters.push({
        name: 'customFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            return this.queue.length < 10;
        }
    });

    // UPLOADER CALLBACKS

    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
//        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function(fileItem) {
//        console.info('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function(addedFileItems) {
//        console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function(item) {
//        console.info('onBeforeUploadItem', item);
    };
    uploader.onProgressItem = function(fileItem, progress) {
//        console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function(progress) {
//        console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
//        console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = function(fileItem, response, status, headers) {
//        console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function(fileItem, response, status, headers) {
//        console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
    	refreshFolder();
//        console.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onCompleteAll = function() {
//        console.info('onCompleteAll');
    };

//    console.info('uploader', uploader);
}]);

/*globals launchpad */

app.controller('ProjectCtrl', function($scope, FileUploader) {
	$scope.pageHeader = 'Import Project Content';
	$scope.overrideContent = false;

	var uploader = $scope.uploader = new FileUploader({
		url: '../../project-import?reset=false'
	});

	$scope.$watch('overrideContent', function (newVal) {
		$scope.uploader.url = '../../project-import?reset=' + newVal;
		for (var i=0; i<$scope.uploader.queue.length; i++) {
			$scope.uploader.queue[i].url = $scope.uploader.url;
		}
	});

	uploader.filters.push({
		name: 'onlyZip',
		fn: function(item) {
			return item.name.lastIndexOf('.zip') === item.name.length - 4;
		}
	});
});

menuControllers.controller('MenuCtrl', ['$scope', '$http',
	function($scope) {
		$scope.menus = [];
$scope.menus.push({name:"Develop", link:"#/develop"});
$scope.menus.push({name:"Discover", link:"#/discover"});
$scope.menus.push({name:"Operate", link:"#/operate"});
$scope.menus.push({name:"Monitor", link:"#/monitoring"});
$scope.menus.push({name:"Help", subMenu:[{name:"Help Contents", link:"http://help.dirigible.io"}, {name:"Samples", link:"http://samples.dirigible.io"}, {name:"Forum", link:"http://forum.dirigible.io"}, {name:"Bugzilla", link:"http://bugs.dirigible.io"}, {name:"Mailing List", link:"http://mail.dirigible.io"}, {name:"About", link:"http://www.dirigible.io"}]});
	}
]);

menuControllers.controller('HomeCtrl', ['$scope', '$http',
	function($scope, $http) {
		$scope.descriptionInfoItems = [];
		$scope.homeData = [];

		loadDescriptions();

		function loadDescriptions() {
			$http.get('../../js/registry/data/home/data.js').success(function(data){
				for (var i = 0 ; i < data.length; i++) {
					$scope.descriptionInfoItems.push(data[i].data);
				}
			});

		};

$scope.homeData.push({image:"edit", color:"blue", path:"#/develop", title:"Develop", description:"Development Toolkits", newTab:true});
$scope.homeData.push({image:"search", color:"green", path:"#/discover", title:"Discover", description:"Service Endpoints"});
$scope.homeData.push({image:"wrench", color:"orange", path:"#/operate", title:"Operate", description:"Lifecycle Management"});
$scope.homeData.push({image:"area-chart", color:"red", path:"#/monitoring", title:"Monitor", description:"Basic Metrics"});
	}
]);
