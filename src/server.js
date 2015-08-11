/*global __DEV__*/

import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import express from 'express';
import React from 'react';
import Router from 'react-router';
import Dispatcher from './core/Dispatcher';
import ActionTypes from './constants/ActionTypes';
import AppStore from './stores/AppStore';
import routes from './routes';

var server = express();

server.set('port', (process.env.PORT || 5000));
server.use(express.static(path.join(__dirname)));

//
// Server API
// -----------------------------------------------------------------------------

server.use('/page/:path', function (req, res) {
  var page = AppStore.getPage('/' + req.params.path) || AppStore.getPage('/error');
  res.send({path: req.params.path, page});
});

// config data
server.use('/data', function (req, res) {
  var data = {};
  res.send(data);
});


//
// Server-side rendering
// -----------------------------------------------------------------------------

// The top-level React component + HTML template for it
var templateFile = path.join(__dirname, 'templates/index.html');
var template = _.template(fs.readFileSync(templateFile, 'utf8'));

var templateData = {
  description: '',
  title: '',
  ugly: __DEV__ ? '.js' : '.min.js',
  onSetTitle: function (title) {
    templateData.title = title;
  },
  onSetMeta: function (name, content) {
    templateData[name] = content;
  }
};

server.get('*', function (req, res) {
  var data = _.merge({}, templateData, {
    path: req.path
  });

  var router = Router.create({location: req.url, routes: routes});
  router.run((Handler) => {
    data.body = React.renderToString(<Handler {...data}/>);
    data.script = 'app.js';
    var html = template(data);
    res.send(html);
  });
});

// Load pages from the `/src/content/` folder into the AppStore
/*
 (function () {
 var fm = require('front-matter');
 var jade = require('jade');
 var sourceDir = path.join(__dirname, './content');
 var getFiles = function (dir) {
 var pages = [];
 fs.readdirSync(dir).forEach(function (file) {
 var stat = fs.statSync(path.join(dir, file));
 if (stat && stat.isDirectory()) {
 pages = pages.concat(getFiles(file));
 } else {
 // Convert the file to a Page object
 var filename = path.join(dir, file);
 var url = filename.substr(sourceDir.length, filename.length - sourceDir.length - 5).replace('\\', '/');
 var source = fs.readFileSync(filename, 'utf8');
 var content = fm(source);
 var html = jade.render(content.body);
 var page = Object.assign({}, {path: url, body: html}, content.attributes);
 Dispatcher.handleServerAction({
 actionType: ActionTypes.LOAD_PAGE,
 path: url,
 page: page
 });
 }
 });
 return pages;
 };
 return getFiles(sourceDir);
 })();
 */

server.listen(server.get('port'), function () {
  if (process.send) {
    process.send('online');
  } else {
    console.log('The server is running at http://localhost:' + server.get('port'));
  }
});
