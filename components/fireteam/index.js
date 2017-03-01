import React, { Component } from 'react';
import Abilities from '../abilities';
import Character from './character';
import Tooltip from 'react-tooltip';
import Equipped from '../equipped';
import Emblem from '../emblem';
import Stats from '../stats';
import Elo from './elo';
import './fireteam.scss';

/**
 * Fireteam component.
 *
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
      return Object.assign(data, {
        character: new Character(data.character, data.inventory.data, data.inventory.definitions),
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
      <div className='base'>
        <Stats name='Armour' value={ armor } />
        <Stats name='Recovery' value={ recovery } />
        <Stats name='Agility' value={ agility } />
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
    const { character, kills, deaths } = data;
    const kd = (kills / deaths).toFixed(2);

    return (
      <Emblem { ...character.emblem() } kd={ kd } />
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

    return (
      <Abilities { ...character.abilities() } />
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
   * Render the Fireteam component.
   *
   * @returns {Component}
   * @private
   */
  render() {
    return (
      <div className='fireteam'>
        {
          this.members.map((data, index) => {
            return (
              <div className='member' key={ 'loadout'+ index }>
                { this.emblem(data) }

                <div className='tiers'>
                  { this.stats(data) }
                  { this.abilities(data) }
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