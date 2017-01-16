import React, { Component, PropTypes } from 'react';
import WebSockets from '../websocket';
import StaleState from 'stale-state';
import Trials from './trials';

/**
 * Rendering of the Trials card.
 *
 * @constructor
 * @private
 */
export default class Card extends Component {
  constructor () {
    super(...arguments);

    this.stale = new StaleState({
      interval: '10 second'
    });

    this.parser = this.parser.bind(this);
    this.state = { trials: null };
  }

  /**
   * Receive messages from our server about the trials card. We're interested in
   * inventory updates as we want to get the information from our current trials
   * passage.
   *
   * @param {Object} data Message received from the server.
   * @private
   */
  parser(data) {
    if (data.type !== 'advisors') return;
    if (!('trials' in data.activities)) return;

    return new Trials(data.activities.trials);
  }

  /**
   * Start intercepting inventory messages.
   *
   * @private
   */
  componentDidMount() {
    //
    // We've received changes that are accepted so update the card.
    //
    this.stale.commit((data) => {
      this.setState({ trials: data });
    });

    //
    // Check if the newly received state is better than the previous one. We
    // need to consider:
    //
    // - Deletion of a trials card.
    // - Stale or duplicate response.
    // - Possible character changes.
    //
    this.stale.check((previous, data, state) => {
      if (!previous) return state.accept();
      if (JSON.stringify(previous) === JSON.stringify(data)) return state.same();

      //
      // Valid cases for a card change due to a win or loss.
      //
      if (
           (data.wins > previous.wins)
        || (data.losses > previous.losses)
        || (!data.mercy && previous.mercy)
      ) return state.accept();

      state.decline();
    });

    //
    // Make a new request for the latest data.
    //
    this.stale.request((next) => {
      this.context.rpc('destiny.active.advisors', (err, data) => {
        if (err) return next(err);

        next(undefined, this.parser(data));
      });
    });

    //
    // Retrieve initial set of data.
    //
    this.stale.fetch();
  }

  /**
   * Generate the dots for the trials card.
   *
   * @param {Array} data Array where the dots need to be added.
   * @param {String} prop Name of the property.
   * @private
   */
  dot(data, prop) {
    const props = this.props;

    return (game, i) => {
      const className = [game ? props[prop] : props.unfilled, 'dot', prop].join(' ');

      data.push(<div className={ className } key={ prop +'-'+ i } />);
    };
  }

  /**
   * Render the trials card.
   *
   * @returns {Component}
   * @private
   */
  render() {
    //
    // We are still waiting for data at this point, so we can't really render.
    //
    if (!this.state.trials) return (
      <div className="trials loading">
        { this.props.children }
      </div>
    );

    const trials = this.state.trials;
    const boon = trials.boons;
    const props = this.props;
    const losses = [];
    const boons = [];
    const wins = [];

    //
    // Generate the normal dots.
    //
    trials.won().forEach(this.dot(wins, 'win'));
    trials.loss().forEach(this.dot(losses, 'loss'));

    if (props.mercy) {
      const mercy = boon.mercy ? (trials.mercy ? 'boon' : props.loss) : props.unfilled;
      boons.push(<div title="mercy" key='mercy' className={['dot', 'mercy', mercy].join(' ') } />);
    }

    if (props.favor) {
      boons.push(<div title="favor" key='favor' className={ ['dot', 'favor', boon.favor ? 'boon' : props.unfilled].join(' ') } />);
    }

    if (props.boldness) {
      boons.push(<div title="boldness" key='boldness' className={ ['dot', 'boldness', boon.boldness ? 'boon' : props.unfilled].join(' ') } />);
    }

    return (
      <div className="trials">
        <div className="card">
          <div className="wins">
            { wins }
          </div>
          <div className="optional">
            <div className="losses">
              { losses }
            </div>
            <div className="boons">
              { boons }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

/**
 * PropType validation for the trials card.
 *
 * @type {Object}
 * @private
 */
Card.propTypes = {
  unfilled: PropTypes.string,
  loss: PropTypes.string,
  win: PropTypes.string
};

/**
 * The context types we're expecting
 *
 * @type {Object}
 * @private
 */
Card.contextTypes = WebSockets.context;

/**
 * Default Properties for the trials card.
 *
 * @type {Object}
 * @private
 */
Card.defaultProps = {
  unfilled: 'unfilled',
  boon: 'boon',
  loss: 'lost',
  win: 'won'
};
