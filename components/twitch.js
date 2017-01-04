import React, { Component, PropTypes } from 'react';

/**
 * Twitch.
 *
 * @constructor
 * @public
 */
export default class Twitch extends Component {
  render() {
    return (
      <div>
        Twitch.
      </div>
    );
  }
}

/**
 * Twitch Settings Page.
 *
 * @constructor
 * @public
 */
class Settings extends Component {
  render() {
    return (
      <div>
        Twitch Settings page.
      </div>
    );
  }
}

//
// Expose the Settings page on the Twitch constructor.
//
Twitch.Settings = Settings;
