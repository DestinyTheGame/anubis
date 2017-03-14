import classnames from 'classnames';
import React, { Component } from 'react';
import './equipped.scss';

/**
 * Render an equipped item.
 *
 * @param {Object} props Properties.
 * @returns {Component} Equipment.
 * @private
 */
export default class Equipped extends Component {
  /**
   * Check if we need to render usage stats.
   *
   * @returns {Null|Component}
   * @private
   */
  usage() {
    const props = this.props;
    if (!props.usage) return null;

    return (
      <div className='usage-bar'>
        <div className='fill' style={{ width: props.usage.percentage + '%' }}></div>
        <div className='details'>
          <div className='stat'>
            <p>{ props.usage.sum_headshots }</p>
            <strong>Headshots</strong>
          </div>

          <div className='stat'>
            <p>{ props.usage.sum_kills }</p>
            <strong>Kills</strong>
          </div>

          <div className='stat'>
            <p>{ (100 / props.usage.sum_kills * props.usage.sum_headshots).toFixed(0) } %</p>
            <strong>Accuracy</strong>
          </div>
        </div>
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
    const usage = this.usage();

    //
    // User didn't have this item unlocked yet, so we cannot display it.
    //
    if (!props.name) return null;

    const equipped = classnames('equipped', {
      usage: !!usage
    });

    const attack = classnames('attack', {
      [props.element && props.element.name]: props.element
    });


    return (
      <div className={ equipped } data-type={ props.type }>
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

        { usage }
      </div>
    );
  }
}
