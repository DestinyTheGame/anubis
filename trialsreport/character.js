/**
 * Character model.
 *
 * @constructor
 * @param {Object} character Character base.
 * @param {Object} inventory Character inventory.
 * @param {Object} definitions Definitions lookup.
 * @private
 */
export default class Character {
  constructor(character, inventory, definitions) {
    this.definitions = definitions;
    this.inventory = inventory;

    this.base = character.characterBase;
    this.stats = character.stats;
  }

  /**
   * Cooldown calculations.
   *
   * @param {String} type Name of the stat.
   * @param {Number} teir Teir of the stat.
   * @public
   */
  cooldown(type, tier) {
    let cooldowns = [ '1:00', '0:55', '0:49', '0:42', '0:34', '0:25' ];

    //
    // Intellect has different cooldowns for different supers. Things like
    // discipline and strength doesn't change based on subclass.
    //
    if ('intellect' !== type) return cooldowns[teir];

    const subclass = this.subclassName();
    cooldowns = [ '5:30', '5:14', '4:57', '4:39', '4:20', '4:00' ];

    if (['Sunsinger', 'Defender', 'Striker', 'Nightstalker'].indexOf(this.subclassName())) {
      cooldowns = [ '5:00', '4:46', '4:31', '4:15', '3:58', '3:40' ];
    }

    return cooldowns[teir];
  }

  /**
   * Get the tier of a given value.
   *
   * @param {Number} value Stat value who's tier needs to be calculated.
   * @public
   */
  tier(value) {
    const max = 300;

    return Math.floor(Math.min(value, max) / (max / 5));
  }

  /**
   * Return the league of Elo that the user is currently in.
   *
   * @param {Number} rating Current rating
   * @returns {String} The current league.
   * @public
   */
  leagues(rating) {
    rating = Math.round(rating);

    if (rating >= 0 && rating <= 1099) return 'bronze';
    else if (rating >= 1100 && rating <= 1299) return 'silver';
    else if (rating >= 1300 && rating <= 1499) return 'gold';
    else if (rating >= 1500 && rating <= 1699) return 'platinum';
    else if (rating >= 1700 && rating <= 9999) return 'diamond';
  }

  /**
   * Return a human readable class name for this character.
   *
   * @returns {String} Name of the class.
   * @public
   */
  className() {
    const id = this.base.classHash;

    if (id === 2271682572) return 'Warlock';
    if (id === 671679327) return 'Hunter';
    if (id === 3655393761) return 'Titan';
  }

  /**
   * Return a human readable sub class name for this character.
   *
   * @returns {String} Name of the class.
   * @public
   */
  subclassName() {
    const id = '';

    if (id === 21395672) return 'Sunbreaker';
    if (id === 2007186000) return 'Defender';
    if (id === 2455559914) return 'Striker';
    if (id === 3658182170) return 'Sunsinger';
    if (id === 3828867689) return 'Voidwalker';
    if (id === 1256644900) return 'Stormcaller';
    if (id === 1716862031) return 'Gunslinger';
    if (id === 4143670657) return 'Nightstalker';
    if (id === 2962927168) return 'Bladedancer';
  }
}
