import Dispatcher from '../core/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import Global from '../constants/Globals';

import debug from 'debug';

class AppActions {

  constructor() {
    this._initialized = false;
    this._debug = debug(Global.DEBUG_NS + 'AppActions');
  }

  pageScroll() {
    Dispatcher.handleViewAction({
      actionType: ActionTypes.SCROLL_PAGE,
      scrollX: window.pageXOffset,
      scrollY: window.pageYOffset
    });
  }

  resize() {
    Dispatcher.handleViewAction({
      actionType: ActionTypes.RESIZE,
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

/*
  loadPage(path, cb) {
    var req = new XMLHttpRequest();
    new Promise((resolve) => {
      req.onload = resolve;
      req.open('get', '/page' + path, true);
      req.send();
    }).then(() => {
        var resp = JSON.parse(req.responseText);
        Dispatcher.handleAppAction({
          actionType: ActionTypes.LOAD_PAGE,
          path: resp.page.path,
          page: resp.page
        });
      }).catch((err) => {
        console.error(err);
      }).then(() => {
        if (cb) {
          cb();
        }
      });
  }
*/

  loadAppData() {
    return new Promise((resolve, reject) => {
      var req = new XMLHttpRequest();
      req.onload = () => {
        if (req.status !== 200) {
          return reject(new Error('Unable to download app data ' + req.statusText));
        }
        try {
          var resp = JSON.parse(req.responseText);
          this._debug('App data received from server', resp);
          Dispatcher.handleAppAction({
            actionType: ActionTypes.APP_DATA,
            data: resp
          });
          resolve(resp);
        } catch(e) {
          reject(e);
        }
      };
      req.open('get', 'data');
      req.send();
    });
  }

  initialise() {
    return new Promise((resolve) => this.loadAppData().then(resolve));
  }
}

export default new AppActions();
