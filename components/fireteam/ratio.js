import React from 'react';

/**
 * Render the amount of Ratio we've played
 *
 * @param {Object} props Properties.
 * @returns {Component}
 * @private
 */
export default function Ratio(props) {
  return (
    <div className='stat'>
      <strong>
        { props.ratio }%
      </strong>

      <span>Ratio</span>
    </div>
  );
}
