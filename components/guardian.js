import React, { Component, PropTypes } from 'react';
import Loading from 'halogen/PulseLoader';

/**
 * Guardian.
 *
 * @constructor
 * @public
 */
export default class Guardian extends Component {
  constructor() {
    super();

    this.state = {
      results: Guardian.LOADING
    };
  }

  /**
   * Render the guardian.gg layout
   *
   * @returns {Component}
   * @private
   */
  render() {
    let results;

    if (this.state.results === Guardian.LOADING) {
      results = (
        <div className='loading'>
          <Loading color='#eaedf3' />
        </div>
      );
    } else {
      results = (
        <p>Guardian</p>
      );
    }

    return (
      <div className='guardian'>
        <form action='#'>
          <fieldset>
            <input type='text' placeholder='Username' />
            <button type='submit'>
              GO
            </button>
          </fieldset>
        </form>

        <div className='results'>
          { results }
        </div>
      </div>
    );
  }
};

/**
 * Various of loading / fetching states.
 *
 * @type {Number}
 * @private
 */
Guardian.LOADING = 1;

/**
 * Guardian Settings Page.
 *
 * @constructor
 * @public
 */
class Settings extends Component {
  render() {
    return (
      <div>
        Guardian Settings page.
      </div>
    );
  }
}

//
// Expose the Settings page on the Guardian constructor.
//
Guardian.Settings = Settings;
