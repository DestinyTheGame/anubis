import React from 'react';
import './abilities.scss';

/**
 * Render the users abilities.
 *
 * @param {Object} props Strength, Discipline and Intellect stats.
 * @returns {Component} The user's abilities and cool downs.
 * @public
 */
export default function abilities(props) {
  const { intellect, discipline, strength } = props;

  return (
    <div className='abilities'>
      <dl>
        <dt>Intellect</dt>
        <dd>
          T{ intellect.tier }

          <span className='cooldown'>
            { intellect.cooldown }
          </span>
        </dd>
      </dl>
      <dl>
        <dt>Discipline</dt>
        <dd>
          T{ discipline.tier }

          <span className='cooldown'>
            { discipline.cooldown }
          </span>
        </dd>
      </dl>
      <dl>
        <dt>Strength</dt>
        <dd>
          T{ strength.tier }

          <span className='cooldown'>
            { strength.cooldown }
          </span>
        </dd>
      </dl>
    </div>
  );
}
