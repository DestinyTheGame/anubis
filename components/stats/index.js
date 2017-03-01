import React from 'react';
import './stats.scss';

/**
 * Representation of a single stat bar.
 *
 * @param {Object} props Properties.
 * @private
 */
export default function Stats(props) {
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
