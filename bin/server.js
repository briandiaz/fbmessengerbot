#!/usr/bin/env iojs
/* Disable esLint in this file. */
/* eslint disable */

/**
 * Require babel hooks.
 */
require('babel-core/register');
/**
 * Import http system.
 */
var http = require('http');

/**
 * Import any 3rd parties.
 */
require('dotenv').load();
/**
 * Create application by requiring local imports.
 */
var createApplication = require('../src');

const PORT = process.env.PORT || process.env.NODE_PORT || 3000;

http
  .createServer(createApplication().callback())
  .listen(PORT, function onListen() {
    console.log(`App is listening at http://localhost:${PORT}`);
  });
