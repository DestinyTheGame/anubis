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
      <div className="grid row">
        <div className="menu box twentyfive">
          <Link to="/guardian" activeClassName="active" className="item">Guardian.gg</Link>
          <Link to="/twitch" activeClassName="active" className="item">Twitch chat</Link>
          <Link to="/bot" activeClassName="active" className="item">Anubis bot</Link>
          <Link to="/duma" activeClassName="active" className="item">NetDuma</Link>
          <Link to="/loadout" activeClassName="active" className="item">Loadout</Link>
          <Link to="/vault" activeClassName="active" className="item">Vault</Link>

          <div className="bottom">
            <Link to="/help" activeClassName="active" className="settings">Help</Link>
            <Link to="/overlay" activeClassName="active" className="settings">Overlay</Link>
            <Link to="/settings" activeClassName="active" className="settings">Settings</Link>
            <Link to="/logout" activeClassName="active" className="settings">logout</Link>
          </div>
        </div>
        <div className="box">
          { this.props.children }
        </div>
      </div>
    );
  }
}
