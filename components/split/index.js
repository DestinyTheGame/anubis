import React, { Component } from 'react';
import './split.scss';

/**
 * Render Split stats.
 *
 * @param {Object} props Properties.
 * @private
 */
export default function Split(props) {
  return (
    <div className='split'>
      <div className='top'>
        { props.top }
      </div>
      <div className='bottom'>
        { props.bottom }
      </div>
    </div>
  );
}
