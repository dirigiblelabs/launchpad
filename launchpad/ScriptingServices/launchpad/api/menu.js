/* globals $ */
/* eslint-env node, dirigible */

var response = require('net/http/response');
var launchpadExtensions = require('launchpad/extension/launchpadExtensionUtils');

var menu = launchpadExtensions.getMenu();

response.println(JSON.stringify(menu));
response.flush();
response.close();
