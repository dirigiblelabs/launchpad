/* globals $ */
/* eslint-env node, dirigible */

var response = require('net/http/response');
var launchpadExtensions = require('launchpad/utils/launchpadExtensions');

var homeData = launchpadExtensions.getHomeData();

response.println(JSON.stringify(homeData));
response.flush();
response.close();
