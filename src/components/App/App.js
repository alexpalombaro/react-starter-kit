import './App.less';
import React, { PropTypes } from 'react';
import AppActions from '../../actions/AppActions';
import AppStore from '../../stores/AppStore';
import Navbar from '../Navbar';
import NotFoundPage from '../NotFoundPage';

class App {

  static propTypes = {
    onSetTitle: PropTypes.func.isRequired,
    onSetMeta: PropTypes.func.isRequired
  };

  render() {
    return (
      <div className="App">
        <Navbar />
        {}
        <div className="navbar-footer">
          <div className="container">
            <p className="text-muted">
              <span>© Alessandro Palombaro</span>
              <span><a href="/">Home</a></span>
              <span><a href="/privacy">Privacy</a></span>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
