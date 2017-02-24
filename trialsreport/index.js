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
   * Calculate the tier of their int/dis/str build.
   *
   * @param {Number} value Int, Dis or Str.
   * @returns {Object} Tier specification.
   * @private
   */
  tier(value) {
    const max = 300;
    const tierValue = max / 5;

    return {
      value: value,
      tier: Math.floor(Math.min(value, max) / tierValue)
    }
  }

  /**
   * ClassName of the class.
   *
   * @param {Object} base Character base.
   * @returns {String} character classname
   * @private
   */
  className(base) {
    const id = base.classHash;

    if (id === 2271682572) return 'Warlock';
    if (id === 671679327) return 'Hunter';
    if (id === 3655393761) return 'Titan';
  }

  /**
   * Format all the presented data and format it in something useful.
   *
   * @param {Object} guardian Guardian.GG member information.
   * @param {Object} character Active character information.
   * @param {Object} inventory Users active inventory.
   */
  format(guardian, character, inventory) {
    const charBase = character.characterBase;
    const build = charBase.stats;

    return {
      elo: +guardian.elo ? Math.round(guardian.elo) : '-',
      kills: +guardian.kills || 0,
      deaths: +guardian.deaths || 0,
      assists: +guardian.assists || 0,

      emblem: {
        icon: character.emblemPath,
        background: character.backgroundPath,
        name: guardian.name,
        lightlevel: +charBase.powerLevel,
        level: +character.characterLevel,
        grimoire: +charBase.grimoireScore,
        playtime: +charBase.minutesPlayedThisSession,
        className: this.className(charBase)
      },

      build: {
        discipline: this.tier(build.STAT_DISCIPLINE.value),
        intellect: this.tier(build.STAT_INTELLECT.value),
        strength: this.tier(build.STAT_STRENGTH.value),

        armor: build.STAT_ARMOR.value,
        agility: build.STAT_AGILITY.value,
        recovery: build.STAT_RECOVERY.value
      },

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
