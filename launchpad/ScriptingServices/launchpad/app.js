/* globals $ */
/* eslint-env node, dirigible */

var repository = require('platform/repository');
var generator = require('platform/generator');
var launchpadExtensions = require('launchpad/extension/launchpadExtensionUtils');

const APP_TEMPLATE_LOCATION = '/db/dirigible/registry/public/ScriptingServices/launchpad/template/appTemplate.js';

processRequest();

function processRequest() {
	var app = getApp();
	sendResponse(app, 'text/javascript');
}

function getApp() {
	var parameters = {
		'routes': launchpadExtensions.getRoutes(),
		'controllers': launchpadExtensions.getControllers()
	};
	var app = repository.getResource(APP_TEMPLATE_LOCATION).getTextContent();
	return generator.generate(app, parameters);
}

function sendResponse(content, contentType) {
	var response = require('net/http/response');

	response.setContentType(contentType);
	response.print(content);
	response.flush();
	response.close();	
}