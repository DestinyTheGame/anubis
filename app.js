import { Router, Route, IndexRedirect, hashHistory } from 'react-router';
import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';

//
// The various of components that we use to render our application.
//
import {
  Card,         // Used for overlay.
  Layout,       // Default application layout.
  Twitch,       // Twitch chat integration.
  NotFound,     // Something went horribly wrong.
  Guardian,     // Guardian.gg lookups
  Dashboard,    // Default rendering of the dashboard.
  WebSocket     // Provides connectivity context.
} from './components';

/**
 * The actual application that is presented to our users.
 *
 * @constructor
 * @public
 */
class Application extends Component {
  constructor() {
    super(...arguments);

    //
    // Detect which UI we need to render. If we are on localhost assume that
    // people want to use our stream overlay layout. This makes the assumption
    // that electron will always serve the application from the `file://`
    // protocol.
    //
    this.streaming = location.hostname === 'localhost';
  }

  /**
   * Render a dedicated stream overlay which is completely different from our
   * default application interface.
   *
   * @returns {Component}
   * @private
   */
  overlay() {
    return (
      <WebSocket>
        <Card />
      </WebSocket>
    );
  }

  /**
   * Render the UI elements.
   *
   * @returns {Component}
   * @private
   */
  render() {
    if (this.streaming) return this.overlay();

    return (
      <WebSocket>
        <Router history={ hashHistory }>
          <Route path="/" component={ Layout }>
            <IndexRedirect to="/guardian" />

            <Route path="guardian" component={ Guardian }>
              <Route path="settings" component={ Guardian.Settings }/>
            </Route>

            <Route path="twitch" component={ Twitch }>
              <Route path="settings" component={ Twitch.Settings }/>
            </Route>

            <Route path="*" component={ NotFound }/>
          </Route>
        </Router>
      </WebSocket>
    );
  }
}

//
// Render the application in our placeholder.
//
render(<Application />, document.getElementById('root'));
