import React, { Component } from 'react';
import classnames from 'classnames';
import './equipped.scss';

/**
 * Render an equipped item.
 *
 * @param {Object} props Properties.
 * @returns {Component} Equipment.
 * @private
 */
export default class Equipped extends Component {
  constructor() {
    super(...arguments);

    this.toggle = this.toggle.bind(this);
    this.state = {
      open: false
    };
  }

  /**
   * Toggle the collapsible panel.
   *
   * @private
   */
  toggle() {
    this.setState({
      open: !this.state.open
    });
  }

  /**
   * Render a bar graph about the usage of a given weapon.
   *
   * @returns {Null|Component}
   * @private
   */
  bar() {
    const props = this.props;
    if (!props.usage) return null;

    return (
      <div className='usage-bar'>
        <div className='fill' style={{ width: props.usage.percentage + '%' }}></div>
      </div>
    );
  }

  /**
   * Check if we need to render usage stats.
   *
   * @returns {Null|Component}
   * @private
   */
  usage() {
    const props = this.props;
    if (!props.usage || !this.state.open) return null;

    return (
      <div className='usage'>
        <dl className='stat'>
          <dt>Headshots</dt>
          <dd>{ props.usage.sum_headshots }</dd>
        </dl>

        <dl className='stat'>
          <dt>Kills</dt>
          <dd>{ props.usage.sum_kills }</dd>
        </dl>

        <dl className='stat'>
          <dt>Accuracy</dt>
          <dd>{ (100 / props.usage.sum_kills * props.usage.sum_headshots).toFixed(0) }%</dd>
        </dl>

        <dl className='stat'>
          <dt>Usage</dt>
          <dd>{ (props.usage.percentage).toFixed(0) }%</dd>
        </dl>
      </div>
    );
  }

  /**
   * Render the Equipped component.
   *
   * @returns {Component} The equipped item.
   * @private
   */
  render() {
    const props = this.props;

    //
    // User didn't have this item unlocked yet, so we cannot display it.
    //
    if (!props.name) return null;

    const attack = classnames('attack', {
      [props.element && props.element.name]: props.element
    });

    return (
      <div className='equipped' data-type={ props.type } onClick={ this.toggle }>
        <div className='row'>
          <div className='icon'>
            <span className={ attack }>{ props.attack }</span>
            <img src={ 'https://bungie.net' + props.icon } />
          </div>
          <div className='details'>
            <h3 title={ props.title }>{ props.name }</h3>
            <div className='perks'>
            {
              props.perks && props.perks.map((perk, index) => {
                const className = classnames('perk', {
                  danger: !!perk.danger
                });

                const tooltip = `
                  <div classe='perk-info'>
                    <h2>${ perk.name }</h2>
                    <p>${ perk.title }</p>
                  </div>
                `;

                return (
                  <div className={ className } key={ 'perk-'+ index }>
                    <img
                      id={ 'hash-'+ perk.id }
                      src={ 'https://bungie.net/'+ perk.icon }
                      data-tip={ tooltip }
                    />
                  </div>
                );
              })
            }
            </div>
          </div>

          { this.bar() }
        </div>

        { this.usage() }
      </div>
    );
  }
}
