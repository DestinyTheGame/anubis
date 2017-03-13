import React, { Component, PropTypes } from 'react';
import Loading from 'halogen/PulseLoader';
import WebSockets from '../websocket';
import Countdown from '../countdown';
import Card from '../card';
import './topbar.scss';

/**
 * The top bar of the application which features all the useful information that
 * people want to see by default.
 *
 * @constructor
 * @public
 */
export default class TopBar extends Component {
  constructor() {
    super(...arguments);

    this.state = {};
    this.advisor = this.advisor.bind(this);
  }

  /**
   * Start listening to WebSocket messages.
   *
   * @private
   */
  componentDidMount() {
    this.context.on('destiny.active.advisors', this.advisor);
  }

  /**
   * Un-listen to WebSocket messages.
   *
   * @private
   */
  componentWillUnmount() {
    this.context.off('message', this.advisor);
  }

  /**
   * Update the state when we have a new advisor update.
   *
   * @param {Object} data Result of the advisor.
   * @private
   */
  advisor(err, data) {
    if (err) return;
    if (data.type !== 'advisors') return;
    if (!('trials' in data.activities)) return;

    const trials = data.activities.trials;

    this.setState(Object.assign(trials.status, trials.display));
  }

  /**
   * Render the TopBar.
   *
   * @returns {Object}
   * @private
   */
  render() {
    const state = this.state;
    const map = state.flavor ? (
      <div className='map'>
        Map of the week is <strong>{ state.flavor }</strong>
      </div>
    ) : (
      <Loading color='#51535e' />
    );

    return (
      <div className='topbar'>
        <div className='trials-card'>
          <Card mercy={ true } boldness={ true } favor={ true } inline={ true }>
            <Loading color='#51535e' />
          </Card>
        </div>

        <Countdown date={ this.state.startDate } prefix='Trials will be live in '>
          { map }
        </Countdown>
      </div>
    );
  }
};

/**
 * The context types we're expecting
 *
 * @type {Object}
 * @private
 */
TopBar.contextTypes = WebSockets.context;
