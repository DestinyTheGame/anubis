import React, { Component, PropTypes, Children } from 'react';
import EventEmitter from 'eventemitter3';
import URL from 'url-parse';
import yeast from 'yeast';

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
    this.config = {};
    this.rpcfn = {};

    //
    // Pre-bind the methods that get shared between all components.
    //
    this.rpc = this.rpc.bind(this);
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

    //
    // Broadcast our opening.
    //
    this.websocket.onopen = () => {
      this.broadcast.emit('open');
    };

    //
    // Re-broadcast the parsed message if we are not dealing with RPC
    // functionality.
    //
    this.websocket.onmessage = (e) => {
      let data;

      try { data = JSON.parse(e.data); }
      catch (err) { return this.broadcast.emit('error', err); }

      if (data.type == 'rpc' && data.id in this.rpcfn) {
        this.rpcfn[data.id](...data.args);
        delete this.rpcfn[data.id];
      } else if (data.type == 'config' && data.payload) {
        Object.keys(data.payload).forEach((key) => {
          const value = data.payload[key];

          this.config[key] = value;
          this.broadcast.emit('config:'+ key, value);
        });

        this.broadcast.emit('config', this.config);
      } else {
        this.broadcast.emit('message', data);
      }
    };

    //
    // Broadcast our closing.
    //
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

    try { this.websocket.close(); }
    catch (e) {}
  }

  /**
   * Send a message over the WebSocket connection.
   *
   * @param {Object} payload Payload that needs to be send over the connection.
   * @public
   */
  send(payload) {
    if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN) {
      return this.broadcast.once('open', this.send.bind(this, payload));
    }

    this.websocket.send(JSON.stringify(payload));
  }

  /**
   * Send an RPC request to the server.
   *
   * @param {String} endpoint The RPC endpoint we want to hit.
   * @param {Object} data Arguments for the RPC.
   * @param {Function} fn Completion callback.
   * @public
   */
  rpc(endpoint, data, fn) {
    if ('function' === typeof data) {
      fn = data;
      data = null;
    }

    const id = yeast();
    this.rpcfn[id] = fn;
    this.send({ type: 'rpc', endpoint: endpoint, id: id, data: data });
  }

  /**
   * Return the context information that is inherited from this component.
   *
   * @returns {Object} Thing that is shared between all the things.
   * @private
   */
  getChildContext() {
    return {
      config: this.object,
      send: this.send,
      rpc: this.rpc,
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
  config: PropTypes.object,
  send: PropTypes.func,
  off: PropTypes.func,
  rpc: PropTypes.func,
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
