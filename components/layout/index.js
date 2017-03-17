import React, { Component, PropTypes } from 'react';
import { Link, hashHistory } from 'react-router';
import BurgerMenu from 'react-burger-menu';
import Topbar from '../topbar';
import URL from 'url-parse';
import './layout.scss';
import './menu.scss';

/**
 * Layout.
 *
 * @constructor
 * @public
 */
export default class Layout extends Component {
  constructor() {
    super(...arguments);

    this.ref = null;
    this.toggle = this.toggle.bind(this);
  }

  /**
   * Force closing of menu when the shit is open.
   *
   * @private
   */
  toggle() {
    this.ref.toggleMenu();
  }

  /**
   * Render the burger menu.
   *
   * @returns {Component} Menu bar.
   * @private
   */
  menu() {
    const Menu = BurgerMenu[this.props.animation];
    const url = new URL(location.href, true);
    const overlay = new URL(url.query.server);

    overlay.set('protocol', 'http');

    return (
      <div className='wrap left'>
        <Menu id='menu' pageWrapId='wrap' outerContainerId='container' left ref={ r => this.ref = r}>
          <div className='app-name'>
            <h5>Anubis</h5>
            <h6>Trials Companion App</h6>
          </div>

          <Link to="/guardian" activeClassName="active" className="item" onClick={ this.toggle }>
            <span className="ss-activity icon"></span>

            Stats
          </Link>

          <Link to="/twitch" activeClassName="active" className="item" onClick={ this.toggle }>
            <span className="ss-ellipsischat icon"></span>

            Twitch chat
          </Link>

          <Link to="/bot" activeClassName="active" className="item" onClick={ this.toggle }>
            <span className="ss-robot icon"></span>

            Anubis bot
          </Link>

          <Link to="/duma" activeClassName="active" className="item" onClick={ this.toggle }>
            <span className="ss-compass icon"></span>

            NetDuma
          </Link>

          <Link to="/loadout" activeClassName="active" className="item" onClick={ this.toggle }>
            <span className="ss-tshirt icon"></span>

            Loadout
          </Link>

          <Link to="/vault" activeClassName="active" className="item" onClick={ this.toggle }>
            <span className="ss-oven icon"></span>

            Vault
          </Link>

          <div className="bottom">
            <a href="https://discord.gg/kXn2NmQ" className="settings" target="_blank">
              <span className="ss-lifepreserver icon"></span>

              Help
            </a>
            <a href={ overlay.href } className="settings" target="_blank">
              <span className="ss-desktop icon"></span>

              Overlay
            </a>

            <Link to="/settings" activeClassName="active" className="settings" onClick={ this.toggle }>
              <span className="ss-settings icon"></span>

              Settings
            </Link>

            <a href="/logout" className="settings">
              <span className="ss-power icon"></span>

              Logout
            </a>
          </div>
        </Menu>
      </div>
    );
  }

  /**
   * Render the container, the menu, and everything else.
   *
   * @private
   */
  render() {
    return (
      <div id='container'>
        { this.menu() }

        <div id='wrap'>
          <Topbar />

          { this.props.children }
        </div>
      </div>
    );
  }
}

/**
 * Default properties.
 *
 * @type {Object}
 * @private
 */
Layout.defaultProps = {
  animation: 'push'
};
