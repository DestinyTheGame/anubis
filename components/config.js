import React, { Component, PropTypes } from 'react';
import CSSSMode from 'codemirror/mode/css/css';
import CodeMirror from 'react-codemirror';
import WebSockets from './websocket';
import Toggle from 'react-toggle';

/**
 * Representation of a single configuration control.
 *
 * @constructor
 * @private
 */
class Control extends Component {
  /**
   * Generate the correct element that can hold the configuration value.
   *
   * @returns {Component}
   * @private
   */
  value() {
    const data = this.context.config()[this.props.name];
    const change = (event) => {
      const value = event.target.checked ? this.props.value : null;

      this.context.rpc('config.set', {
        key: this.props.name,
        value: value
      }, () => { });
    };

    switch (this.props.type) {
      case 'textarea': return (
        <textarea ref='element' id={ this.props.name } defaultValue={ data } />
      );

      case 'toggle': return (
        <Toggle id={ this.props.name } defaultChecked={ !!data } onChange={ change } />
      );
    }
  }

  /**
   * Is this configuration value experimental?
   *
   * @private
   */
  experimental() {
    if (!this.props.experimental) return null;

    return (
      <span className="warning">
        This is an experimental configuration settings. Use it with caution.
      </span>
    );
  }

  /**
   * Render the configuration control.
   *
   * @returns
   */
  render() {
    const props = this.props;
    const value = this.value();

    return (
      <div className='grid row gutters'>
        <div className='box twentyfive'>
        { this.value() }
        </div>
        <div className='box note'>
          { props.children } { this.experimental() }
        </div>
      </div>
    );
  }
}

/**
 * The context types we're expecting.
 *
 * @type {Object}
 * @private
 */
Control.contextTypes = WebSockets.context;

export default class Config extends Component {
  render() {
    const boons = {
      mercy: true,
      favor: true,
      boldness: true
    };

    return (
      <div className='config'>
        <Control name='boons' type='toggle' value={ boons } experimental>
          Do you want to "fake" boons on your card
        </Control>

        <Control name='hideWins' type='toggle' value={ true }>
          Do we want to hide wins on the overlay.
        </Control>

        <Control name='hideLosses' type='toggle' value={ true }>
          Do we want to hide losses on the overlay.
        </Control>

        <Control name='showMercy' type='toggle' value={ true }>
          Should we show mercy boon on the overlay
        </Control>

        <Control name='showFavor' type='toggle' value={ true }>
          Should we show favor boon on the overlay
        </Control>

        <Control name='showBoldness' type='toggle' value={ true }>
          Should we show boldness boon on the overlay
        </Control>

        <CodeMirror value={ this.context.config().css } options={{
          lineNumbers: true,
          tabSize: 2,
          mode: 'css'
        }} />
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
Config.contextTypes = WebSockets.context;
