import React, { Component, PropTypes } from 'react';
import './notfound.scss';

/**
 * Not Found.
 *
 * @constructor
 * @public
 */
export default class NotFound extends Component {
  render() {
    return (
      <div className='main'>
        <div className='panel'>
          <div className='not-found'>
            <h2>Oh shit, this isn't done yet</h2>

            <p>
              The development of this page hasn't started yet. If this is something
              you would love to see and want to have the priority bumped on this feature
              reach out on our <a href='https://discord.gg/kXn2NmQ'>discord channel</a>.
            </p>

            <p>
              If you are are developer and interested in working on this page or just
              helping out in general.
              Give us a poke at <a href='https://github.com/destinythegame/anubis'>destinythegame/anubis</a> on Github.
            </p>
          </div>
        </div>

        <div className='panel' style={{ width: '33%'}}>
          <img src='./design/crucible.jpg' />
        </div>
      </div>
    );
  }
}
