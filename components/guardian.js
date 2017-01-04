import React, { Component, PropTypes } from 'react';

/**
 * Guardian.
 *
 * @constructor
 * @public
 */
export default class Guardian extends Component {
  render() {
    return (
      <div>
        Guardian.
      </div>
    );
  }
}

/**
 * Guardian Settings Page.
 *
 * @constructor
 * @public
 */
class Settings extends Component {
  render() {
    return (
      <div>
        Guardian Settings page.
      </div>
    );
  }
}

//
// Expose the Settings page on the Guardian constructor.
//
Guardian.Settings = Settings;
