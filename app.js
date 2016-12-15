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
    const wins = [true, true, false, false, false, false, false, false, false];
    const losses = [true];

    return (
      <WebSocket>
        <Card wins={ wins } losses={ losses } />
      </WebSocket>
    )
  }
}

render(<Application />, document.getElementById('root'));
