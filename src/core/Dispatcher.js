import Flux from 'flux';
import PayloadSources from '../constants/PayloadSources';
import assign from 'react/lib/Object.assign';

/**
 * A singleton that operates as the central hub for application updates.
 * For more information visit https://facebook.github.io/flux/
 */
let Dispatcher = assign(new Flux.Dispatcher(), {

  handleServerAction(action) {
    var payload = {
      source: PayloadSources.SERVER_ACTION,
      action: action
    };
    this.dispatch(payload);
  },

  handleViewAction(action) {
    var payload = {
      source: PayloadSources.VIEW_ACTION,
      action: action
    };
    this.dispatch(payload);
  },

  handleAppAction(action) {
    var payload = {
      source: PayloadSources.APP_ACTION,
      action: action
    };

    this.dispatch(payload);
  }


});

export default Dispatcher;
