import React, { Component, PropTypes } from 'react';
import Svg, { Circle, Rect, G } from 'svgs';
import WebSockets from './websocket';

/**
 * Rendering of the Trials card.
 *
 * @constructor
 * @private
 */
export default class Card extends Component {
  constructor () {
    super(...arguments);

    this.parser = this.parser.bind(this);
    this.state = {
      flawless: false,
      losses: [],
      wins: []
    };
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

    //
    // Extract the required trials information from the activity. Things like
    // wins on the card are stored on the extanded property.
    //
    const trials = data.activities.trials;
    const scoreCard = trials.extended.scoreCard;
    const mercy = scoreCard.losses === -1;

    //
    // Please note that when a mercy is applied the losses go to -1, creating an
    // invalid array size.
    //
    const losses = (new Array(mercy ? 0 : scoreCard.losses)).fill(true);
    const wins = (new Array(scoreCard.maxWins)).fill(false).map((item, i) => {
      return i < scoreCard.wins;
    });

    this.setState({
      map: trials.display.flavor,
      trials: trials,
      losses: losses,
      mercy: mercy,
      wins: wins
    });
  }

  /**
   * Start intercepting inventory messages.
   *
   * @private
   */
  componentDidMount() {
    this.context.on('message', this.parser);
  }

  /**
   * Remove our message interception.
   *
   * @private
   */
  componentWillUnmount() {
    this.context.off('message', this.parser);
  }

  /**
   * Render the trials card.
   *
   * @returns {Component}
   * @private
   */
  render() {
    const padding = 100;
    const props = this.props;
    const design = {
      r: props.radius
    };

    const wins = this.state.wins.map((game, i) => {
      const fill = game ? props.win : props.unfilled;

      return (
        <circle key={ 'win-'+ i } cy={ 50 } cx={ 50 + (i * padding) } { ...design } fill={ fill } />
      )
    });

    const losses = this.state.losses.map((game, i) => {
      return (
        <circle key={ 'loss-'+ i} cy={ 50 + padding } cx={ 50 + (i * padding) } { ...design } fill={ props.loss } />
      )
    });

    return (
      <Svg width={ props.width } height={ props.height }>
        <Rect fill={ props.background } width={ props.width } height={ props.height } />
        <G>
          { wins }
          { losses }
        </G>
      </Svg>
    )
  }
}

/**
 * PropType validation for the trials card.
 *
 * @type {Object}
 * @private
 */
Card.propTypes = {
  background: PropTypes.string,
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
  background: '#00ff00',
  loss: '#CA1313',
  win: '#FFD700',
  unfilled: '#757643',
  border: '3',
  radius: 40,

  width: 900,
  height: 250
};
