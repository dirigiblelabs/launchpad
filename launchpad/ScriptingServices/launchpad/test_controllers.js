/* globals $ */
/* eslint-env node, dirigible */

var response = require('net/http/response');
var launchpadExtensions = require('launchpad/utils/launchpadExtensions');

var controllers = launchpadExtensions.getControllers();

response.println(controllers);
response.flush();
response.close();
