import React, { Component } from 'react';

/**
 * Representation of a single stat bar.
 *
 * @constructor
 * @private
 */
export default class Stats extends Component {
  render() {
    const props = this.props;
    const value = props.value;

    return (
      <div className='stats'>
        <div className='fill' style={ { width: ((value / 10) * 100) +'%' } }></div>

        <div className='info'>
          <span className='value'>{ value }</span>
          <span className='name'>{ props.name }</span>
        </div>
      </div>
    );
  }
}
