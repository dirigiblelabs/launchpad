/* globals $ */
/* eslint-env node, dirigible */

const EXT_POINT_NAME = '/launchpad/extension_point/launchpad';

var extensions = require('core/extensions');

exports.getMenu = function() {
	var menu = [];
	var launchpadExtensions = getLaunchpadExtensions();
	for (var i = 0; i < launchpadExtensions.length; i ++) {
		if (isFunction(launchpadExtensions[i].getMenuItem)) {
			menu.push(launchpadExtensions[i].getMenuItem());
		}
	}
	return menu;
};

exports.getHomeData = function() {
	var homeData = [];
	var launchpadExtensions = getLaunchpadExtensions();
	for (var i = 0; i < launchpadExtensions.length; i ++) {
		if (isFunction(launchpadExtensions[i].getHomeItem)) {
			homeData.push(launchpadExtensions[i].getHomeItem());
		}
	}
	return homeData;
};

exports.getRoutes = function() {
	var routes = '';
	var launchpadExtensions = getLaunchpadExtensions();
	for (var i = 0; i < launchpadExtensions.length; i ++) {
		if (isFunction(launchpadExtensions[i].getRoute)) {
			routes += createRoute(launchpadExtensions[i].getRoute()) + '\n';
		}
	}
	return routes;
};

exports.getControllers = function() {
	var controllers = '';
	var launchpadExtensions = getLaunchpadExtensions();
	for (var i = 0; i < launchpadExtensions.length; i ++) {
		if (isFunction(launchpadExtensions[i].getController)) {
			controllers += launchpadExtensions[i].getController() + '\n';
		}
	}
	return controllers;
};


function getLaunchpadExtensions() {
	var launchpadExtensions = [];
	var extensionNames = extensions.getExtensions(EXT_POINT_NAME);
	for (var i = 0; i < extensionNames.length; i ++) {
		var extension = extensions.getExtension(extensionNames[i], EXT_POINT_NAME);
		launchpadExtensions.push(require(extension.getLocation()));
	}
	return launchpadExtensions;
}

function isFunction(f) {
	return typeof f === 'function';
}

function createRoute(route) {
	return '.when(\'' + route.location + '\', {'
		+ 'controller: \'' + route.controller + '\', '
		+ 'templateUrl: \'' + route.template + '\''
		+ '})';
}
