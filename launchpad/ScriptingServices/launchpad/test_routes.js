/* globals $ */
/* eslint-env node, dirigible */

var response = require('net/http/response');
var launchpadExtensions = require('launchpad/utils/launchpadExtensions');

var routes = launchpadExtensions.getRoutes();

response.println(routes);
response.flush();
response.close();
