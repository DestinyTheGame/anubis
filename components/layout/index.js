import React, { Component, PropTypes } from 'react';
import { Link, hashHistory } from 'react-router';
import URL from 'url-parse';

/**
 * Layout.
 *
 * @constructor
 * @public
 */
export default class Layout extends Component {
  render() {
    const url = new URL(location.href, true);
    const overlay = new URL(url.query.server);

    overlay.set('protocol', 'http');

    return (
      <div className="grid row">
        <div className="menu box twentyfive">
          <Link to="/guardian" activeClassName="active" className="item">
            Guardian.gg
          </Link>
          <Link to="/twitch" activeClassName="active" className="item">
            Twitch chat
          </Link>
          <Link to="/bot" activeClassName="active" className="item">
            Anubis bot
          </Link>
          <Link to="/duma" activeClassName="active" className="item">
            NetDuma
          </Link>
          <Link to="/loadout" activeClassName="active" className="item">
            Loadout
          </Link>
          <Link to="/vault" activeClassName="active" className="item">
            Vault
          </Link>

          <div className="bottom">
            <a href="https://discord.gg/kXn2NmQ" className="settings" target="_blank">
              Help
            </a>
            <a href={ overlay.href } className="settings" target="_blank">
              Overlay
            </a>

            <Link to="/settings" activeClassName="active" className="settings">
              Settings
            </Link>

            <a href="/logout" className="settings">
              Logout
            </a>
          </div>
        </div>
        <div className="box">
          { this.props.children }
        </div>
      </div>
    );
  }
}
