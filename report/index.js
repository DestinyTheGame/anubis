import EventEmitter from 'eventemitter3';
import parallel from 'async/parallel';
import reduce from 'async/reduce';
import TickTock from 'tick-tock';
import { get } from '../storage';
import request from 'request';
import map from 'async/map';

/**
 * Generate a Trials Report of the given users.
 *
 * @constructor
 * @private
 */
export default class TrialsReport extends EventEmitter {
  constructor(boot) {
    super();

    this.guardian = boot.get('guardian');
    this.destiny = boot.get('destiny');
    this.timers = new TickTock();

    this.membership = null;
    this.username = null;

    this.fireteam = [];             // Current fire team of the user.
    this.loadout = [];              // Load out of the fire team.
  }

  /**
   * Search for a player.
   *
   * @param {String} username Username.
   * @param {Function} fn Completion callback.
   * @private
   */
  search(username, fn) {
    this.username = username;

    get('playstation', (err, playstation) => {
      if (err) return this.emit('error', err);

      const platform = playstation ? 2 : 1;

      this.destiny.user.search(platform, this.username, (err, matches) => {
        if (err) return this.emit('error', err);
        if (!matches || !matches.length) return fn(new Error('Invalid username'));

        //
        // Call back early so can let the UI know that we've found a matching
        // user.
        //
        this.membership = matches[0].membershipId;
        fn();
      });
    });
  }

  /**
   * Search for a players fire team.
   *
   * @param {String} username Username.
   * @param {Function} fn Completion callback.
   * @private
   */
  lookup(username, fn) {
    this.search(username, (err) => {
      if (err) return fn(err);

      this.members((err) => {
        if (err) return fn(err);

        parallel({
          user: this.user.bind(this),
          trialsreport: this.trialsreport.bind(this)
        }, this.gather(username, fn));
      });
    });
  }

  /**
   * Lookup members of a users fireteam.
   *
   * @param {Function} fn Completion callback.
   * @private
   */
  members(fn) {
    this.guardian.fireteam(this.membership, 14, (err, fireteam) => {
      if (err) return fn(err);

      this.fireteam = fireteam;
      this.emit('fireteam', fireteam);

      fn(undefined, fireteam);
    });
  }

  /**
   * Lookup trials report information if available. When we cannot get this data
   * we'll just fail silently.
   *
   * @param {Function} fn Completion callback.
   * @private
   */
  trialsreport(fn) {
    reduce(this.fireteam, {}, (memo, member, next) => {
      const id = member.membershipId;

      request({
        url: 'https://api.destinytrialsreport.com/anubis/'+ id,
        timeout: 10000,
        json: true
      }, function trialsreport(err, res, body) {
        if (err) {
          debug('API call to destinytrials report failed', err);
          return next(undefined, memo);
        }

        if (res.statusCode !== 200) {
          debug('API call to destinytrials returned invalid statusCode', res.statusCode);
          return next(undefined, memo);
        }

        memo[id] = body[0];
        next(undefined, memo);
      });
    }, (err, report) => {
      if (err) return fn(err);

      this.report = report;
      this.emit('report', report);

      fn(undefined, report);
    });
  }

  /**
   * Generate loadout gather stuff.
   *
   * @param {String} username Username of the original lookup.
   * @param {Function} fn Completion callback.
   * @returns {Function} Gathering function.
   * @private
   */
  gather(username, fn) {
    return (err, gathered) => {
      if (err) return fn(err);
      if (this.username !== username) return;

      let { user, trialsreport } = gathered;

      user.forEach((data) => {
        data.report = trialsreport[data.guardian.membershipId];
      });

      //
      // Sort the users on Elo, highest first so we get consistent results when
      // we're looking up people in a fireteam.
      //
      user = user.sort((a, b) => {
        return b.guardian.elo - a.guardian.elo;
      });

      this.loadout = user;
      this.emit('loadout', this.loadout);

      fn(undefined, user);
      this.refresh();
    };
  }

  /**
   * Gather all the user and equipment information.
   *
   * @param {Function} fn Completion callback.
   * @public
   */
  user(fn) {
    map(this.fireteam, (member, next) => {
      const platform = member.membershipType;
      const id = member.membershipId;

      this.destiny.user.account(platform, id, (err, data) => {
        if (err) return next(err);

        //
        // Make sure we retrieve their last active character from the
        // character's array.
        //
        const char = data.characters.sort(function sort(a, b) {
          const lastA = new Date(a.dateLastPlayed);
          const lastB = new Date(b.dateLastPlayed);

          return +lastA < +lastB;
        })[0];

        const charBase = char.characterBase;

        this.destiny.character.inventory(platform, id, charBase.characterId, (err, inv) => {
          if (err) return next(err);

          next(undefined, {
            guardian: member,
            character: char,
            inventory: inv
          });
        });
      });
    }, fn);
  }

  /**
   * Schedule a new refresh cycle.
   *
   * @private
   */
  refresh() {
    const gather = this.gather(this.username, () => {});

    this.timers.clear();
    this.timers.setTimeout('refresh', () => {
      this.user((err, data) => {
        if (err) return this.refresh();

        //
        // Simulate the same data structure as the lookup function so we can
        // re-use our internally stored data to eliminate some of the HTTP
        // requests we need to make.
        //
        gather(undefined, {
          user: data,
          trialsreport: this.report
        });
      });
    }, 10000);
  }

  /**
   * Kill all the information as the connection has died.
   *
   * @private
   */
  destroy() {
    this.timers.clear();
  }
}
