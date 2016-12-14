import React, { Component, PropTypes, Children } from 'react';
import URL from 'url-parse';

/**
 * Provide access to a single but persistent WebSocket connection between the
 * electron renderer and the electron process. By using WebSockets instead of
 * the internal RPC modules we can easily deploy parts of the application as
 * a hosted site as well.
 *
 * @constructor
 * @private
 */
export default class WebSockets extends Component {
  constructor() {
    super(...arguments);

    const url = new URL(location.href, true);
    this.websocket = new WebSocket(url.query.server);
  }

  /**
   * Return the context information that is inherited from this component.
   *
   * @returns {Object} Thing that is shared between all the things.
   * @private
   */
  getChildContext() {
    return {
      websocket: this.websocket
    };
  }

  /**
   * Render only the passed in children so we can work as an active wrapper.
   *
   * @returns {Component}
   * @private
   */
  render() {
    return Children.only(this.props.children);
  }
}

/**
 * PropType validation for the context object.
 *
 * @type {Object} Representation of the context that is transfered.
 * @public
 */
WebSockets.context = {
  websocket: PropTypes.object
};

WebSockets.contextTypes = WebSockets.context;
WebSockets.childContextTypes = WebSockets.context;

/**
 * PropType validation.
 *
 * @type {Object}
 * @private
 */
WebSockets.propTypes = {
  children: PropTypes.element.isRequired
};
