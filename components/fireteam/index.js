import React, { Component } from 'react';
import Character from './character';
import Tooltip from 'react-tooltip';
import classnames from 'classnames';
import Ability from '../abilities';
import Equipped from '../equipped';
import Flawless from './flawless';
import Matches from './matches';
import Emblem from '../emblem';
import Stats from '../stats';
import Ratio from './ratio';
import Elo from './elo';
import './fireteam.scss';

/**
 * Fireteam component.
 *
 * @param {Object} props The properties of the component.
 * @constructor
 * @private
 */
export default class Fireteam extends Component {
  constructor(props) {
    super(...arguments);

    this.process(props);
  }

  /**
   * Process the properties so we can pre-transform the data structures in to
   * workable models.
   *
   * @param {Object} props Component props.
   * @private
   */
  process(props) {
    this.members = props.members.map((data) => {
      const { character, inventory } = data;

      return Object.assign(data, {
        character: new Character(character, inventory.data, inventory.definitions)
      });
    });
  }

  /**
   * Process the properties.
   *
   * @param {Object} props Component props.
   * @private
   */
  componentWillReceiveProps(props) {
    const previous = this.members;
    this.process(props);
    const current = this.members;

    //
    // There are no changes, or it's the first time we look someone up.
    //
    if (!previous || !current || this.id(previous) !== this.id(current)) return;

    //
    // Check the load out for changes and flag the slots as changed.
    //
    // @TODO Armor, Subclass
    //
    current.forEach((member, index) => {
      const prev = previous[index].character;
      const char = member.character;

      [
        'primary',
        'special',
        'heavy',
        'artifact'
      ].forEach((slot) => {
        const prevId = (prev.equipped(slot) || {}).id;
        const currId = (char.equipped(slot) || {}).id;

        if (currId !== prevId) {
          char.changed(slot, true);
        }
      });
    });
  }

  /**
   * Generate a unique id based on a given fireteam.
   *
   * @param {Array} members Array of fireteam members.
   * @returns {String} Generated id
   * @private
   */
  id(members) {
    return members.map((member) => {
      return member.guardian.membershipId;
    }).join('|');
  }

  /**
   * Return the various armor stats.
   *
   * @returns {Component}
   * @private
   */
  stats(data) {
    const { character } = data;
    const { armor, agility, recovery } = character.build();

    return (
      <div className='build'>
        <Stats name='Armour' value={ armor } />
        <Stats name='Recovery' value={ recovery } />
        <Stats name='Agility' value={ agility } />
      </div>
    );
  }

  /**
   * Render the abilities.
   *
   * @param {Object} data All the gathered data.
   * @returns {Component} The users abilities.
   * @private
   */
  abilities(data) {
    const { character } = data;
    const { intellect, discipline, strength } = character.abilities();

    return (
      <div className='abilities'>
        <Ability name='Super' stat={ intellect } />
        <Ability name='Nade' stat={ discipline } />
        <Ability name='Melee' stat={ strength } />
      </div>
    );
  }

  /**
   * Render the emblem of a fire team member including all of its details.
   *
   * @param {Object} data All the gathered data.
   * @returns {Component} User emblem.
   * @private
   */
  emblem(data) {
    const { character, guardian, report } = data;

    let overall = (guardian.kills / guardian.deaths).toFixed(2);
    let weekly;

    if (report && report.currentWeek) {
      const current = report.currentWeek;
      weekly = (current.kills / current.deaths).toFixed(2);
    }

    return (
      <Emblem { ...guardian } { ...character.emblem() } kd={ overall } weekly={ weekly } />
    );
  }

  /**
   * Get all the gear that the user is wearing.
   *
   * @param {Object} data All the gathered data.
   * @returns {Component} The users loadout.
   * @private
   */
  gear(data) {
    if (this.props.small) return;

    const { character } = data;
    const { primary, special, heavy, artifact, armor } = character.loadout();

    if (primary) this.usage(data, primary);
    if (special) this.usage(data, special);
    if (heavy) this.usage(data, heavy);

    return (
      <div className='loadout'>
        <Equipped { ...primary } />
        <Equipped { ...special } />
        <Equipped { ...heavy } />

        <Equipped { ...armor } />
        <Equipped { ...artifact } />
      </div>
    );
  }

