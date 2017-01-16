import React, { Component, PropTypes } from 'react';
import URL from 'url-parse';
import { Card } from './';

/**
 * Overlay.
 *
 * @constructor
 * @public
 */
export default class Overlay extends Component {
  render() {
    const url = new URL(location.href, true);
    const props = url.query;

    console.log(props);

    return (
      <Card { ...props } />
    );
  }
}
