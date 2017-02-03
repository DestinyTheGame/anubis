import React, { Component, PropTypes } from 'react';
import WebSockets from './websocket';

/**
 * Representation of a single configuration control.
 *
 * @constructor
 * @private
 */
class Control extends Component {
  constructor() {
    super(...arguments);

    this.onSubmit = this.onSubmit.bind(this);
  }

  /**
   * Generate the correct element that can hold the configuration value.
   *
   * @returns {Component}
   * @private
   */
  value() {
    const data = this.context.config()[this.props.name];

    switch (this.props.type) {
      case 'textarea': return (
        <textarea ref='element' id={ this.props.name } defaultValue={ data } />
      );

      case 'input': return (
        <input type='text' defaultValue={ data } ref='element' id={ this.props.name } />
      );

      case 'checkbox': return (
        <input type='checkbox' defaultChecked={ !!data } ref='element' id={ this.props.name } />
      )
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
   * Handle submission of the form.
   *
   * @param {Event} e Browser event.
   * @private
   */
  onSubmit(e) {
    e.preventDefault();

    const element = this.refs.element;
    const props = this.props;

    let value = props.value || element.value;

    if (props.type === 'checkbox') {
      value = element.checked ? value : null;
    }

    this.context.rpc('config.set', {
      key: this.props.name,
      value: value
    }, () => { });
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
      <form onSubmit={ this.onSubmit } method='POST' action='#'>
        <label htmlFor={ props.name }>{ props.name }</label>
        <p className='note'>{ props.children } { this.experimental() }</p>

        { this.value() }
        <button type='submit'>
          OK
        </button>
      </form>
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
        <Control name='css' type='textarea'>
          Change the CSS that is present on the overlay page. This allows you to
          fully customize the look and feel of your trials card.
        </Control>

        <Control name='boons' type='checkbox' value={ boons } experimental>
          Do you want to "fake" boons on your card
        </Control>
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
