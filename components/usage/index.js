import React from 'react';

/**
 * Detailed usage of a given weapon.
 *
 * @param {Object} props Properties of the component.
 * @returns {Component} Usage component.
 * @private
 */
export default function Usage(props) {
  if (!props.sum_kills) return null;

  return (
    <div className='row'>
      <h5>{ props.name }</h5>

      <dl className='stat'>
        <dt>Headshots</dt>
        <dd>{ props.sum_headshots }</dd>
      </dl>

      <dl className='stat'>
        <dt>Kills</dt>
        <dd>{ props.sum_kills }</dd>
      </dl>

      <dl className='stat'>
        <dt>Accuracy</dt>
        <dd>{ (100 / props.sum_kills * props.sum_headshots).toFixed(0) }%</dd>
      </dl>

      <dl className='stat'>
        <dt>Usage</dt>
        <dd>{ (props.percentage).toFixed(0) }%</dd>
      </dl>
    </div>
  );
}
