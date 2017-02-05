import React, { Component, PropTypes } from 'react';
import CSSSMode from 'codemirror/mode/css/css';
import CodeMirror from 'react-codemirror';
import WebSockets from '../websocket';

/**
 * Code Editor.
 *
 * @constructor
 * @public
 */
export default class Editor extends Component {
  constructor() {
    super(...arguments);

    this.state = { code: '' };
  }

  render() {
    const props = this.props;
    const config = this.context.config();
    const mode = props.mode;
    const value = this.state.code || config[mode];

    const options = {
      scrollbarStyle: 'simple',
      lineNumbers: true,
      tabSize: 2,
      mode: mode
    };

    /**
     * The toggle has been changed, update the configuration.
     *
     * @param {String} value The new code.
     * @private
     */
    const onChange = (code) => {
      this.setState({ code: code });
      this.context.rpc('config.set', {
        key: props.mode,
        value: value
      }, () => { });
    }

    return (
      <CodeMirror value={ value } options={ options } onChange={ onChange } />
    );
  }
}

/**
 * Default properties for the Editor component.
 *
 * @type {Object}
 * @private
 */
Editor.defaultProps = {
  mode: 'css'
};

/**
 * Allow access to the WebSocket context types.
 *
 * @type {Object}
 * @private
 */
Editor.contextTypes = WebSockets.context;
