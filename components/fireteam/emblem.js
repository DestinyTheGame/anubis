import React from 'react';

/**
 * Representation of a Emblem with user information.
 *
 * @param {Object} props Properties
 * @private
 */
export default function Emblem(props) {
  return (
    <div className='emblem' style={{'backgroundImage':'url(https://www.bungie.net/' + props.background + ')'}} >
      <img src={ 'https://www.bungie.net/' + props.icon } />
      <span className='name'>{ props.name }</span>
      <span className='class'>{ props.className }</span>
      <span className='light'>{ props.lightlevel }</span>
      <span className='kd'>{ props.kd }K/D</span>
    </div>
  );
}
