import React, { Component } from 'react';

/**
 * Representation of a Emblem with user information.
 *
 * @constructor
 * @private
 */
export default class Emblem extends Component {
  render() {
    const props = this.props;

    return (
      <div className='emblem' style={{'background-image':'url(https://www.bungie.net/' + props.background + ')'}} >
        <img src={ 'https://www.bungie.net/' + props.icon } />
        <span className='name'>{ props.name }</span>
        <span className='class'>{ props.className }</span>
        <span className='light'>{ props.lightlevel }</span>
        <span className='kd'>{ props.kd }K/D</span>
      </div>
    );
  }
}
