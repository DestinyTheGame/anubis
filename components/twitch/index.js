import React, { Component, PropTypes } from 'react';
import Sidebar from '../sidebar';
import './twitch.scss';

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
        <div className='panel twitch'>
          <div className='notice'>
            Twitch authentication is on it's way. This is a place holder where the
            chat of your channel will be shown.
          </div>
        </div>

        <Sidebar />
      </div>
    );
  }
}
