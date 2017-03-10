import React, { Component, PropTypes } from 'react';
import Sidebar from '../sidebar';

/**
 * Twitch.
 *
 * @constructor
 * @public
 */
export default class Twitch extends Component {
  render() {
    return (
      <div className='main'>
        <div className='panel'>
          Twitch.tv chat box ui.
        </div>

        <Sidebar />
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
