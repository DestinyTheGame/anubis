import classnames from 'classnames';
import React from 'react';
import './abilities.scss';

/**
 * Render the users abilities.
 *
 * @param {Object} props Stats and the name of the stat
 * @returns {Component} The user's abilities and cool downs.
 * @public
 */
export default function abilities(props) {
  const { name, stat } = props;
  const tier = classnames(tier, {
    max: +stat.tier === 5
  });

  return (
    <div className='ability'>
      <h4 className={ tier }>
        T{ stat.tier }
      </h4>

      <span className='cooldown'>
        <strong>{ stat.cooldown }</strong>
        <span className='short'>{ name }</span>
      </span>
    </div>
  );
}
