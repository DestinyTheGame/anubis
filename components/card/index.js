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

    this.config = this.config.bind(this);
    this.parser = this.parser.bind(this);
    this.state = {
      trials: null,
      boons: {}
    };
  }

  /**
   * Received new configuration changes from the server, process them.
   *
   * @param {Object} data Configuration object.
   * @private
   */
  config(data) {
    this.setState({
      boons: {
        mercy: data.mercy,
        favor: data.favor,
        boldness: data.boldness
      }
    });
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
    this.context.on('config', this.config);

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
   * Unmounted the component.
   *
   * @private
   */
  componentWillUnmount() {
    this.context.off('config', this.config);
  }

  /**
   * Generate the dots for the trials card.
   *
   * @param {Array} data Array where the dots need to be added.
   * @param {String} prop Name of the property.
   * @private
   */
  dot(data, prop) {
    const names = Card.classNames;
    const click = this.props.onClick;

    return (game, i) => {
      const className = [game ? names[prop] : names.unfilled, 'dot', prop].join(' ');

      /**
       * onClick handler so we can start supporting manual mode.
       *
       * @param {Event} e DOM Event
       * @private
       */
      const onClick = (e) => {
        e.preventDefault();
        click(prop, i);
      };

      data.push(
        <div
          onClick={ click ? onClick : undefined }
          className={ className }
          key={ prop +'-'+ i }
        />
      );
    };
  }

  /**
   * Render the trials card.
   *
   * @returns {Component}
   * @private
   */
  render() {
    const inline = this.props.inline ? ' inline' : '';

    //
    // We are still waiting for data at this point, so we can't really render.
    //
    if (!this.state.trials) return (
      <div className={ 'trials loading' + inline }>
        { this.props.children }
      </div>
    );

    const classNames = Card.classNames;
    const trials = this.state.trials;

    //
    // Apply the boons.
    //
    trials.apply(this.state.boons);

    const boon = trials.boons;
    const props = this.props;
    const losses = [];
    const boons = [];
    const wins = [];

    //
    // Generate the normal dots.
    //
    if (!props.wins) trials.won().forEach(this.dot(wins, 'win'));
    if (!props.losses) trials.loss().forEach(this.dot(losses, 'loss'));

    if (props.mercy) {
      const mercy = boon.mercy ? (trials.mercy ? 'boon' : classNames.loss) : classNames.unfilled;
      boons.push(<div title='mercy' key='mercy' className={['dot', 'mercy', mercy].join(' ') } />);
    }

    if (props.favor) {
      boons.push(<div title='favor' key='favor' className={ ['dot', 'favor', boon.favor ? 'boon' : classNames.unfilled].join(' ') } />);
    }

    if (props.boldness) {
      boons.push(<div title='boldness' key='boldness' className={ ['dot', 'boldness', boon.boldness ? 'boon' : classNames.unfilled].join(' ') } />);
    }

    return (
      <div className={ 'trials' + inline }>
        <div className='card'>
          <div className='wins'>
            { wins }
          </div>
          <div className='optional'>
            <div className='losses'>
              { losses }
            </div>
            <div className='boons'>
              { boons }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

/**
 * The classNames for the dots.
 *
 * @type {Object}
 * @private
 */
Card.classNames = {
  unfilled: 'unfilled',
  boon: 'boon',
  loss: 'lost',
  win: 'won'
};

/**
 * PropTypes validation for the trials card.
 *
 * @type {Object}
 * @private
 */
Card.propTypes = {
  inline: PropTypes.bool,
  children: PropTypes.node,
  losses: PropTypes.oneOfType([ PropTypes.string, PropTypes.bool ]),
  wins: PropTypes.oneOfType([ PropTypes.string, PropTypes.bool ]),
  mercy: PropTypes.oneOfType([ PropTypes.string, PropTypes.bool ]),
  favor: PropTypes.oneOfType([ PropTypes.string, PropTypes.bool ]),
  boldness: PropTypes.oneOfType([ PropTypes.string, PropTypes.bool ]),
  onClick: PropTypes.func
};

/**
 * The context types we're expecting
 *
 * @type {Object}
 * @private
 */
Card.contextTypes = WebSockets.context;
