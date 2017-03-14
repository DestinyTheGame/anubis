import { hide, danger } from './peskyperks';

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
  constructor(character, inventory, definitions, report) {
    this.definitions = definitions;
    this.inventory = inventory;

    this.base = character.characterBase;
    this.stats = this.base.stats;
    this.character = character;
    this.report = report;
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
      subclass: this.subclassName()
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
        || hide(step.nodeStepHash)
        || node.hidden
      ) return;

      nodes.push({
        danger: danger(item.itemTypeName, step.nodeStepHash),
        title: step.nodeStepDescription,
        name: step.nodeStepName,
        id: step.nodeStepHash,
        icon: step.icon,
      });
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
    const { name, bucketHash } = this.slot(slot);
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
    item = item.items.filter((item) => { return item.isEquipped; })[0];
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
      attack: item.primaryStat.value,
      title: item.itemDescription,
      type: item.itemTypeName,
      name: item.itemName,
      icon: item.icon,
      tier: item.tierTypeName,
      slot: name,

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
   * Return the users abilities and their cool downs.
   *
   * @returns {Object} Abilities and their cool downs.
   * @public
   */
  abilities() {
    const discipline = this.stats.STAT_DISCIPLINE.value;
    const disciplineTier = this.tier(discipline);

    const strength = this.stats.STAT_STRENGTH.value;
    const strengthTier = this.tier(strength);

    const intellect = this.stats.STAT_INTELLECT.value;
    const intellectTier = this.tier(intellect);

    return {
      discipline: {
        value: discipline,
        tier: disciplineTier,
        cooldown: this.cooldown('discipline', disciplineTier)
      },
      intellect: {
        value: intellect,
        tier: intellectTier,
        cooldown: this.cooldown('intellect', intellectTier)
      },
      strength: {
        value: strength,
        tier: strengthTier,
        cooldown: this.cooldown('strength', strengthTier)
      }
    };
  }

  /**
   * Get the quality rating of a given armor piece.
   *
   * @param {Object|String} item The result of #equipped()
   * @returns {Number} Stat rating.
   * @public
   */
  quality(item) {
    if ('string' === typeof item) item = this.equipped(item);

    const { slot, stat } = item;
    let split;

    //
    // First step is finding the maximum split roll that every piece of armor
    // could get. Most of this information is directly sourced from reddit <3
    //
    // https://www.reddit.com/r/DestinyTheGame/comments/4geixn/a_shift_in_how_we_view_stat_infusion_12tier
    //
    switch (slot) {
      case 'helmet':
        split = 46;
      break;

      case 'gauntlets':
        split = 41;
      break;

      case 'chest':
        split = 61;
      break;

      case 'legs':
        split = 56;
      break;

      case 'ghost':
      case 'class item':
        split = 25;
      break;

      case 'artifact':
        split = 38;
      break;

      default:
        split = 0;
    }
  }

  /**
   * Return the build of the account.
   *
   * @returns {Object} The build.
   * @public
   */
  build() {
    return {
      armor: this.stats.STAT_ARMOR.value,
      agility: this.stats.STAT_AGILITY.value,
      recovery: this.stats.STAT_RECOVERY.value
    };
  }

  /**
   * Get the complete loadout of the character.
   *
   * @returns {Object}
   * @public
   */
  loadout() {
    let armor = this.equipped('helmet');

    //
    // Try and find an exotic piece of armor to present.
    //
    if (armor.tier !== 'Exotic') armor = this.equipped('arms');
    if (armor.tier !== 'Exotic') armor = this.equipped('body');
    if (armor.tier !== 'Exotic') armor = this.equipped('legs');

    return {
      primary: this.equipped('primary'),
      special: this.equipped('special'),
      heavy: this.equipped('heavy'),

      artifact: this.equipped('artifact'),
      armor: armor
    };
  }

  /**
   * Returns the correct bucket id for a given slot.
   *
   * @param {String} what Name of the slot we're searching for
   * @returns {Object} The bucketHash and normalized name.
   * @private
   */
  slot(what) {
    switch (what) {
      case 'primary':
      return {
        name: 'primary',
        bucketHash: 1498876634
      };

      case 'special':
      case 'secondary':
      return {
        name: 'special',
        bucketHash: 2465295065
      };

      case 'heavy':
      return {
        name: 'heavy',
        bucketHash: 953998645
      };

      case 'ghost':
      return {
        name: 'ghost',
        bucketHash: 4023194814
      }

      case 'head':
      case 'helmet':
      return {
        name: 'helmet',
        bucketHash: 3448274439
      };

      case 'chest':
      case 'body':
      return {
        name: 'chest',
        bucketHash: 14239492
      };

      case 'arm':
      case 'arms':
      case 'glove':
      case 'gloves':
      case 'gauntlet':
      case 'gauntlets':
      return {
        name: 'gauntlets',
        bucketHash: 3551918588
      };

      case 'leg':
      case 'legs':
      case 'boot':
      case 'boots':
      case 'greave':
      case 'greaves':
      return {
        name: 'legs',
        bucketHash: 20886954
      }

      case 'class item':
      case 'class':
      case 'mark':
      case 'bond':
      case 'cape':
      case 'cloak':
      return {
        name: 'class item',
        bucketHash: 1585787867
      };

      case 'artifact':
      return {
        name: 'artifact',
        bucketHash: 434908299
      };
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

    return 'unranked';
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

    return 'Unknown';
  }
}
