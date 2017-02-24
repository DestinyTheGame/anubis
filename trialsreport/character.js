const hideNodes = [
  21956111,   // Orange Chroma
  73039185,   // Blue Chroma
  74523350,   // Cannibalism
  193091484,  // Increase Strength
  213547364,  // Will of Light
  217480046,  // Twist Fate
  300289986,  // Dreg Burn
  431265444,  // Mutineer
  472357138,  // Void Damage
  519240296,  // White Chroma
  617082448,  // Reforge Ready
  643689081,  // Kinetic Damage
  994456416,  // Burgeoning Hunger
  1034209669, // Increase Intellect
  1259277924, // Red Chroma
  1263323987, // Increase Discipline
  1270552711, // Infuse
  1305317488, // Aspect Swap
  1450441122, // Demotion
  1516989546, // Magenta Chroma
  1644354530, // Sword Strike
  1782221257, // Shank Burn
  1891493121, // Dark Breaker
  1920788875, // Ascend
  1975859941, // Solar Damage
  2086308543, // Upgrade Defense
  2133116599, // Deactivate Chroma
  2470010183, // Hive Disruptor
  2493487228, // Green Chroma
  2688431654, // Arc Damage
  2689436406, // Upgrade Damage
  2845051978, // Ice Breaker
  2978058659, // Oracle Disruptor
  3200611139, // Scabbard
  3575189929, // Hands-On
  3707521590, // Vandal Burn
  3742851299, // Lich Bane
  3838454323, // Yellow Chroma
  3985040583, // Disciplinarian
  4197414939  // Inverse Shadow
];

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
    this.character = character;
  }

  /**
   * All the information that is present on the emblem.
   *
   * @returns {Object}
   * @public
   */
  emblem() {
    return {
      background: this.character.backgroundPath,
      icon: this.character.emblemPath,

      grimoire: +this.base.grimoire,
      level: +this.character.characterLevel,
      lightlevel: +this.base.powerLevel,
    }
  }

  /**
   * Cool down calculations.
   *
   * @param {String} type Name of the stat.
   * @param {Number} tier Tier of the stat.
   * @public
   */
  cooldown(type, tier) {
    const subclass = this.subclassName();
    let cooldowns;

    switch (type) {
      //
      // Discipline is the only cool down that is consistent between all
      // subclasses.
      //
      case 'discipline':
        cooldowns = [ '1:00', '0:55', '0:49', '0:42', '0:34', '0:25' ];
      break;

      //
      // For intellect, most "defensive" supers have a lower cool down that
      // other supers so we need to return the correct set based on subclass.
      //
      case 'intellect':
        if (['Sunsinger', 'Defender', 'Striker', 'Nightstalker'].indexOf(subclass)) {
          cooldowns = [ '5:00', '4:46', '4:31', '4:15', '3:58', '3:40' ];
        } else {
          cooldowns = [ '5:30', '5:14', '4:57', '4:39', '4:20', '4:00' ];
        }
      break;

      //
      // Basically if you have an active charge that can throw stuff, it will take
      // longer to charge so again, return the correct set based on subclass.
      //
      case 'strength':
        if (['Gunslinger', 'Nightstalker'].indexOf(subclass)) {
          cooldowns = [ '1:10', '1:04', '0:57', '0:49', '0:40', '0:29' ];
        } else {
          cooldowns = [ '1:00', '0:55', '0:49', '0:42', '0:34', '0:25' ];
        }
      break;
    }

    return cooldowns[tier];
  }

  /**
   * Helper function for the equipped items to collect and decode all the perks
   * on a given item.
   *
   * @param {Object} item Item definition.
   * @returns {Array} The found nodes.
   * @private
   */
  findPerks(item) {
    const talentGrid = this.definitions.talentGrids[item.talentGridHash];
    const nodes = [];

    if (!talentGrid) return nodes;

    item.nodes.forEach((node, index) => {
      const definition = talentGrid.nodes[index];
      const step = definition.steps[node.stepIndex];

      if (
           !(node.isActivated === true && definition.column > -1)
        || !step
        || !step.nodeStepName
        || ~hideNodes.indexOf(step.nodeStepHash)
      ) return;

      nodes.push({
        name: step.nodeStepName,
        title: step.nodeStepDescription,
        icon: step.icon
      })
    });

    return nodes;
  }

  /**
   * Find the weapon that the user currently has equipped.
   *
   * @param {String} slot What slot should it be in.
   * @returns {Object|Undefined} The found item.
   * @public
   */
  equipped(slot) {
    const bucketHash = this.slot(slot);
    const items = this.inventory.buckets.Equippable

    let item = items.filter((item) => {
      if (!item.items[0]) return false;

      return item.bucketHash === bucketHash;
    }).pop();

    //
    // Unfortunately we couldn't find the requested item so we're going to
    // return here early.
    //
    if (!item) return;


    //
    // Merge definition data with the inventory based item data. First we need
    // to filter out the items that are in our inventory and only return the
    // equipped weapons. This is only a requirement for when we search for our
    // self because the API will return all weapons from our inventory instead
    // of just the one we have equipped.
    //
    item = item.items.filter((item) => { return item.transferStatus === 1; })[0];
    item = Object.assign(this.definitions.items[item.itemHash], item);

    const element = this.definitions.damageTypes[item.damageTypeHash];
    const stats = item.stats.map((stat) => {
      const statDetails = this.definitions.stats[stat.statHash];

      return {
        name: statDetails.statName,
        title: statDetails.statDescription,
        maximum: stat.maximumValue,
        value: stat.value
      }
    });

    return {
      title: item.itemDescription,
      type: item.itemTypeName,
      name: item.itemName,
      icon: item.icon,

      stats: stats,
      element: element && {
        name: element.damageTypeName,
        title: element.description,
        icon: element.iconPath
      },

      perks: this.findPerks(item)
    }
  }

  /**
   * Returns the correct bucket id for a given slot.
   *
   * @param {String} what Name of the slot we're searching for
   * @returns {Number} Bucket id.
   * @private
   */
  slot(what) {
    switch (what) {
      case 'primary':
      return 1498876634;

      case 'special':
      case 'secondary':
      return 2465295065;

      case 'heavy':
      return 953998645;

      case 'ghost':
      return 4023194814;

      case 'head':
      case 'helmet':
      return 3448274439;

      case 'chest':
      case 'body':
      return 14239492;

      case 'arm':
      case 'arms':
      case 'glove':
      case 'gloves':
      case 'gauntlet':
      case 'gauntlets':
      return 3551918588;

      case 'leg':
      case 'legs':
      case 'boot':
      case 'boots':
      case 'greave':
      case 'greaves':
      return 20886954;

      case 'class':
      case 'mark':
      case 'bond':
      case 'cape':
      case 'cloak':
      return 1585787867;

      case 'artifact':
      return 434908299;
    }
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

    return 'Unknown';
  }

  /**
   * Return a human readable sub class name for this character.
   *
   * @returns {String} Name of the class.
   * @public
   */
  subclassName() {
    if (!this.base.peerView) return 'Unknown';

    const id = this.base.peerView.equipment[0].itemHash;

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
