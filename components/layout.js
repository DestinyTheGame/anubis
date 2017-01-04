import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

/**
 * Layout.
 *
 * @constructor
 * @public
 */
export default class Layout extends Component {
  render() {
    return (
      <div>
        <div className="menu">
          <Link to="/twitch" activeClassName="active" className="item">Twitch chat</Link>
          <Link to="/bot" activeClassName="active" className="item">Anubis bot</Link>
          <Link to="/duma" activeClassName="active" className="item">NetDuma</Link>
          <Link to="/loadout" activeClassName="active" className="item">Loadout</Link>
          <Link to="/vault" activeClassName="active" className="item">Vault</Link>
        </div>
        <div className="content">
          { this.props.children }
        </div>
      </div>
    );
  }
}
