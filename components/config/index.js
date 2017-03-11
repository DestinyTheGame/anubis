import React, { Component, PropTypes } from 'react';
import CodeMirror from 'react-codemirror';
import WebSockets from '../websocket';
import Tooltip from 'react-tooltip';
import Toggle from './toggle';
import Editor from './editor';
import './config.scss';

//
// Add some addons to the editor.
//
import AddonCSS from 'codemirror/mode/css/css';
import AddonScroll from 'codemirror/addon/scroll/simplescrollbars.js';

export default class Config extends Component {
  render() {
    const boons = {
      mercy: true,
      favor: true,
      boldness: true
    };

    return (
      <div className='main'>
        <div className='panel config'>
          <Toggle label='Fake boons' name='boons' type='toggle' value={ boons } experimental>
            Fake the purchase of the mercy, favor and boldness boons.
          </Toggle>

          <Toggle label='Hide wins' name='hideWins' type='toggle' value={ true }>
            Hide the wins on the overlay.
          </Toggle>

          <Toggle label='Hide losses' name='hideLosses' type='toggle' value={ true }>
            Hide the losses on the overlay.
          </Toggle>

          <Toggle label='Display Mercy' name='showMercy' type='toggle' value={ true }>
            Show the mercy (and if its been used) in the overlay.
          </Toggle>

          <Toggle label='Display favor' name='showFavor' type='toggle' value={ true }>
            Show the favor boon in the overlay.
          </Toggle>

          <Toggle label='Display boldness' name='showBoldness' type='toggle' value={ true }>
            Show the boldness in the overlay.
          </Toggle>

          <Toggle label='Show in-line' name='showInline' type='toggle' value={ true }>
            Show the wins, losses and boons on a single line.
          </Toggle>
        </div>

        <div className="panel">
          <div className="details">
            <Editor />
          </div>
        </div>

        <Tooltip html={ true } />
      </div>
    );
  }
}

/**
 * Allow access to the WebSocket context types.
 *
 * @type {Object}
 * @private
 */
Config.contextTypes = WebSockets.context;