  /**
   * Calculate the weapon usage based on the Trials Report stats.
   *
   * @param {Object} data Received data.
   * @param {Object} item Weapon to check.
   * @private
   */
  usage(data, item) {
    if (!data.report) return;

    const statistics = {};

    [
      {
        weapons: data.report.thisWeekWeapons,
        stats: data.report.currentWeek,
        prop: 'week'
      }, {
        weapons: data.report.thisMapWeapons,
        stats: data.report.currentMap,
        prop: 'map'
      }
    ].forEach((spec) => {
      const { weapons, stats, prop } = spec;
      let match;

      //
      // No matching data to process so we want to back out before we assign
      // incorrect data to our statistics report.
      //
      if (!Array.isArray(weapons) || !stats || !weapons.some((weapon) => {
        if (weapon.itemTypeName === item.type) {
          match = weapon;
        }

        return !!match;
      })) return;

      statistics[prop] = Object.assign({
        percentage: (100 / stats.kills) * match.sum_kills
      }, match);
    });

    //
    // Only assign the object if we actually have data to share.
    //
    if (Object.keys(statistics).length) {
      item.usage = statistics;
    }
  }

  /**
   * Render a player's Elo.
   *
   * @param {Object} data Gathered data.
   * @returns {Component} Elo component.
   * @private
   */
  elo(data) {
    const { guardian } = data;

    return (
      <Elo rating={ guardian.elo } />
    );
  }

  /**
   * Amount of flawless's
   *
   * @param {Object} data Gathered data.
   * @returns {Component} Flawless component.
   * @private
   */
  flawless(data) {
    const report = data.report || {};
    const year1 = (report.year1 || {}).flawless || 0;
    const year2 = (report.year2 || {}).flawless || 0;
    const year3 = (report.year3 || {}).flawless || 0;
    const week = report.currentWeek.flawless || 0;

    return (
      <Flawless y1={ year1 } y2={ year2 } y3={ year3 } week={ week } />
    );
  }

  /**
   * Amount of flawless's
   *
   * @param {Object} data Gathered data.
   * @returns {Component} Flawless component.
   * @private
   */
  matches(data) {
    const report = data.report || {};
    const week = report.currentWeek;

    return (
      <Matches played={ week.matches || 0 } />
    );
  }

  /**
   * Amount of flawless's
   *
   * @param {Object} data Gathered data.
   * @returns {Component} Flawless component.
   * @private
   */
  ratio(data) {
    const report = data.report || {};
    const week = report.currentWeek;
    const matches = week.matches || 0;
    const lost = week.losses || 0;
    const won = matches - lost;
    const ratio = (100 * (matches - lost) / matches).toFixed(0);

    return (
      <Ratio ratio={ matches && ratio } />
    );
  }

  /**
   * Render the Fireteam component.
   *
   * @returns {Component} The fireteam member.
   * @private
   */
  render() {
    const className = classnames('fireteam', {
      large: !this.props.small,
      small: this.props.small,
    });

    return (
      <div className={ className }>
        {
          this.members.map((data, index) => {
            const member = classnames('member', {
              panel: !this.props.small,
            });

            return (
              <div className={ member } key={ 'loadout'+ index }>
                { this.emblem(data) }

                <div className='tiers'>
                  { this.stats(data) }
                  { this.abilities(data) }
                </div>

                { this.gear(data) }

                <div className='weekly'>
                  { this.elo(data) }
                  { this.flawless(data) }
                  { this.matches(data) }
                  { this.ratio(data) }
                </div>
              </div>
            );
          })
        }

        <Tooltip html={ true } />
      </div>
    );
  }
}
