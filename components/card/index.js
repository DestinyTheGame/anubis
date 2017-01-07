import React, { Component, PropTypes } from 'react';
import Svg, { Circle, G } from 'svgs';
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
   * Remove our message interception.
   *
   * @private
   */
  componentWillUnmount() {
    this.timer.destroy();
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
    if (!this.state.trials) return null;

    const trials = this.state.trials;
    const props = this.props;
    const padding = 100;
    const design = {
      r: props.radius
    };

    const wins = trials.progress(true, true).map((game, i) => {
      const fill = game ? props.win : props.unfilled;

      return (
        <circle key={ 'win-'+ i } cy={ 50 } cx={ 50 + (i * padding) } { ...design } fill={ fill } />
      )
    });

    const losses = trials.progress(true, false).map((game, i) => {
      const fill = game ? props.loss : props.unfilled;

      return (
        <circle key={ 'loss-'+ i} cy={ 50 + padding } cx={ 50 + (i * padding) } { ...design } fill={ fill } />
      )
    });

    return (
      <Svg width={ props.width } height={ props.height } { ...this.props }>
        <G>
          { wins }
          { losses }
        </G>
      </Svg>
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
  win: PropTypes.string,

  height: PropTypes.number,
  width: PropTypes.number,
  radius: PropTypes.number
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
  loss: '#CA1313',
  win: '#FFD700',
  unfilled: '#757643',
  border: '3',
  radius: 40,

  width: 900,
  height: 250
};
