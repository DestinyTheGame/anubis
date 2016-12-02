import { MuiThemeProvider } from 'material-ui';
import React, { Component } from 'react';
import { Wizzard } from './components';
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
      <MuiThemeProvider>
        <Wizzard step={ 0 } />
      </MuiThemeProvider>
    );
  }
}

render(<Application />, document.getElementById('root'));
