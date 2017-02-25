import React, { Component, PropTypes } from 'react';
import Character from '../../trialsreport/character';
import Loading from 'halogen/PulseLoader';
import WebSockets from '../websocket';
import Emblem from './emblem';
import Stats from './stats';
import Elo from './elo';

/**
 * Guardian.
 *
 * @constructor
 * @public
 */
export default class Guardian extends Component {
  constructor() {
    super();

    this.parser = this.parser.bind(this);
    this.state = {
      results: Guardian.HINT
    };
  }

  /**
   * Start listening to WebSocket messages.
   *
   * @private
   */
  componentDidMount() {
    this.context.on('message', this.parser);
  }

  /**
   * Un-listen to websocket messages.
   *
   * @private
   */
  componentWillUnmount() {
    this.context.off('message', this.parser);
  }

  /**
   * Parse and process incoming messages from the WebSocket server.
   *
   * @param {Object} data Incoming message from WebSocket server.
   * @private
   */
  parser(data) {
    if (data.type !== 'report') return;

    if ('err' in data) return this.setState({
      message: data.err.message,
      results: Guardian.ERROR
    });

    if ('loadout' in data) return this.setState({
      results: Guardian.FOUND,
      loadout: data.loadout
    });
  }

  /**
   * Initialize a new search.
   *
   * @param {Event}
   */
  search(evt) {
    evt.preventDefault();

    this.context.rpc('destiny.trials.report', this.input.value, (invalid) => {
      this.setState({
        results: invalid ? Guardian.INVALID : Guardian.LOADING
      });
    });
  }

  /**
   * Render the guardian.gg layout
   *
   * @returns {Component}
   * @private
   */
  render() {
    let results;

    switch (this.state.results) {
      case Guardian.LOADING:
        results = (
          <div className='loading center'>
            <Loading color='#eaedf3' />
          </div>
        );
      break;

      case Guardian.HINT:
        results = (
          <div className='help center'>
            <p>
              Enter the name of one of your opponents in the search box above to
              generate a trials report of their fire team.
            </p>
          </div>
        );
      break;

      case Guardian.ERROR:
        results = (
          <div className='help center'>
            <p>
              Received an unknown error while searching: <strong>{ this.state.message }</strong>
            </p>
          </div>
        );
      break;

      case Guardian.INVALID:
        results = (
          <div className='help center'>
            <p>
              The supplied username does not exist, did you make typo?
            </p>
          </div>
        );
      break;

      default:
        results = (
          <div className='fireteam'>
          { this.state.loadout.map((loadout, i) => {
            const emblem = loadout.emblem;
            const build = loadout.build;

            // const char = new Character(loadout.character, loadout.inventory.data, loadout.inventory.definitions);
            // console.log(char, char.subclassName(), char.loadout());

            return (
              <div key={ 'loadout'+ i } className='member'>
                <Elo rating={ loadout.elo } />
                <Emblem { ...emblem } kd={ (loadout.kills / loadout.deaths).toFixed(2) } />

                <div className='tiers'>
                  <div className='base'>
                    <Stats name='Armour' value={ build.armor } />
                    <Stats name='Recovery' value={ build.recovery } />
                    <Stats name='Agility' value={ build.agility } />
                  </div>

                  <dl>
                    <dt>Intellect</dt>
                    <dd>T{ build.intellect.tier }</dd>
                  </dl>
                  <dl>
                    <dt>Discipline</dt>
                    <dd>T{ build.discipline.tier }</dd>
                  </dl>
                  <dl>
                    <dt>Strength</dt>
                    <dd>T{ build.strength.tier }</dd>
                  </dl>
                </div>
              </div>
            );
          })}
          </div>
        );
      break;
    }

    return (
      <div className='guardian'>
        <form action='#' onSubmit={ this.search.bind(this) }>
          <fieldset>
            <input type='text' placeholder='Search for username' ref={ r => { this.input = r } } />
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
Guardian.LOADING  = 1;
Guardian.HINT     = 2;
Guardian.INVALID  = 3;
Guardian.ERROR    = 4;
Guardian.FOUND    = 5;

/**
 * The context types we're expecting
 *
 * @type {Object}
 * @private
 */
Guardian.contextTypes = WebSockets.context;

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
