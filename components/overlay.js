import React, { Component, PropTypes } from 'react';
import WebSockets from './websocket';
import URL from 'url-parse';
import { Card } from './';

/**
 * Overlay.
 *
 * @constructor
 * @public
 */
export default class Overlay extends Component {
  constructor() {
    super(...arguments);

    this.config = this.config.bind(this);
    this.state = {
      css: null
    };
  }

  /**
   * Process the configuration changes.
   *
   * @param {Mixed} value The value of the CSS
   * @private
   */
  config(value) {
    this.setState({ css: value });
  }

  /**
   * The component has been successfully mounted.
   *
   * @private
   */
  componentDidMount() {
    this.context.on('config:css', this.config);
  }

  /**
   * Unmounted the component.
   *
   * @private
   */
  componentWillUnmount() {
    this.context.off('config:css', this.config);
  }

  /**
   * Conditionally render additional style in to the page. This is custom CSS
   * that people can use to create a custom styling for the overlay.
   *
   * @returns {Component}
   * @private
   */
  css() {
    if (!this.state.css) return;

    return (
      <style type="text/css">
        { this.state.css }
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
    const url = new URL(location.href, true);
    const props = url.query;

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
