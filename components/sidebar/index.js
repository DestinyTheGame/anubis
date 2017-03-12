import React, { Component, PropTypes } from 'react';
import Loading from 'halogen/ClipLoader';
import Guardian from '../guardian';
import './sidebar.scss';

/**
 * Default sidebar.
 *
 * @constructor
 * @public
 */
export default class Sidebar extends Component {
  render() {
    return (
      <div className='sidebar panel'>
        <div className='details'>
          <Guardian small={ true } />
        </div>
      </div>
    );
  }
};
