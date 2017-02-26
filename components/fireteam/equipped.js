import React from 'react';

/**
 * Render an equipped item.
 *
 * @param {Object} props Properties.
 * @returns {Component} Equipment.
 * @private
 */
export default function Equipped(props) {
  return (
    <div className='equipped'>
      <div className='icon'>
        <span className='attack'>{ props.attack }</span>
        <img src={ 'https://bungie.net' + props.icon } />
      </div>
      <div className='details'>
        <h3 title={ props.title }>{ props.name }</h3>

        <div className='perks'>
          {
            props.perks.map((perk, index) => {
              const tooltip = `
                <div classe='perk-info'>
                  <h2>${ perk.name }</h2>
                  <p>${ perk.title }</p>
                </div>
              `;

              return (
                <img
                  key={ 'perk-'+ index }
                  src={ 'https://bungie.net/'+ perk.icon }
                  data-tip={ tooltip }
                />
              );
            })
          }
        </div>
      </div>
    </div>
  );
}
