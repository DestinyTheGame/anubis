import classnames from 'classnames';
import React from 'react';
import './equipped.scss';

/**
 * Render an equipped item.
 *
 * @param {Object} props Properties.
 * @returns {Component} Equipment.
 * @private
 */
export default function Equipped(props) {
  const attack = classnames('attack', {
    [props.element && props.element.name]: props.element
  });

  const usage = !props.usage ? null : (
    <div className='usage' style={{ width: props.usage.percentage + '%' }}></div>
  );

  //
  // User didn't have this item unlocked yet, so we cannot display it.
  //
  if (!props.name) return null;

  return (
    <div className='equipped'>
      <div className='icon'>
        <span className={ attack }>{ props.attack }</span>
        <img src={ 'https://bungie.net' + props.icon } />
      </div>
      <div className='details'>
        <h3 title={ props.title }>{ props.name }</h3>
        <div className='perks'>
        {
          props.perks && props.perks.map((perk, index) => {
            const tooltip = `
              <div classe='perk-info'>
                <h2>${ perk.name }</h2>
                <p>${ perk.title }</p>
              </div>
            `;

            return (
              <div className='perk' key={ 'perk-'+ index }>
                <img
                  id={ 'hash-'+ perk.id }
                  src={ 'https://bungie.net/'+ perk.icon }
                  data-tip={ tooltip }
                />
              </div>
            );
          })
        }
        </div>
      </div>

      { usage }
    </div>
  );
}
