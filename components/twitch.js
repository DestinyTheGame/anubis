import React, { Component, PropTypes } from 'react';
import Card from './card';

/**
 * Twitch.
 *
 * @constructor
 * @public
 */
export default class Twitch extends Component {
  render() {
    return (
      <div className="grid">
        <div className="box main">
          Twitch.tv chat box ui.
        </div>
        <div className="box thirty sidebar">
          <div className="trials-card">
            <Card />
          </div>
        </div>
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
