import React, { Component, PropTypes } from 'react';
import Svg, { Circle, Rect, G } from 'svgs';

/**
 * Rendering of the Trials card.
 *
 * @constructor
 * @private
 */
export default class Card extends Component {
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
      strokeWidth: props.border,
      stroke: props.stroke,
      r: props.radius
    };

    const wins = props.wins.map((game, i) => {
      const fill = game ? props.win : props.unfilled;

      return (
        <circle key={ 'win-'+ i } cy={ 50 } cx={ 50 + (i * padding) } { ...design } fill={ fill } />
      )
    });

    const losses = props.losses.map((game, i) => {
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
  losses: PropTypes.array.isRequired,
  wins: PropTypes.array.isRequired,

  background: PropTypes.string,
  unfilled: PropTypes.string,
  stroke: PropTypes.string,
  loss: PropTypes.string,
  win: PropTypes.string,

  height: PropTypes.number,
  width: PropTypes.number,
  radius: PropTypes.number
};

/**
 * Default Properties for the trials card.
 *
 * @type {Object}
 * @private
 */
Card.defaultProps = {
  background: '#00ff00',
  loss: '#DC143C',
  win: '#FFD700',
  unfilled: '#757643',
  stroke: '#000000',
  border: '3',
  radius: 40,

  width: 900,
  height: 250
};
