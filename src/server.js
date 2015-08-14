import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import express from 'express';
import React from 'react';

import { Router } from 'react-router';
import { Location } from 'react-router/lib/Location';
import routes from './routes';

var server = express();

server.set('port', (process.env.PORT || 5000));
server.use(express.static(path.join(__dirname)));

//
// Server API
// -----------------------------------------------------------------------------
// ...

//
// Server-side rendering
// -----------------------------------------------------------------------------

// The top-level React component + HTML template for it
var templateFile = path.join(__dirname, 'templates/index.html');
var template = _.template(fs.readFileSync(templateFile, 'utf8'));

var templateData = {
  description: 'todo',
  title: 'todo',
  ugly: __DEV__ ? '.js' : '.min.js'
  //onSetTitle: function (title) {
  //  templateData.title = title;
  //},
  //onSetMeta: function (name, content) {
  //  templateData[name] = content;
  //}
};

server.get('*', function (req, res) {
  var data = {...templateData, path: req.path};
  var location = new Location(req.path, req.query);
  Router.run(routes, location, (err, initState, transition) => {
    data.body = React.renderToString(<Router {...initState}/>);
    data.script = 'app.js';
    var html = template(data);
    res.send(html);
  });
});

server.listen(server.get('port'), function () {
  if (process.send) {
    process.send('online');
  } else {
    console.log('The server is running at http://localhost:' + server.get('port'));
  }
});
