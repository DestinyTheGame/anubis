import EventEmitter from 'eventemitter3';
import { get } from '../storage';
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

    this.membership = null;
    this.username = null;

    this.fireteam = [];             // Current fire team of the user.
    this.loadout = [];              // Load out of the fire team.
  }

  /**
   * Search for a players fire team.
   *
   * @param {String} username Username.
   * @param {Function} fn Completion callback.
   * @private
   */
  search(username, fn) {
    this.username = username;

    get('platform', (err, platform) => {
      if (err) return this.emit('error', err);

      this.destiny.user.search(platform, this.username, (err, matches) => {
        if (err) return this.emit('error', err);
        if (!matches || !matches.length) return fn(new Error('Invalid username'));

        //
        // Call back early so can let the UI know that we've found a matching
        // user.
        //
        this.membership = matches[0].membershipId;
        fn();

        this.guardian.fireteam(this.membership, 14, (err, fireteam) => {
          if (err) return this.emit('error', err);

          this.fireteam = fireteam;
          this.emit('fireteam');

          this.inventory();
        });
      });
    });
  }

  /**
   * Update the inventory of the users.
   *
   * @private
   */
  inventory() {
    const username = this.username;

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

          next(undefined, this.format(member, char, inv));
        });
      });
    }, (err, loadouts) => {
      //
      // Concurrency check, if we are no longer actively searching for the same
      // username / fire team we should discard all the results.
      //
      if (this.username !== username) return;

      if (err) return this.emit('error', err);

      this.loadout = loadouts;
      this.emit('loadout');
    });
  }

  /**
   * Format all the presented data and format it in something useful.
   *
   * @param {Object} guardian Guardian.GG member information.
   * @param {Object} character Active character information.
   * @param {Object} inventory Users active inventory.
   */
  format(guardian, character, inventory) {
    return {
      inventory: inventory,
      character: character,
      guardian: guardian
    };
  }

  /**
   * Kill all the information as the connection has died.
   *
   * @private
   */
  destroy() {

  }
}
