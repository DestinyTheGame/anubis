import React, { Component } from 'react';
import Character from './character';
import Tooltip from 'react-tooltip';
import classnames from 'classnames';
import Ability from '../abilities';
import Equipped from '../equipped';
import Emblem from '../emblem';
import Stats from '../stats';
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
      console.log(data);

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
    //
    // TODO: We've received a new fire team, check if this is the same fire team
    // as before and when this is the case we can start detecting possible
    // changes in their load out and display that to the user. We probably want
    // to look for changes in
    //
    // - Subclass, Primary, Special, Heavy, Armor, Artifact
    //
    const members = this.members;

    this.process(props);
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

    this.usage(data, primary);
    this.usage(data, special);
    this.usage(data, heavy);

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
    const weapons = data.report.thisWeekWeapons;
    const week = data.report.currentWeek;

    if (!Array.isArray(weapons) || !week) return;

    let match;

    if (!weapons.some((weapon) => {
      if (weapon.itemTypeName === item.type) {
        match = weapon;
      }

      return !!match;
    })) return;

    item.usage = Object.assign({
      percentage: (100 / week.kills) * match.sum_kills
    }, match);
  }

  /**
   * Render a player's Elo.
   *
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

                <div className='weekly'>
                  { this.elo(data) }
                </div>

                { this.gear(data) }
              </div>
            );
          })
        }

        <Tooltip html={ true } />
      </div>
    );
  }
}
