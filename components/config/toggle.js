import React, { Component, PropTypes } from 'react';
import WebSockets from '../websocket';
import Toggler from 'react-toggle';
import './toggle.scss';

/**
 * Toggle a setting.
 *
 * @constructor
 * @private
 */
export default class Toggle extends Component {
  render() {
    const props = this.props;
    const config = this.context.config();
    const data = config[props.name];

    /**
     * The toggle has been changed, update the configuration.
     *
     * @param {Event} event Change Event from the Toggle component.
     * @private
     */
    const change = (event) => {
      const value = event.target.checked ? props.value : null;

      this.context.rpc('config.set', {
        key: props.name,
        value: value
      }, () => { });
    };

    return (
      <div className='grid row gutters'>
        <div className='box twentyfive'>
          <Toggler id={ props.name } defaultChecked={ !!data } onChange={ change } />
        </div>
        <div className='box'>
          <strong className='label' data-tip={ props.children }>{ props.label }</strong>
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
Toggle.contextTypes = WebSockets.context;
