import 'babel/polyfill';

import React from 'react';
import FastClick from 'fastclick';
import AppActions from './actions/AppActions';
import Global from './constants/Globals';

import { Router } from 'react-router';
import { History } from 'react-router/lib/History';
import routes from './routes';

import debug from 'debug';

debug.enable(Global.DEBUG_NS + '*');

let setMetaTag = (name, content) => {
  // Remove and create a new <meta /> tag in order to make it work
  // with bookmarks in Safari
  let elements = document.getElementsByTagName('meta');
  [].slice.call(elements).forEach((element) => {
    if (element.getAttribute('name') === name) {
      element.parentNode.removeChild(element);
    }
  });
  let meta = document.createElement('meta');
  meta.setAttribute('name', name);
  meta.setAttribute('content', content);
  document.getElementsByTagName('head')[0].appendChild(meta);
};

function run() {
  // Render the top-level React component
  let props = {
    onSetTitle: (title) => document.title = title,
    onSetMeta: setMetaTag
  };

  React.render(<Router children={routes} history={History}/>, document.getElementById('AppContainer'));
}

new Promise((resolve) => {
  if (window.addEventListener) {
    window.addEventListener('DOMContentLoaded', resolve);
  } else {
    window.attachEvent('onload', resolve);
  }
}).then(() => {
    FastClick.attach(document.body);
    //window.addEventListener('scroll', AppActions.pageScroll);
    //window.addEventListener('resize', AppActions.resize);
    return AppActions.initialise();
  }).then(() => {
    run();
  }).catch((err) => {
    console.error(err);
  });
