import React, { Component } from 'react';

/**
 * Representation of users Elo rating.
 *
 * @constructor
 * @private
 */
export default class Elo extends Component {
  constructor() {
    super();

    this.colors = {
      bronze: 'rgb(162, 124, 78)',
      silver: 'rgb(204, 214, 209)',
      gold: 'rgb(231, 194, 68)',
      platinum: 'rgb(77, 158, 130)',
      diamond: 'rgb(75, 139, 189)'
    };
  }

  /**
   * Return the league of Elo that the user is currently in.
   *
   * @param {Number} rating Current rating
   * @returns {String} The current league.
   * @public
   */
  league(rating) {
    rating = Math.round(rating);

    if (rating >= 0 && rating <= 1099) return 'bronze';
    else if (rating >= 1100 && rating <= 1299) return 'silver';
    else if (rating >= 1300 && rating <= 1499) return 'gold';
    else if (rating >= 1500 && rating <= 1699) return 'platinum';
    else if (rating >= 1700 && rating <= 9999) return 'diamond';
  }

  /**
   * Render the component.
   *
   * @private
   */
  render() {
    const rating = this.props.rating;
    const league = this.league(rating);
    const title = 'The bigger the Elo, the smaller the PP. ('+ league +')';

    return (
      <div className='elo' title={ title } style={{ background: this.colors[league] }}>
        { rating }
      </div>
    );
  }
}
