import React, { Component, PropTypes, Children } from 'react';
import EventEmitter from 'eventemitter3';
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

    this.broadcast = new EventEmitter();

    //
    // Pre-bind the methods that get shared between all components.
    //
    this.send = this.send.bind(this);
    this.on = this.broadcast.addListener.bind(this.broadcast);
    this.off = this.broadcast.removeListener.bind(this.broadcast);
  }

  /**
   * Start a new WebSocket connection when the component gets mounted.
   *
   * @private
   */
  componentDidMount() {
    const url = new URL(location.href, true);
    const server = url.query.server || url.href.replace('http', 'ws');

    this.websocket = new WebSocket(server);

    this.websocket.onopen = () => {
      this.broadcast.emit('open');
    };

    this.websocket.onmessage = (e) => {
      this.broadcast.emit('message', JSON.parse(e.data));
    };

    this.websocket.onclose = () => {
      this.broadcast.emit('close');
    };
  }

  /**
   * Close the WebSocket connection when the component gets unmounted.
   *
   * @private
   */
  componentWillUnmount() {
    if (!this.websocket) return;

    this.websocket.close();
  }

  /**
   * Send a message over the WebSocket connection.
   *
   * @param {Object} payload Payload that needs to be send over the connection.
   * @public
   */
  send(payload) {
    if (!this.websocket || this.websocket.readState !== WebSocket.OPEN) {
      this.broadcast.once('open', this.send.bind(this, payload));
    }

    this.websocket.send(JSON.stringify(payload));
  }

  /**
   * Return the context information that is inherited from this component.
   *
   * @returns {Object} Thing that is shared between all the things.
   * @private
   */
  getChildContext() {
    return {
      send: this.send,
      off: this.off,
      on: this.on
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
  send: PropTypes.func,
  off: PropTypes.func,
  on: PropTypes.func
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
