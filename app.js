import React, { Component, PropTypes } from 'react';
import { Card, Config, WebSocket } from './components';
import { render } from 'react-dom';

/**
 * The actual application that is presented to our users.
 *
 * @constructor
 * @public
 */
class Application extends Component {
  /**
   * Render the UI elements.
   *
   * @returns {Component}
   * @private
   */
  render() {
    return (
      <WebSocket>
        <div>Hello world</div>
      </WebSocket>
    )
  }
}

render(<Application />, document.getElementById('root'));
