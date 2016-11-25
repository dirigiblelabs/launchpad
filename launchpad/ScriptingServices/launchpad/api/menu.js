/* globals $ */
/* eslint-env node, dirigible */

var response = require('net/http/response');
var launchpadExtensions = require('launchpad/utils/launchpadExtensions');

var menu = launchpadExtensions.getMenu();

response.println(JSON.stringify(menu));
response.flush();
response.close();
