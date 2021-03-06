import React, { Component, PropTypes } from 'react';
import CSSSMode from 'codemirror/mode/css/css';
import CodeMirror from 'react-codemirror';
import WebSockets from '../websocket';
import './editor.scss';

/**
 * Code Editor.
 *
 * @constructor
 * @public
 */
export default class Editor extends Component {
  constructor() {
    super(...arguments);

    this.state = { code: null };
  }

  render() {
    const props = this.props;
    const config = this.context.config();
    const mode = props.mode;

    let value = this.state.code;
    if (value === null) value = config[mode];
    if (!value) value = [
      '/*/',
      ' * This is where you can add custom CSS',
      ' * styling to your overlay.',
      ' * ',
      ' * Usefull class names are:',
      ' * ',
      ' * .dot, .card .wins, .won, .lost',
      ' * .losses, .unfilled, .boons',
      '/*/',
      ''
    ].join('\n');

    const options = {
      scrollbarStyle: 'simple',   // Simple DOM based scroll bars.
      lineNumbers: true,          // Show line numbers.
      tabSize: 2,                 // Tab inserts 2 spaces.
      mode: mode                  // The mode should the editor run in.
    };

    /**
     * The toggle has been changed, update the configuration.
     *
     * @param {String} value The new code.
     * @private
     */
    const onChange = (code) => {
      this.setState({ code: code || '' });
      this.context.rpc('config.set', {
        key: props.mode,
        value: code
      }, () => { });
    }

    return (
      <div>
        <CodeMirror value={ value } options={ options } onChange={ onChange } />
      </div>
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
