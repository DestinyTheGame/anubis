import React from 'react';

/**
 * Render the amount of times we've been flawless.
 *
 * @param {Object} props Properties.
 * @returns {Component}
 * @private
 */
export default function Flawless(props) {
  let className;
  let times = +props.times;

  if (times < 10) className = 'beginner';
  else if (times < 20) className = 'intermediate';
  else if (times < 50) className = 'advanced';
  else if (times > 50) className = 'stacked';

  //
  // Special case to make it easy to spot virgins.
  //
  if (times == 0) {
    className = 'virgin';
    times = 'Virgin';
  }

  return (
    <div className={ 'stat ' + className }>
      <strong>
        { times }
      </strong>

      <span>Flawless</span>
    </div>
  );
}
