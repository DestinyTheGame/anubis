import React from 'react';

/**
 * Render the amount of matches we've played
 *
 * @param {Object} props Properties.
 * @returns {Component}
 * @private
 */
export default function Matches(props) {
  return (
    <div className='stat'>
      <strong>
        { props.played }
      </strong>

      <span>Matches</span>
    </div>
  );
}
