/* globals $ */
/* eslint-env node, dirigible */

var response = require('net/http/response');
var launchpadExtensions = require('launchpad/extension/launchpadExtensionUtils');

var homeData = launchpadExtensions.getHomeData();

response.println(JSON.stringify(homeData));
response.flush();
response.close();
