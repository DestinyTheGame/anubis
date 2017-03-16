import React, { Component } from 'react';
import classnames from 'classnames';
import Usage from '../usage';
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
   * @param {String} Key Key of the data.
   * @returns {Null|Component}
   * @private
   */
  bar(key) {
    const className = classnames('usage-bar', key);
    const props = this.props;
    const usage = props.usage;

    if (!usage || !usage[key]) return null;

    return (
      <div className={ className }>
        <div className='fill' style={{ width: usage[key].percentage + '%' }}></div>
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
    const usage = props.usage;

    if (!usage || !this.state.open) return null;

    return (
      <div className='usage'>
        <Usage { ...usage.week } name='week' />
        <Usage { ...usage.map } name='map' />
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

    const equipped = classnames('equipped', {
      changed: props.changed,
      expand: props.usage
    });

    return (
      <div className={ equipped } data-type={ props.type } onClick={ this.toggle }>
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

          { this.bar('week') }
          { this.bar('map') }
        </div>

        { this.usage() }
      </div>
    );
  }
}
