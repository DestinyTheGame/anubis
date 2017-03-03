import React, { Component, PropTypes } from 'react';
import WebSockets from '../websocket';
import URL from 'url-parse';
import { Card } from '../';
import './overlay.scss';

/**
 * Overlay.
 *
 * @constructor
 * @public
 */
export default class Overlay extends Component {
  /**
   * Put the CSS in overlay mode so we can apply custom styling to the page
   * which does not bleed through on the application it self.
   *
   * @private
   */
  componentDidMount() {
    document.documentElement.className = 'overlay';
  }

  /**
   * Conditionally render additional style in to the page. This is custom CSS
   * that people can use to create a custom styling for the overlay.
   *
   * @returns {Component}
   * @private
   */
  css() {
    const config = this.context.config();
    if (!config.css) return null;

    return (
      <style type="text/css">
        { config.css }
      </style>
    );
  }

  /**
   * Render the actual overlay component.
   *
   * @returns {Component}
   * @private
   */
  render() {
    const config = this.context.config();
    const props = {
      wins: config.hideWins,
      losses: config.hideLosses,

      mercy: config.showMercy,
      favor: config.showFavor,
      boldness: config.showBoldness,
      inline: config.showInline
    };

    return (
      <div id="overlay">
        { this.css() }

        <Card { ...props } />
      </div>
    );
  }
}

/**
 * The context types we're expecting
 *
 * @type {Object}
 * @private
 */
Overlay.contextTypes = WebSockets.context;
