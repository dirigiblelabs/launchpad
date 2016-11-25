/* globals $ */
/* eslint-env node, dirigible */

var repository = require('platform/repository');
var generator = require('platform/generator');
var launchpadExtensions = require('launchpad/extension/launchpadExtensionUtils');

processRequest();

function processRequest() {
	var app = getApp();
	sendResponse(app, "text/javascript");
}

function getApp() {
	var resource = repository.getResource("/db/dirigible/registry/public/ScriptingServices/launchpad/template/appTemplate.js");
	var app = resource.getTextContent();
	var parameters = {
		'routes': launchpadExtensions.getRoutes(),
		'controllers': launchpadExtensions.getControllers()
	};
	app = generator.generate(app, parameters);
	return app;
}

function sendResponse(content, contentType) {
	var response = require("net/http/response");

	response.setContentType(contentType);
	response.print(content);
	response.flush();
	response.close();	
}
