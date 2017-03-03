import React, { Component, PropTypes } from 'react';
import Loading from 'halogen/PulseLoader';
import WebSockets from '../websocket';
import classnames from 'classnames';
import Fireteam from '../fireteam';
import './guardian.scss';

/**
 * Guardian.GG / Trials report searching.
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
    const fireteam = data.loadout;

    if (data.type !== 'report') return;

    if ('err' in data) return this.setState({
      message: data.err.message,
      results: Guardian.ERROR
    });

    if (fireteam) return this.setState({
      results: Guardian.FOUND,
      members: fireteam
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
   * Render a loading screen.
   *
   * @returns {Component} The loading panel.
   * @private
   */
  loading() {
    const color = this.props.small ? '#EAEDF3' : '#7E829B';

    return (
      <div className='loading center'>
        <Loading color={ color } />
      </div>
    );
  }

  /**
   * Show help instructions on how to use this page.
   *
   * @returns {Component} The help panel.
   * @private
   */
  help() {
    return (
      <div className='help center'>
        <p>
          Enter the name of one of your opponents in the search box above to
          generate a trials report of their fire team.
        </p>
      </div>
    );
  }

  /**
   * Received an invalid username, can't search it up so.
   *
   * @returns {Component} The help panel.
   * @private
   */
  invalid() {
    return (
      <div className='help center'>
        <p>
          The supplied username does not exist, did you make typo?
        </p>
      </div>
    );
  }

  /**
   * Render an error state while looking up the users.
   *
   * @returns {Component} The help panel.
   * @private
   */
  error() {
    return (
      <div className='help center'>
        <p>
          Received an unknown error while searching: <strong>{ this.state.message }</strong>
        </p>
      </div>
    );
  }

  /**
   * Present the search results.
   *
   * @returns {Component} The status of the search.
   * @private
   */
  results() {
    switch (this.state.results) {
      case Guardian.LOADING:
        return this.loading();
      break;

      case Guardian.HINT:
        return this.help();
      break;

      case Guardian.ERROR:
        return this.error();
      break;

      case Guardian.INVALID:
        return this.invalid();
      break;

      default:
        return <Fireteam members={ this.state.members } small={ this.props.small } />
      break;
    }
  }

  /**
   * Render the guardian.gg layout
   *
   * @returns {Component}
   * @private
   */
  render() {
    const className = classnames('guardian', {
      main: !this.props.small
    });

    return (
      <div className={ className }>
        <form action='#' onSubmit={ this.search.bind(this) }>
          <fieldset>
            <input type='text' placeholder='Search for username' ref={ r => { this.input = r } } />
            <button type='submit'>
              GO
            </button>
          </fieldset>
        </form>

        <div className='results'>
          { this.results() }
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
