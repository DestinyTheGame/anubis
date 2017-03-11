import classnames from 'classnames';
import React from 'react';
import './emblem.scss';

/**
 * Representation of a Emblem with user information.
 *
 * @param {Object} props Properties
 * @private
 */
export default function Emblem(props) {
  const weekly = props.weekly && !isNaN(props.weekly);
  const kd = classnames('kd', { weekly });

  return (
    <div className='emblem' style={{'backgroundImage':'url(https://www.bungie.net/' + props.background + ')'}} >
      <img src={ 'https://www.bungie.net/' + props.icon } />
      <span className='name'>{ props.name }</span>
      <span className='class'>{ props.subclass }</span>
      <span className='light'>{ props.lightlevel }</span>
      <span className={ kd }>
        <small title='overall'>{ isNaN(props.kd) ? 'No ' : props.kd }</small>

        { weekly && (
            <strong title='weekly'>{ props.weekly }</strong>
          )
        }

        K/D
      </span>
    </div>
  );
}
